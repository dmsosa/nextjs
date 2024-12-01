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
        name?: string[];
        email?: string[];
        image_url?: string[];
    },
    message?: string | null;
}
const BenutzerFormSchema = z.object(
    {
        id: z.string(),
        name: z.string({ 
            invalid_type_error: 'der Name der Benutzer ein String seien muss!',
            required_error: 'Bitte geben Sie den Name ein!',
            message: 'Name Fehler'}).min(3, "Der Benutzername muss mindestens 3 Buchstaben lang sein"),
        email: z.string({
            invalid_type_error: 'der Email der Benutzer hat nicht gepasst!',
            required_error: 'Bitte geben Sie den Email ein!',
            message: 'Email Fehler'
        }).email({message: 'Ungültiges Email Adresse'}),
        image_url: z.string({ 
            invalid_type_error: "Bilder Fehler", 
            required_error: "Bilder Fehler: Das URL muss nicht null sein!", 
            message: "Bilder Fehler:"}).url({message: "Ungültiges URL"})
    }
);

const RechnungFormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: 'Bitte wahlen Sie ein Benutzer an'}),
    amount: z.coerce.number().gt(0, 'Bitte geben Sie ein Wert grosseres als 0$ an!'),
    status: z.enum(['pending','paid'], { invalid_type_error: 'Bitte wahlen Sie ein Status an'}),
    date: z.string(),
});

const BenutzerErstellen = BenutzerFormSchema.omit({ id: true  });
const RechnungErstellen = RechnungFormSchema.omit({ id: true, date: true});

export async function rechnungErstellen(prevState: TActionState, formData?: FormData) {
    if (!formData) { return { errors: {}, message: "Kein FormData beim Bearbeitung der Rechnung"} };

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
        console.log("Datenbankfehler: Fehler bei der Erstellen der Rechnung!\n" + error.message);
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

export async function benutzerErstellen(prevState: TActionState, formData?: FormData ) {

    if (!formData) {
        return { errors: {}, message: "Kein FormData beim Bearbeitung der Benutzer"}
    }

    const validatedFields = BenutzerErstellen.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        image_url: formData.get("image_url"),
    });

    if (!validatedFields.success) {
        return ({ errors: validatedFields.error.flatten().fieldErrors, message: "Fehler bei der Erstellen von Benutzer"});
    }

    const { name, email, image_url } = validatedFields.data || {}; 

    try {
        await sql`INSERT INTO customers (name, email, image_url) VALUES
        (${name}, ${email}, ${image_url})`;
    } catch (error: any) {
        console.log("Datenbankfehler: Fehler bei der Erstellen der Benutzer!\n" + error.message);
        return {errors: undefined, message: "Datenbankfehler: Fehler bei Erstellen der Benutzer in Datenbank" }
    }

    revalidatePath("/dashboard/benutzer");
    redirect("/dashboard/benutzer");

}
export async function benutzerBearbeiten(customerId: string, prevState: TActionState, formData?: FormData) {

    if (!formData) {
        return { errors: {}, message: "Kein FormData beim Bearbeitung der Benutzer"}
    }

    const validatedFields = BenutzerErstellen.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        image_url: formData.get("image_url"),
    });

    if (!validatedFields.success) {
        return ({ errors: validatedFields.error.flatten().fieldErrors, message: "Fehler bei der Erstellen von Benutzer"});
    }

    const { name, email, image_url } = validatedFields.data || {}; 

    try {
        await sql`UPDATE customers 
        SET name = ${name}, 
        email = ${email},
        image_url = ${image_url}  
        WHERE id = ${customerId}`;
    } catch (error: any) {
        console.log("Datenbankfehler: Fehler bei der Erstellen der Benutzer!\n" + error.message);
        return {errors: undefined, message: "Datenbankfehler: Fehler bei Erstellen der Benutzer in Datenbank" }
    }

    revalidatePath("/dashboard/benutzer");
    redirect("/dashboard/benutzer");
}
export async function benutzerEntfernen(customerId: string) {
    try {
        sql`DELETE FROM invoices WHERE customer_id = ${customerId}`
        sql`DELETE FROM customers WHERE id = ${customerId}`;
    } catch (error: any) {
        console.log("Fehler beim Löschen der Benutzer!\n" + error.message);
        throw new Error("Fehler beim Löschen der Benutzer" + error.message);
    }
    revalidatePath('/dashboard/benutzer');
}