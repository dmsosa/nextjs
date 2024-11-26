import { fetchBenutzerBeiFilter, fetchBenutzerSeiten } from "@/app/lib/data"
import BenutzerTabelle, { BenutzerTabelleSkeleton } from "@/app/ui/benutzer/benutzer-tabelle";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/rechnungen/pagination";
import Suchen from "@/app/ui/search";
import { Suspense } from "react";

export default async function Page(props: { params?: Promise<{ query: string, page: string }> }) {

    //fetch customer
    const searchParams = await props.params;
    const query = searchParams?.query || '';
    const aktuellSeite = Number(searchParams?.page) || 1;
    const seitenAnzahl = await fetchBenutzerSeiten(query);
    return ( 
        <div className="w-full">
            <div className="flex w-full justify-between items-center">
                <h1 className={`${lusitana.className} text-xl`}>Alle Benutzer</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Suchen platzhalter="Benutzer suchen..."/>
                {/* benutzer erstellen */}
            </div>
            <div>
                <Suspense fallback={<BenutzerTabelleSkeleton />}>
                    <BenutzerTabelle query={query} aktuellSeite={aktuellSeite}/>
                </Suspense>
            </div>
            <div className="w-full flex justify-center mt-10">
                <Pagination totalPages={seitenAnzahl}/>
            </div>
        </div>
    )
}