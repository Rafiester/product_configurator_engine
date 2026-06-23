'use client';

import { useState } from 'react';
import { deleteProduct } from '@/app/products/actions';

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Delete Product? This action cannot be undone.')) {
      setIsDeleting(true);
      await deleteProduct(id);
      setIsDeleting(false);
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
