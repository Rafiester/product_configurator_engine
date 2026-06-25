'use client';

import { useState } from 'react';
import { deleteCategory } from '@/app/categories/actions';
import { useUI } from '@/components/ToastProvider';

export function DeleteCategoryButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, showToast } = useUI();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: 'Delete Category?',
      message: 'This action cannot be undone and will delete the category from database lookup.',
      confirmText: 'Delete',
      type: 'danger',
    });

    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteCategory(id);
        showToast('success', 'Success', 'Category deleted successfully.');
      } catch (err: any) {
        showToast('error', 'Error', err.message || 'Failed to delete category.');
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
