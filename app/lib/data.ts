import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { customCurrencyFormatter } from './helpers';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;


    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
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

export async function fetchPaidInvoices() {
  try {
    const paidInvoices = await sql`SELECT COUNT(*) AS "invoices" `;
    return Number(paidInvoices.rows[0].paid ?? '0');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
export async function fetchCustomerById(firstName: string) {
  try {

    const data = await sql`SELECT * FROM customers WHERE name ILIKE ${`${firstName}%`}`;
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer by id data.');
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
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
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
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

const BENUTZER_PRO_SEITE = 6;
export async function fetchBenutzerBeiFilter(query: string, aktuellSeite: number, filter?: 'name' | 'email',) {
  const offset = (aktuellSeite - 1) * BENUTZER_PRO_SEITE;

  try {
    let customers;
    if (!filter) {
      customers = await sql`SELECT * FROM customers 
      WHERE id::text ILIKE ${`%${query}%`} OR 
      name ILIKE ${`%${query}%`} OR 
      email ILIKE ${`%${query}%`}`;
    } else {
      customers = await sql`SELECT * FROM customers
      WHERE ${filter} ILIKE ${`%${query}%`}`;
    }
    return customers.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchBenutzerSeiten(query: string, filter?: 'name' | 'email') {
  let sqlQuery;
  if (!filter) {
    sqlQuery = sql`SELECT COUNT(*) FROM customers 
      WHERE id::text ILIKE ${`%${query}%`} OR 
      name ILIKE ${`%${query}%`} OR 
      email ILIKE ${`%${query}%`}`;
  } else {
    sqlQuery = sql`SELECT COUNT(*) FROM customers
      WHERE ${filter} ILIKE ${`%${query}%`}`;
  }
  try {
    const count = await sqlQuery;
    const totalPages = Math.ceil(Number(count.rows[0].count) / BENUTZER_PRO_SEITE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Fehler bei erhaltung fur Gesamtzahl der Benutzer.');
  }
}
export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
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
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
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
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
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
