import { Seiten } from '@/app/ui/invoices/pagination';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import Suchen from '@/app/ui/search';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Suspense } from 'react';
import InvoicesTable from '@/app/ui/invoices/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
 
export default async function Page(props: { searchParams: Promise<{  query: string, page: string }> }) {

    const params = await props.searchParams;
    const query  = params?.query || '';
    const currentPage = Number(params?.page) || 1;
    const seitenAnzahl = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Rechnung</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suchen platzhalter="Rechnung suchen..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Seiten seiteAnzahl={seitenAnzahl} />
      </div>
    </div>
  );
}