import React from "react";
import SideNav from "../ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-blue-400 flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 bg-red-400">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
        
    )
}