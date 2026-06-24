import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateConfigurator } from '../../actions';
import { prisma } from '@/lib/prisma';
import ConfiguratorForm from '@/components/ConfiguratorForm';

interface EditConfiguratorPageProps {
  params: {
    id: string;
  };
}

export default async function EditConfiguratorPage({ params }: EditConfiguratorPageProps) {
  const configurator = await prisma.configurator.findUnique({
    where: { id: params.id }
  });

  if (!configurator) {
    notFound();
  }

  // Bind the ID to the server action
  const updateConfiguratorWithId = updateConfigurator.bind(null, configurator.id);

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              Edit Configurator
            </h2>
          </div>
          <Link href="/configurators" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            &larr; Back to Configurators
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <ConfiguratorForm 
            initialData={configurator}
            action={updateConfiguratorWithId}
            submitButtonText="Save Changes"
            successMessage="Configurator updated successfully."
          />
        </div>
      </div>
    </div>
  );
}
