import Form from '@/app/ui/rechnungen/create-form';
import Breadcrumbs from '@/app/ui/rechnungen/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Rechnungen', href: '/dashboard/rechnungen' },
          {
            label: 'Erstellen',
            href: '/dashboard/rechnungen/erstellen',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}