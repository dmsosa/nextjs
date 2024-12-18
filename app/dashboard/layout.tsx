import React from "react";
import SideNav from "../ui/dashboard/sidenav";
export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex md:h-screen bg-stone-200 flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 bg-emerald-400">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto">{children}</div>
        </div>
        
    )
}