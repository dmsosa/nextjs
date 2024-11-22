'use server';

import { sql } from '@vercel/postgres';
import { expirePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';    


const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending','paid']),
    date: z.string(),
});

const InvoiceErstellen = InvoiceFormSchema.omit({ id: true, date: true});

export async function invoiceErstellen(formData: FormData) {
    const { customerId, amount, status } = InvoiceErstellen.parse({ 
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    const data = await sql`INSERT INTO invoices (customer_id, amount, status, date) 
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;


        
    expirePath('dash/invoice');
    redirect('dash/invoice');
}