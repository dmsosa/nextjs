import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '../fonts';
import { fetchCardData } from '@/app/lib/data';


const iconMap = {
  gesammelt: BanknotesIcon,
  benutzer: UserGroupIcon,
  ausstehend: ClockIcon,
  rechnungen: InboxIcon,
};

export default async function CardWrapper() {

  const {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card value={totalPaidInvoices} type="gesammelt" />
      <Card value={totalPendingInvoices} type="ausstehend" />
      <Card value={numberOfInvoices} type="rechnungen" />
      <Card
        value={numberOfCustomers}
        type="benutzer"
      />
    </>
  );
}

export function Card({
  value,
  type,
}: {
  value: number | string;
  type: 'rechnungen' | 'benutzer' | 'ausstehend' | 'gesammelt';
}) {

  const capitalize = (text: string) => {
    const firstLetter = type.charAt(0);
    return firstLetter.toUpperCase() + text.slice(1);
  };
  const Icon = iconMap[type];
  const title = type === 'benutzer' || type === 'rechnungen' ? 'Gesamtzahl der ' + capitalize(type) : capitalize(type);
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
