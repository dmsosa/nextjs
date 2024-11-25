import { Seiten } from '@/app/ui/invoices/pagination';
import { CreateRechnung } from '@/app/ui/invoices/buttons';
import Suchen from '@/app/ui/search';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Suspense } from 'react';
import InvoicesTable from '@/app/ui/invoices/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page(props: { searchParams: Promise<{  query: string, page: string }> }) {

    const params = await props.searchParams;
    const query  = params?.query || '';
    const currentPage = Number(params?.page) || 1;
    const seitenAnzahl = await fetchInvoicesPages(query);

  return (
    <main>
      <Breadcrumbs breadcrumbs={[{label: 'Rechnungen', href: '/dash/invoice', active: true}]}/>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suchen platzhalter="Rechnung suchen..." />
        <CreateRechnung />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Seiten seiteAnzahl={seitenAnzahl} />
      </div>
    </main>
  );
}