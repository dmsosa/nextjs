import { fetchBenutzerBeiId } from "@/app/lib/data"
import { EditBenutzerForm } from "@/app/ui/benutzer/benutzer-form";
import { BenutzerRechnungTabelle } from "@/app/ui/benutzer/table";
import Breadcrumbs from "@/app/ui/rechnungen/breadcrumbs";
import { BenutzerRechnungTabelleSkeleton, BenutzerTabelleSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page( props : { 
    params?: Promise<{ id: string }>, 
    searchParams?: Promise<{ page: string }>,
}) {
    
    const params = await props.params;
    const searchParams = await props.searchParams;

    const benutzerId = params ? params.id : '';
    const benutzer = await fetchBenutzerBeiId(benutzerId);

    const aktuellSeite = Number(searchParams?.page) || 1;



    return (
        <main>
            <Breadcrumbs breadcrumbs={[ { label: "Benutzer", href: "/dashboard/benutzer" }, { label: "Edit", href: `/dashboard/benutzer/${benutzerId}/edit`, active: true }]}/>
            <Suspense fallback={<BenutzerTabelleSkeleton />}>
                <EditBenutzerForm customer={benutzer}/>
            </Suspense>
            <Suspense fallback={<BenutzerRechnungTabelleSkeleton />}>
                <BenutzerRechnungTabelle customerId={benutzer.id} aktuellSeite={aktuellSeite} />
            </Suspense>            
        </main>
    )
}