import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} antialiased flex flex-row items-center leading-none`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[49px]">Acme</p>
    </div>
  );
}
