import { fetchBenutzerBeiFilter } from "@/app/lib/data"
import Image from "next/image";

export async function BenutzerTabelle({ query, aktuellSeite, filter}: { query: string, aktuellSeite: number, filter?: 'name' | 'email'}) {
    const customers = await fetchBenutzerBeiFilter(query, aktuellSeite, filter);

    return (
        <div>
            <div className="flex">
                { customers?.map((cst, index) => 
                        <div key={cst.id} className="bg-blue-100 border-red flex">
                            <span>{index + 1}</span>
                            <Image 
                            alt={`${cst.name}'s Profile Bilder`}
                            className="mr-5 rounded-full"
                            height={28}
                            width={28}
                            src={cst.image_url}
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-gray-500">{cst.name}</p>
                                <p className="text-gray-300">{cst.email}</p>
                            </div>
                        </div>
                    ) 
                }
            </div>
        </div>
    )
}

export function BenutzerTabelleSkeleton() {
    return(<div>SKELETON</div>)
}