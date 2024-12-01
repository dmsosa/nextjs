import { Suspense } from "react";
import CardWrapper from "../../ui/dashboard/cards";
import LetzteRechnung from "../../ui/dashboard/letzte-rechnung";
import RevenueChart from "../../ui/dashboard/revenue-chart";
import { lusitana } from "../../ui/fonts";
import {  CardsSkeleton, LetzteRechnungSkeleton, RevenueChartSkeleton } from "@/app/ui/skeletons";

export default async function Page() {

    return ( 
      <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<CardsSkeleton></CardsSkeleton>}><CardWrapper/></Suspense>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <Suspense fallback={<RevenueChartSkeleton/>}><RevenueChart/></Suspense> 
          <Suspense fallback={<LetzteRechnungSkeleton />}><LetzteRechnung /></Suspense>
        </div>
      </main>
    )
}