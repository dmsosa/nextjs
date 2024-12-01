'use client';

import { benutzerEntfernen } from "@/app/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { MouseEvent, useState } from "react";



export function CreateBenutzer() {
    return (
        <Link
        href={'/dashboard/benutzer/create'}
        className="flex h-10 items-center rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-500 focus-visible:outline-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <span className="hidden md:block">Benutzer Erstellen</span>
            <PlusIcon className="h-5 md:ml-4"/>
        </Link>
    )
}
export function EditBenutzer({ customerId } : { customerId: string }) {
    return (
        <Link href={`/dashboard/benutzer/${customerId}/edit`} className="border p-2 hover:bg-emerald-200 transition-colors duration-200">
            <PencilIcon className="w-5"/>
        </Link>
    )
}

export function DeleteBenutzer({ customerId } : { customerId: string }) {

    const [ showConfirm, setShowConfirm ] = useState(false);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowConfirm(!showConfirm);
    };

    const benutzerEntfernenMitId = benutzerEntfernen.bind(null, customerId);
    return (
        <form action={benutzerEntfernenMitId} className="relative">
            <div className="absolute -top-24 right-0">
            <div className={`relative bg-white p-2 rounded-lg border-2 border-gray-200 ${showConfirm ? 'block':'hidden'}
            before:absolute
            before:top-full
            before:right-2	
            before:border-t-8
            before:border-t-gray-200
            before:border-l-8
            before:border-r-8
            before:border-l-transparent
            before:border-r-transparent
            `}>
                    <p className="mb-2 font-bold">Bist du sicher?</p>
                    <div className="flex items-center justify-center gap-4">
                        <button type="submit" 
                        className="bg-red-500 hover:bg-red-600 border border-red-600 text-white font-medium transition-colors duration-200 p-2 px-4 text-md rounded-lg">
                            Yes
                        </button>
                        <button 
                        className="bg-green-500 hover:bg-green-600 border border-green-600 text-white font-medium transition-colors duration-200
                        p-2 px-4 text-md rounded-lg"
                        onClick={handleClick}>
                            Nein
                        </button>
                    </div>
            </div>
            </div>
            
            <button className="border p-2 hover:bg-emerald-200 transition-colors duration-200" onClick={handleClick}>
                <TrashIcon className="w-5"></TrashIcon>
            </button>
        </form>

    )
}