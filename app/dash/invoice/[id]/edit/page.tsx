import { fetchCustomers, fetchRechnungBeiId } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
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
                { label: "Rechnungen", href: '/dash/invoice'}, { label: "Update", href: `/dash/invoice/${id}/edit`, active: true}
            ]}/>
            <Suspense fallback={<InvoicesTableSkeleton/>}>
                <EditInvoiceForm  invoice={invoice} customers={customers}/>
            </Suspense>
        </main>
    );
}