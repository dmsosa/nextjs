'use server';

import { sql } from '@vercel/postgres';
import {  revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';    

export type TActionState = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    },
    message?: string | null;
}
const RechnungFormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: 'Bitte wahlen Sie ein Benutzer an'}),
    amount: z.coerce.number().gt(0, 'Bitte geben Sie ein Wert grosseres als 0$ an!'),
    status: z.enum(['pending','paid'], { invalid_type_error: 'Bitte wahlen Sie ein Status an'}),
    date: z.string(),
});

const RechnungErstellen = RechnungFormSchema.omit({ id: true, date: true});

export async function invoiceErstellen(prevState: TActionState, formData?: FormData) {
    if (!formData) { return { message: "Bitte geben Sie der FormData an!"} };
    const validatedFields = RechnungErstellen.safeParse({ 
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });


    if (!validatedFields.success) {
        return {errors: validatedFields.error.flatten().fieldErrors, message: "Fehler bei Erstellen der Rechnung!"};
    }
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`INSERT INTO invoices (customer_id, amount, status, date) 
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
    } catch (error: any) {
        console.log("Fehler bei der Erstellen der Rechnung!\n" + error.message);
        return {errors: undefined, message: "Datenbankfehler: Fehler bei Speichern der Rechnung in Datenbank" }
    }

    revalidatePath('/dashboard/rechnungen');
    redirect('/dashboard/rechnungen');
}

export async function rechnungBearbeiten(id: string, prevState: TActionState, formData?: FormData) {
    if (!formData) { return { message: "Bitte geben Sie der FormData an!"} };
    const { customerId, amount, status } = RechnungErstellen.parse({
        customerId: formData.get('customerId'),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    const amountInCents = amount * 100;

    try {

        await sql`UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}`;
    } catch (error: any) {
        console.log("Fehler bei der Bearbeitung der Rechnung!\n" + error.message);
        throw new Error("Fehler bei Erstellen der Rechnung" + error.message);
    }
    revalidatePath('/dashboard/rechnungen');
    redirect('/dashboard/rechnungen');
}

export async function rechnungEntfernen(id: string) {
    try {
        sql`DELETE FROM invoices WHERE id = ${id}`
    } catch (error: any) {
        console.log("Fehler bei der Bearbeitung der Rechnung!\n" + error.message);
        throw new Error("Fehler bei Erstellen der Rechnung" + error.message);
    }
    revalidatePath('/dashboard/rechnungen');
}