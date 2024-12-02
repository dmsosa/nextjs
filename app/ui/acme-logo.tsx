import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} antialiased flex flex-row items-center leading-none`}
    >
      <GlobeAltIcon width={40} height={40} className="rotate-[15deg]" />
      <p className="text-[49px]">Acme</p>
    </div>
  );
}
