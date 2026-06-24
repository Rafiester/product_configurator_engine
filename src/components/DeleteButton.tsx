'use client';

import { useState } from 'react';
import { deleteProduct } from '@/app/products/actions';
import { useUI } from '@/components/ToastProvider';

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, showToast } = useUI();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: 'Delete Product?',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
    });

    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteProduct(id);
        showToast('success', 'Success', 'Product deleted successfully.');
      } catch (err: any) {
        showToast('error', 'Error', err.message || 'Failed to delete product.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center px-4 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-md text-xs transition-colors disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
