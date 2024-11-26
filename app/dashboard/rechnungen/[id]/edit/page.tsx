import { fetchCustomers, fetchRechnungBeiId } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/rechnungen/breadcrumbs";
import EditInvoiceForm from "@/app/ui/rechnungen/edit-form";
import { RechnungenTabelleSkeleton } from "@/app/ui/skeletons";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page(props: { params?: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params?.id || '';
    const [invoice, customers] = await Promise.all([
        fetchRechnungBeiId(id),
        fetchCustomers(),
      ]);

      if (!invoice) {
        notFound();
      }
      
    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                { label: "Rechnungen", href: '/dashboard/rechnungen'}, { label: "Bearbeiten", href: `/dashboard/rechnungen/${id}/edit`, active: true}
            ]}/>
            <Suspense fallback={<RechnungenTabelleSkeleton/>}>
                <EditInvoiceForm  invoice={invoice} customers={customers}/>
            </Suspense>
        </main>
    );
}