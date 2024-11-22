'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function Suchen({ platzhalter }: { platzhalter: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


  const handleChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    const urlParams = new URLSearchParams(searchParams);
    const terms = e.target.value;

    console.log('Suchen: ' + terms + '...');

    urlParams.set('page', '1');
    if (terms) {
      urlParams.set('query', terms);
    } else {
      urlParams.delete('query');
    }
    replace(`${pathname}?${urlParams.toString()}`)
  }, 800)
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Suchen
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={platzhalter}
        onChange={handleChange}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
