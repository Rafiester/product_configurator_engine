'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Trace Log Helper
const trace = (action: string, details: any) => {
  console.info(`[TRACE - ${new Date().toISOString()}] CATEGORY_${action}:`, JSON.stringify(details));
};

export async function createCategory(formData: FormData) {
  try {
    const name = (formData.get('name') as string || '').trim();
    const status = formData.get('status') as string || 'active';

    if (!name) {
      throw new Error('Category name is required.');
    }

    trace('CREATE_ATTEMPT', { name, status });

    const category = await prisma.category.create({
      data: {
        name,
        status,
      }
    });

    trace('CREATE_SUCCESS', { id: category.id });
  } catch (error: any) {
    trace('CREATE_FAILED', { error: error.message });
    throw error;
  }
  
  revalidatePath('/categories');
  redirect('/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = (formData.get('name') as string || '').trim();
    const status = formData.get('status') as string || 'active';

    if (!name) {
      throw new Error('Category name is required.');
    }

    trace('UPDATE_ATTEMPT', { id, name, status });

    await prisma.$transaction(async (tx) => {
      // Get current category to know the old name
      const oldCategory = await tx.category.findUnique({
        where: { id }
      });

      if (!oldCategory) {
        throw new Error('Category not found.');
      }

      const oldName = oldCategory.name;

      // Update category
      await tx.category.update({
        where: { id },
        data: {
          name,
          status,
        }
      });

      // If the category name was renamed, cascade update to Product and BuilderProductMapping
      if (oldName !== name) {
        trace('RENAME_CASCADE', { oldName, newName: name });

        await tx.product.updateMany({
          where: { category: oldName },
          data: { category: name }
        });

        await tx.builderProductMapping.updateMany({
          where: { category: oldName },
          data: { category: name }
        });
      }
    });

    trace('UPDATE_SUCCESS', { id });
  } catch (error: any) {
    trace('UPDATE_FAILED', { id, error: error.message });
    throw error;
  }
  
  revalidatePath('/categories');
  redirect('/categories');
}

export async function deleteCategory(id: string) {
  try {
    trace('DELETE_ATTEMPT', { id });

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new Error('Category not found.');
    }

    // Check if any active products are using this category
    const activeProductsCount = await prisma.product.count({
      where: {
        category: category.name,
        deletedAt: null
      }
    });

    if (activeProductsCount > 0) {
      throw new Error('Cannot delete category because it is currently used by active products.');
    }

    // Perform delete
    await prisma.category.delete({
      where: { id }
    });

    trace('DELETE_SUCCESS', { id });
  } catch (error: any) {
    trace('DELETE_FAILED', { id, error: error.message });
    throw error;
  }
  
  revalidatePath('/categories');
}
