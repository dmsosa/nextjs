'use client';

import {  ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { customGeneratePagination } from '@/app/lib/helpers';
import {  usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/app/lib/utils';

export  function Seiten({ seiteAnzahl } : { seiteAnzahl: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const aktuellSeite = Number(searchParams.get("page")) || 1;
  const alleSeiten = customGeneratePagination( aktuellSeite, seiteAnzahl);

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
  const className = clsx('flex h-10 w-10 items-center justify-center text-sm border-2', 
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
export default function Pagination({ totalPages }: { totalPages: number }) {
  // NOTE: Uncomment this code in Chapter 11
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (page: number) => {
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('page', page.toString());
    return `${pathname}?${urlParams.toString()}`;

  }
  return (
    <>
      {/*  NOTE: Uncomment this code in Chapter 11 */}

      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={page}
                href={createPageURL(currentPage)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border-stone-300',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ChevronLeftIcon className="w-4" />
    ) : (
      <ChevronRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
