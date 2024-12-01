'use client'

import { fetchBenutzerBeiId } from "@/app/lib/data";
import { Button } from "../button";
import Link from "next/link";
import { TBenutzer, TRechnung } from "@/app/lib/definitions";
import { customCurrencyFormatter, customDateFormatter } from "@/app/lib/helpers";
import { useSearchParams } from "next/navigation";
import { benutzerBearbeiten, benutzerErstellen, TActionState } from "@/app/lib/actions";
import { ChangeEvent, useActionState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useFormState } from "react-dom";
import { UserIcon } from "@heroicons/react/24/outline";

type TBenutzerForm = {
    name: string, 
    email: string, 
    imageURL: string,
}
const initForm = {
    name: "",
    email: "",
    imageURL: ""
}

export function CreateBenutzerForm() {

    const initState = { errors: {}, message: null };
    const [ state, formAction ] = useFormState<TActionState>(benutzerErstellen, initState);

    return (
        <form className="mx-auto p-2" action={formAction}>
            <div>
                <div className="rounded-full border-emerald-500 border-8 mb-2 block mx-auto max-w-fit p-2 text-stone-600">
                    <UserIcon width={80} height={80} className=""/>
                </div>


                <fieldset className="flex items-center justify-center flex-wrap max-w-4 mx-auto gap-2 mt-4">
                    <div id="name-error" className="basis-full grow-1" aria-live="polite" aria-atomic="true">
                        { state.errors?.name && state.errors.name.map((errorMessage) => 
                        <p className="text-sm text-red-500 font-bold text-center">{errorMessage}</p>)}
                    </div>
                    <label htmlFor="name" className="tracking-tight font-bold text-gray-900">Benutzer Name</label>
                    <input 
                    id="name" 
                    name="name" 
                    className={clsx("border-2  focus:outline-emerald-500 focus:outline-2 focus:outline-offset-0 focus-visible:outline-offset-0 rounded-lg px-4",
                        {
                            "border-red-500 text-red-500" : state.errors?.email,
                        }
                    )}
                    type="text" 
                    placeholder="name bearbeiten" 
                    aria-describedby="name-error"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.classList.remove("text-red-500", "border-red-500")
                    }}/>
                </fieldset>
                <fieldset className="flex items-center justify-center flex-wrap max-w-4 mx-auto gap-2 mt-4">
                    <div id="email-error" className="basis-full grow-1" aria-live="polite" aria-atomic="true">
                        { state.errors?.email && state.errors.email.map((errorMessage) => 
                        <p className="text-sm text-red-500 font-bold text-center">{errorMessage}</p>)}
                    </div>
                    <label htmlFor="email" className="tracking-tight font-bold text-gray-900">Benutzer Email</label>
                    <input 
                    id="email" 
                    name="email" 
                    className={clsx("border-2  focus:outline-emerald-500 focus:outline-2 focus:outline-offset-0 focus-visible:outline-offset-0 rounded-lg px-4",
                        {
                            "border-red-500 text-red-500" : state.errors?.email,
                        }
                    )} 
                    type="text" 
                    placeholder="name bearbeiten" 
                    aria-describedby="email-error"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.classList.remove("text-red-500", "border-red-500")
                    }}/>
                </fieldset>
                <fieldset className="flex items-center justify-center flex-wrap max-w-4 mx-auto gap-2 mt-4">
                    <div id="image_url-error-error" className="basis-full grow-1" aria-live="polite" aria-atomic="true">
                        { state.errors?.image_url && state.errors.image_url.map((errorMessage) => 
                        <p className="text-sm text-red-500 font-bold text-center">{errorMessage}</p>)}
                    </div>
                    <label htmlFor="image_url" className="tracking-tight font-bold text-gray-900">Image URL</label>
                    <input 
                    id="image_url" 
                    name="image_url" 
                    className={clsx("border-2  focus:outline-emerald-500 focus:outline-2 focus:outline-offset-0 focus-visible:outline-offset-0 rounded-lg px-4",
                        {
                            "border-red-500 text-red-500" : state.errors?.email,
                        }
                    )}
                    type="text" 
                    placeholder="image bearbeiten" 
                    aria-describedby="image_url-error"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.classList.remove("text-red-500", "border-red-500")
                    }}/>
                </fieldset>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
                <Button type="submit">Bestätigen</Button>
                <Link href={"/dashboard/benutzer"} className="hover:bg-red-500 bg-red-300 px-4 py-2 border border-red-400 rounded-lg text-white tracking-tight duration-200 transitions-bg">Zurück</Link>
            </div>
        </form>
    )
}

export function EditBenutzerForm({ customer } : { customer: TBenutzer }) {
    
    const initState: TActionState = { errors: {}, message: null };
    const benutzerBearbeitenMitId = benutzerBearbeiten.bind(null, customer.id);

    const [ state, formAction ] = useActionState<TActionState>(benutzerBearbeitenMitId, initState);

    
    return (
        <form className="mx-auto p-2" action={formAction}>
            <div>
                <Image
                src={customer.image_url}
                width={40}
                height={40}
                alt={`${customer.name}'s image`}
                className="rounded-full border-emerald-500 border-2 mb-2 block mx-auto"
                />

                <fieldset className="flex items-center justify-center flex-wrap max-w-4 mx-auto gap-2 mt-4">
                    <div id="name-error" className="basis-full grow-1" aria-live="polite" aria-atomic="true">
                        { state.errors?.name && state.errors.name.map((errorMessage) => 
                        <p className="text-sm text-red-500 font-bold text-center">{errorMessage}</p>)}
                    </div>
                    <label htmlFor="name" className="tracking-tight font-bold text-gray-900">Benutzer Name</label>
                    <input 
                    id="name" 
                    name="name" 
                    className={clsx("border-2  focus:outline-emerald-500 focus:outline-2 focus:outline-offset-0 focus-visible:outline-offset-0 rounded-lg px-4",
                        {
                            "border-red-500 text-red-500" : state.errors?.email,
                        }
                    )}
                    type="text" 
                    placeholder="name bearbeiten" 
                    defaultValue={customer.name}
                    aria-describedby="name-error"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.classList.remove("text-red-500", "border-red-500")
                    }}/>
                </fieldset>
                <fieldset className="flex items-center justify-center flex-wrap max-w-4 mx-auto gap-2 mt-12">
                    <div id="email-error" className="basis-full grow-1" aria-live="polite" aria-atomic="true">
                        { state.errors?.email && state.errors.email.map((errorMessage) => 
                        <p className="text-sm text-red-500 font-bold text-center">{errorMessage}</p>)}
                    </div>
                    <label htmlFor="email" className="tracking-tight font-bold text-gray-900">Benutzer Email</label>
                    <input 
                    id="email" 
                    name="email" 
                    className={clsx("border-2  focus:outline-emerald-500 focus:outline-2 focus:outline-offset-0 focus-visible:outline-offset-0 rounded-lg px-4",
                        {
                            "border-red-500 text-red-500" : state.errors?.email,
                        }
                    )} 
                    type="text" 
                    placeholder="name bearbeiten" 
                    defaultValue={customer.email}
                    aria-describedby="email-error"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.classList.remove("text-red-500", "border-red-500")
                    }}/>
                </fieldset>
                <fieldset className="flex items-center justify-center flex-wrap max-w-4 mx-auto gap-2 mt-4">
                    <div id="image_url-error-error" className="basis-full grow-1" aria-live="polite" aria-atomic="true">
                        { state.errors?.image_url && state.errors.image_url.map((errorMessage) => 
                        <p className="text-sm text-red-500 font-bold text-center">{errorMessage}</p>)}
                    </div>
                    <label htmlFor="image_url" className="tracking-tight font-bold text-gray-900">Image URL</label>
                    <input 
                    id="image_url" 
                    name="image_url" 
                    className={clsx("border-2  focus:outline-emerald-500 focus:outline-2 focus:outline-offset-0 focus-visible:outline-offset-0 rounded-lg px-4",
                        {
                            "border-red-500 text-red-500" : state.errors?.email,
                        }
                    )}
                    type="text" 
                    placeholder="image bearbeiten" 
                    defaultValue={customer.image_url}
                    aria-describedby="image_url-error"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.classList.remove("text-red-500", "border-red-500")
                    }}/>
                </fieldset>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
                <Button type="submit">Bestätigen</Button>
                <Link href={"/dashboard/benutzer"} className="hover:bg-red-500 bg-red-300 px-4 py-2 border border-red-400 rounded-lg text-white tracking-tight duration-200 transitions-bg">Zurück</Link>
            </div>
        </form>
    )
}
