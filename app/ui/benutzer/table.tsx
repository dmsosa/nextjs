import { fetchBenutzerBeiFilter, fetchRechnungenBeiFilter } from "@/app/lib/data"
import Image from "next/image";
import { DeleteBenutzer, EditBenutzer } from "./knopfen";
import { DeleteRechnung, UpdateRechnung } from "../rechnungen/buttons";
import RechnungStatus from "../rechnungen/status";

export default async function BenutzerTabelle({ query, aktuellSeite  }: { query: string, aktuellSeite: number } ) {

    const customers = await fetchBenutzerBeiFilter(query, aktuellSeite);
    return (
        <div className="">
            <div className="p-2 bg-emerald-50 rounded-lg min-w-full inline-block mt-5">
                <div className="md:hidden">
                    { customers?.map((cst) => 
                        <div 
                        key={cst.id} 
                        className="my-2 first:mt-0 last:mb-0 rounded-md bg-white p-2 text-sm md:text-md">
                            <div className="flex w-full items-center justify-between border-b p-2">
                                <div>
                                    <div className="flex mb-2 items-center justify-between">
                                        <Image 
                                        src={cst.image_url}
                                        className="mr-2 rounded-full border-2 border-emerald-500"
                                        width={28}
                                        height={28}
                                        alt={`${cst.name}'s profile picture`}
                                        />
                                        <p>{cst.name}</p>
                                    </div>
                                    
                                    <p className="text-gray-600">{cst.email}</p>
                                </div>
                                <p className="text-center">Rechnungen: {cst.total_invoices}</p>
                            </div>
                            <div className="flex w-full items-center justify-between pt-2">
                                <div>
                                    <p className="font-bold">Bezahlt: {cst.total_paid}</p>
                                    <p className="font-bold">Ausstehend: {cst.total_pending}</p>
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <EditBenutzer customerId={cst.id} />
                                    <DeleteBenutzer customerId={cst.id} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <table className="min-w-full hidden md:table text-stone-900">
                    <thead className="rounded-lg text-left text-sm">
                        <tr>
                            <th scope="col" className="pl-3 py-5 font-medium">Name</th>
                            <th scope="col" className="py-5 font-medium">Email</th>
                            <th scope="col" className="py-5 font-medium text-center">Rechnungen</th>
                            <th scope="col" className="py-5 font-medium text-center">Bezahlte R.</th>
                            <th scope="col" className="py-5 font-medium text-center">Ausstehende R.</th>
                            <th scope="col" className="py-5 font-medium text-center"><span className="sr-only">Bearbeiten</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        { customers.map((cst) => 
                            <tr key={cst.id}
                            className="py-3 text-xs border-b last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-2xl [&:first-child>td:last-child]:rounded-tr-2xl
                            [&:last-child>td:first-child]:rounded-bl-2xl
                            [&:last-child>td:last-child]:rounded-br-2xl">
                                <td className="pl-3 py-3">
                                    <div className="flex items-center justify-start">
                                        <Image 
                                        src={cst.image_url}
                                        width={40}
                                        height={40}
                                        alt={`${cst.name}'s profile image`}
                                        className="rounded-full border-2 border-emerald-500 mx-2"/>
                                        <p>{cst.name}</p>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap">
                                    <p className="font-normal text-stone-800">{cst.email}</p>
                                </td>
                                <td>
                                    <p className="text-center font-medium">{cst.total_invoices}</p>
                                </td>
                                <td>
                                    <p className="text-center font-medium">{cst.total_paid}</p>
                                </td>
                                <td>
                                    <p className="text-center font-medium">{cst.total_pending}</p>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center justify-center gap-2 mr-3">
                                        <EditBenutzer customerId={cst.id} />
                                        <DeleteBenutzer customerId={cst.id} />
                                    </div>
                                </td>
                            </tr>
                        ) }
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}


export async function BenutzerRechnungTabelle({ customerId, aktuellSeite } : { customerId: string, aktuellSeite: number }) {
    const invoices = await fetchRechnungenBeiFilter(customerId, aktuellSeite);
    return (
        <div>
            <div className="mt-2 bg-emerald-50 rounded-lg">
                <div className="flex items-center justify-between py-5  bg-emerald-500 text-white text-sm md:text-md font-medium tracking-tight md:tracking-normal divide-x px-2 rounded-tr-lg rounded-tl-lg">
                    <p className="px-3 w-4"></p>
                    <p className="px-3 text-center basis-1 grow shrink-0">Wert</p>
                    <p className="px-3 text-center basis-1 grow shrink-0">Status</p>
                    <p className="px-3 text-center basis-1 grow shrink-0">Bearbeiten</p>
                </div>
                {invoices.map((invoice, index) => (
                    <div className="table-cont flex items-center justify-between bg-white [&:nth-child(2)]:border-none border-t p-2 [&:last-child]:rounded-br-lg [&:last-child]:rounded-bl-lg ">
                        <p className="text-center px-3 w-4">{index + 1}</p>
                        <div className="basis-1 grow shrink-0"><p className="text-center">{invoice.amount}</p></div>
                        <div className="basis-1 grow shrink-0 flex justify-center items-center"><RechnungStatus status={invoice.status}/></div>
                        <div className="flex items-center justify-center gap-2 basis-1 grow shrink-0">
                            <UpdateRechnung id={invoice.id} />
                            <DeleteRechnung id={invoice.id} />
                        </div>
                    </div>
                
                ))}
            </div>
        </div>
    )
}