import { fetchBenutzerSeiten } from "@/app/lib/data";
import { CreateBenutzerForm } from "@/app/ui/benutzer/benutzer-form";
import BenutzerTabelle from "@/app/ui/benutzer/table";
import Seiten from "@/app/ui/pagination";
import Breadcrumbs from "@/app/ui/rechnungen/breadcrumbs";
import { BenutzerTabelleSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page(props: { searchParams?: Promise<{ query: string, page: string }> }) {

    const searchParams = await props.searchParams;
    const aktuellSeite = Number(searchParams?.page) || 1;
    const seitenAnzahl = await fetchBenutzerSeiten();

    return (
        <main>
            <Breadcrumbs 
            breadcrumbs={[
                { 
                    href: "/dashboard/benutzer", 
                    label: "Benutzer"
                }, 
                { 
                    href: "/dashboard/benutzer/create", 
                    label: "Erstellen", 
                    active: true
                }
            ]}
            />
            <CreateBenutzerForm/>
            <div>
                <h1 className="text-left font-bold mt-10 mb-2 text-lg">Andere Benutzer</h1>
                <Suspense fallback={<BenutzerTabelleSkeleton />}>
                    <BenutzerTabelle query='' aktuellSeite={aktuellSeite}/>
                </Suspense>
                <div className="my-4 flex justify-center items-center">
                    <Seiten seitenAnzahl={seitenAnzahl}/>
                </div>
            </div>
        </main>
    )
}