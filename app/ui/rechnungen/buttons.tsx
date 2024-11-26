import { rechnungEntfernen } from '@/app/lib/actions';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateRechnung() {
  return (
    <Link
      href="/dashboard/rechnungen/create"
      className="flex h-10 items-center rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-500 focus-visible:outline-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="hidden md:block">Rechnung Erstellen</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateRechnung({ id }: { id: string }) {
  return (
    <Link
      href={"/dashboard/rechnungen/" + id + "/edit"}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteRechnung({ id }: { id: string }) {
  const rechnungEntfernenMitId = rechnungEntfernen.bind(null, id);
  return (
    <form action={rechnungEntfernenMitId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
