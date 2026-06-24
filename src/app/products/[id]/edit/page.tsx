import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateProduct } from '../../actions';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

interface InitialConfigData {
  [key: string]: {
    enabled: boolean;
    qty: number;
  };
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [rawProduct, configurators] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        configurators: true
      }
    }),
    prisma.configurator.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (!rawProduct) {
    notFound();
  }

  const product = {
    id: rawProduct.id,
    name: rawProduct.name,
    category: rawProduct.category,
    qty: rawProduct.qty,
    sdp: Number(rawProduct.sdp),
    page_price: Number(rawProduct.page_price),
    srp: Number(rawProduct.srp),
    status: rawProduct.status,
  };

  // Prepare initial toggle data for checklist
  const initialConfigData: InitialConfigData = {};
  rawProduct.configurators.forEach((mapping) => {
    initialConfigData[mapping.configuratorId] = {
      enabled: true,
      qty: mapping.qty,
    };
  });

  // Bind the ID to the server action
  const updateProductWithId = updateProduct.bind(null, rawProduct.id);

  return (
    <div className="py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
                Edit Product Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Modify product parameters and sync its assigned configurator packages.
              </p>
            </div>
          </div>
          <Link href="/products" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            &larr; Back to Products
          </Link>
        </div>

        {/* Form Container */}
        <ProductForm 
          product={product}
          configurators={configurators}
          initialConfigData={initialConfigData}
          action={updateProductWithId}
          submitButtonText="Save Changes"
          title="Edit Product"
        />

      </div>
    </div>
  );
}
