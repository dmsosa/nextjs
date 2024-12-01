import { sql } from '@vercel/postgres';
import {
  TBenutzerTabelle,
  LetzteRechnungRaw,
  TBenutzerTabelleFormatted,
  TRechnungTabelleFormatted,
  TRechnungTabelle,
  TBenutzer,
  TRevenue,
  BenutzerFeld,
  RechnungForm,
  LetzteRechnung,
  TRechnung,
} from './definitions';
import { formatCurrency } from './utils';
import { customCurrencyFormatter, customDateFormatter } from './helpers';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<TRevenue>`SELECT * FROM revenue`;


    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLetzteRechnung() : Promise<LetzteRechnung[]> {
  try {
    const data = await sql<LetzteRechnungRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: customCurrencyFormatter(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchBenutzer() {
  try {
    const data = await sql<BenutzerFeld>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Fehler beim Abholung der Benutzerdaten.');
  }
}
export async function fetchRechnungBeiId(id: string) {
  try {
    const data = await sql<RechnungForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Fehler beim Abholung der Rechnungdaten.');
  }
}

export async function fetchBenutzerBeiId(id: string) : Promise<TBenutzer> {
  try {

    const data = await sql`SELECT * FROM customers WHERE id = ${id}`;
    return data.rows[0] as TBenutzer;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Fehler bei Erhalten der Benutzer mit Id.');
  } 

}
export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoicesDataPromise = sql`SELECT count(*) as "collected", SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as "paid", SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as "pending" FROM invoices`;


    const data = await Promise.all([
      invoicesDataPromise,
      customerCountPromise,
    ]);
    const numberOfInvoices = Number(data[0].rows[0].collected ?? '0');
    const totalPaidInvoices = formatCurrency(data[0].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[0].rows[0].pending ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchRechnungenBeiFilter(
  query: string,
  currentPage: number,
) : Promise<TRechnungTabelleFormatted[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<TRechnungTabelle>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.id::text ILIKE ${`%${query}%`} OR
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows.map((invoice) => ({
      ...invoice,
      amount: customCurrencyFormatter(invoice.amount),
      date: customDateFormatter(invoice.date),
    })) as TRechnungTabelleFormatted[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

const BENUTZER_PRO_SEITE = 6;
export async function fetchBenutzerBeiFilter(query: string, aktuellSeite: number, filter?: 'name' | 'email',): Promise<TBenutzerTabelleFormatted[]> {
  const offset = (aktuellSeite - 1) * BENUTZER_PRO_SEITE;

  try {
    let customers;
    if (!filter) {
      customers = await sql<TBenutzerTabelle>`
      SELECT 
      customers.id, 
      customers.name, 
      customers.email, 
      customers.image_url,
      COUNT (invoices.id) AS total_invoices,
      SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid,
      SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending
      FROM customers LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE customers.id::text ILIKE ${`%${query}%`} OR 
      customers.name ILIKE ${`%${query}%`} OR 
      customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
		  ORDER BY customers.name ASC
      LIMIT ${BENUTZER_PRO_SEITE} OFFSET ${offset}`;
    } else {
      customers = await sql`SELECT 
      customers.id, 
      customers.name, 
      customers.email, 
      customers.image_url,
      COUNT (invoices.id) as "total_invoices",
      SUM(CASE WHEN invoices.status = 'paid' THEN 1 ELSE 0 END) as "total_paid",
      SUM(CASE WHEN invoices.status = 'paid' THEN 1 ELSE 0 END) as "total_pending"
      FROM customers LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE customers.${filter} ILIKE ${`%${query}%`}
      LIMIT ${BENUTZER_PRO_SEITE} OFFSET ${offset}`;
    }
    return customers.rows.map((customer) => ({
      ...customer, 
      total_paid: customCurrencyFormatter(customer.total_paid),
      total_pending: customCurrencyFormatter(customer.total_pending),
    })) as TBenutzerTabelleFormatted[]; 
  } catch (error) {
    console.error('Dateinbank Fehler:', error);
    throw new Error('Fehler beim Erhalten von Benutzer.');
  }
}

export async function fetchRechnungSeiten(query: string) {
  try {
    let count;
    if (query.length < 1) {
      count = await sql`SELECT COUNT(*)
      FROM invoices;
    `;
    } else {
      count = await sql`SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;
    }
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchBenutzerSeiten() {
  const count = await sql`SELECT COUNT(*) FROM customers`;

  return Math.ceil(count.rows[0].count / BENUTZER_PRO_SEITE);
}



export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<TBenutzerTabelle>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
