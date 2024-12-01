'use client';

import { BenutzerFeld } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { rechnungErstellen, TActionState } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form({ customers }: { customers: BenutzerFeld[] }) {

  const initState: TActionState = { errors: {}, message: null};
  const [ actionState, formAction ] = useActionState<TActionState>(rechnungErstellen, initState);

  
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Benutzer wählen
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              aria-describedby="customer-error"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-emerald-600 focus-visible:outline-offset-0"
            >
              <option value="" disabled>
                Benutzer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 " />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {actionState.errors?.customerId && 
              actionState.errors?.customerId.map((errorMessage) => (
                <p className="mt-2 text-sm text-red-500" key={errorMessage}>{errorMessage}</p>
              ))
            }
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Rechnungbetrag
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                aria-describedby="amount-error"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-emerald-600 focus-visible:outline-offset-0"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
            {actionState.errors?.amount && 
              actionState.errors?.amount.map((errorMessage) => (
                <p className="mt-2 text-sm text-red-500" key={errorMessage}>{errorMessage}</p>
              ))
            }
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Rechnungstatus setzen
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  aria-describedby="status-error"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:outline focus:outline-emerald-600 focus:outline-offset-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Ausstehend <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  aria-describedby="status-error"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:outline focus:outline-emerald-600 focus:outline-offset-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Bezahlt <CheckIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="basis-100" id="status-error" aria-live="polite" aria-atomic="true">
                {actionState.errors?.status && 
                  actionState.errors?.status.map((errorMessage) => (
                    <p className="mt-2 text-sm text-red-500" key={errorMessage}>{errorMessage}</p>
                  ))
                }
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/rechnungen"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Stornieren
        </Link>
        <Button type="submit">Rechnung Erstellen</Button>
      </div>
    </form>
  );
}
