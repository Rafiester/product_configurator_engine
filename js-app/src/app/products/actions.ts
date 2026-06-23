'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Trace Log Helper
const trace = (action: string, details: any) => {
  console.info(`[TRACE - ${new Date().toISOString()}] PRODUCT_${action}:`, JSON.stringify(details));
};

export async function createProduct(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      qty: parseInt(formData.get('qty') as string) || 0,
      sdp: parseFloat(formData.get('sdp') as string) || 0,
      page_price: parseFloat(formData.get('page_price') as string) || 0,
      srp: parseFloat(formData.get('srp') as string) || 0,
      status: formData.get('status') as string || 'active',
    };

    trace('CREATE_ATTEMPT', { name: data.name });

    const product = await prisma.product.create({ data });

    trace('CREATE_SUCCESS', { id: product.id });
  } catch (error: any) {
    trace('CREATE_FAILED', { error: error.message });
    throw error;
  }
  
  revalidatePath('/products');
  redirect('/products');
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      qty: parseInt(formData.get('qty') as string) || 0,
      sdp: parseFloat(formData.get('sdp') as string) || 0,
      page_price: parseFloat(formData.get('page_price') as string) || 0,
      srp: parseFloat(formData.get('srp') as string) || 0,
      status: formData.get('status') as string || 'active',
    };

    trace('UPDATE_ATTEMPT', { id, name: data.name });

    await prisma.product.update({
      where: { id },
      data
    });

    trace('UPDATE_SUCCESS', { id });
  } catch (error: any) {
    trace('UPDATE_FAILED', { id, error: error.message });
    throw error;
  }
  
  revalidatePath('/products');
  redirect('/products');
}

export async function deleteProduct(id: string) {
  try {
    trace('DELETE_ATTEMPT', { id });

    // Soft delete implementation
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    trace('DELETE_SUCCESS', { id });
  } catch (error: any) {
    trace('DELETE_FAILED', { id, error: error.message });
    throw error;
  }
  
  revalidatePath('/products');
}
