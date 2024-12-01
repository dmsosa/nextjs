'use client';

import {  ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { customGeneratePagination } from '@/app/lib/helpers';
import {  usePathname, useSearchParams } from 'next/navigation';

export default function Seiten({ seitenAnzahl } : { seitenAnzahl: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const aktuellSeite = Number(searchParams.get("page")) || 1;
  const alleSeiten = customGeneratePagination( aktuellSeite, seitenAnzahl);

  const createPageURL = (pageNummer: string | number) =>  {
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('page', pageNummer.toString() );
    return `${pathname}?${urlParams.toString()}`;
  }
  return (
    <div className="inline-flex">
      <PaginationArrows 
      active={aktuellSeite > 1 }
      href={createPageURL(aktuellSeite - 1)}
      direction='left'
      />


      <div className='flex -space-x-px'>
        { alleSeiten.map((seite, index) => {
            let position: 'start' | 'end' | 'single' | 'middle' | undefined;
            if (index === 0) position = 'start';
            if (index === alleSeiten.length - 1) position = 'end';
            if (alleSeiten.length === 1) position = 'single';
            if (seite === '...') position = 'middle';
            return (
            <PaginationNummer
            key={seite}
            page={seite}
            position={position} 
            href={createPageURL(seite)}
            active={seite === aktuellSeite}
            />)
            ;}
          )
        }
      </div>
      

      <PaginationArrows
      active={true}
      href={createPageURL(aktuellSeite + 1)}
      direction='right'
      />
    </div>
  )
}

function PaginationNummer({ href, page, active, position }: { href: string, page: string | number, active?: boolean, position?: 'start' | 'end' | 'middle' | 'single'}) {
  const className = clsx('flex h-10 w-10 items-center justify-center text-sm border-2 transition-colors duration-200', 
    {
      'z-10 bg-emerald-200 text-stone-800 border-emerald-800': active,
      'hover:bg-emerald-400': !active && position !== 'middle',
      'rounded-l-md': position === 'start' || position === 'single',
      'rounded-r-md': position === 'end' || position === 'single',
      'text-stone-300' : position === 'middle',
    },)
  return (active || position === 'middle' ?
    <div className={className}>
      {page}
    </div>
    :
    <Link className={className} href={href}>{page}</Link>

  );
}
function PaginationArrows({ href, active, direction }: { href: string, active?: boolean, direction: 'left' |'right' }) {
  const icon = direction === 'left' ? (  
  <ChevronLeftIcon />) : 
  ( <ChevronRightIcon />);

  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border-2',
    {
      'pointer-events-none text-stone-300 border-stone-300': !active,
      'hover:cursor-pointer hover:bg-gray-100 text-emerald-800 border-emerald-800': active,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );
  return ( active ?
      <Link className={className} href={href}>{icon}</Link>
      :
      <div className={className}>{icon}</div>  
  )
}