import { fetchBenutzerSeiten } from "@/app/lib/data"
import { CreateBenutzer } from "@/app/ui/benutzer/knopfen";
import BenutzerTabelle  from "@/app/ui/benutzer/table";
import { lusitana } from "@/app/ui/fonts";
import Seiten from "@/app/ui/pagination";
import Suchen from "@/app/ui/search";
import { BenutzerTabelleSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page(props: { searchParams?: Promise<{ query: string, page: string }> }) {

    //fetch customer
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const aktuellSeite = Number(searchParams?.page) || 1;
    const seitenAnzahl = await fetchBenutzerSeiten();


    return ( 
        <div className="w-full">
            <div className="flex w-full justify-between items-center">
                <h1 className={`${lusitana.className} text-xl`}>Alle Benutzer</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Suchen platzhalter="Benutzer suchen..."/>
                <CreateBenutzer/>
            </div>
            <div>
                <Suspense fallback={<BenutzerTabelleSkeleton />}>
                    <BenutzerTabelle query={query} aktuellSeite={aktuellSeite}/>
                </Suspense>
            </div>
            <div className="w-full flex justify-center mt-10">
                <Seiten seitenAnzahl={seitenAnzahl}/>
            </div>
        </div>
    )
}