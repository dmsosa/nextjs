import Image from 'next/image';
import { UpdateRechnung, DeleteRechnung } from '@/app/ui/rechnungen/buttons';
import { fetchRechnungenBeiFilter } from '@/app/lib/data';
import RechnungStatus from '@/app/ui/rechnungen/status';

export default async function RechnungenTabelle({
  query,
  aktuellSeite,
}: {
  query: string;
  aktuellSeite: number;
}) {
  
  const invoices = await fetchRechnungenBeiFilter(query, aktuellSeite);

  return (
    <div className="mt-6 flow-root h-full">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-emerald-50">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <RechnungStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {invoice.amount}
                    </p>
                    <p>{invoice.date}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateRechnung id={invoice.id} />
                    <DeleteRechnung id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Benutzer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Wert
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Datum
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Bearbeiten</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className=" border-b py-3 text-xs last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-2xl [&:first-child>td:last-child]:rounded-tr-2xl [&:last-child>td:first-child]:rounded-bl-2xl [&:last-child>td:last-child]:rounded-br-2xl"
                >
                  <td className="py-3 pl-2 pr-5">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-3">
                    {invoice.email}
                  </td>
                  <td className="p-3">
                    {invoice.amount}
                  </td>
                  <td className="p-3">
                    {invoice.date}
                  </td>
                  <td className="p-3">
                    <RechnungStatus status={invoice.status} />
                  </td>
                  <td className="py-3 px-1">
                    <div className="flex justify-center gap-2">
                      <UpdateRechnung id={invoice.id} />
                      <DeleteRechnung id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
