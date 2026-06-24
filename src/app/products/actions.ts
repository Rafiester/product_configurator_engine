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
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const qty = parseInt(formData.get('qty') as string) || 0;
    const sdp = parseFloat(formData.get('sdp') as string) || 0;
    const pagePrice = parseFloat(formData.get('page_price') as string) || 0;
    const srp = parseFloat(formData.get('srp') as string) || 0;
    const status = formData.get('status') as string || 'active';

    const configuratorIds = formData.getAll('configurator_ids') as string[];

    trace('CREATE_ATTEMPT', { name });

    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          name,
          category,
          qty,
          sdp,
          page_price: pagePrice,
          srp,
          status,
        }
      });

      if (configuratorIds.length > 0) {
        const mappings = configuratorIds.map(cid => {
          const cQty = parseInt(formData.get(`configurator_qty_${cid}`) as string) || 1;
          const totalSdp = sdp * cQty;
          const margin = pagePrice - totalSdp;
          const marginPercentage = pagePrice > 0 ? (margin / pagePrice) * 100 : 0;

          return {
            configuratorId: cid,
            productId: p.id,
            category: p.category,
            qty: cQty,
            sdp,
            totalSdp,
            pagePrice,
            srp,
            margin,
            marginPercentage,
          };
        });

        await tx.configuratorProductMapping.createMany({
          data: mappings
        });
      }

      return p;
    });

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
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const qty = parseInt(formData.get('qty') as string) || 0;
    const sdp = parseFloat(formData.get('sdp') as string) || 0;
    const pagePrice = parseFloat(formData.get('page_price') as string) || 0;
    const srp = parseFloat(formData.get('srp') as string) || 0;
    const status = formData.get('status') as string || 'active';

    const configuratorIds = formData.getAll('configurator_ids') as string[];

    trace('UPDATE_ATTEMPT', { id, name });

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name,
          category,
          qty,
          sdp,
          page_price: pagePrice,
          srp,
          status,
        }
      });

      // Clear existing assignments
      await tx.configuratorProductMapping.deleteMany({
        where: { productId: id }
      });

      // Set new assignments
      if (configuratorIds.length > 0) {
        const mappings = configuratorIds.map(cid => {
          const cQty = parseInt(formData.get(`configurator_qty_${cid}`) as string) || 1;
          const totalSdp = sdp * cQty;
          const margin = pagePrice - totalSdp;
          const marginPercentage = pagePrice > 0 ? (margin / pagePrice) * 100 : 0;

          return {
            configuratorId: cid,
            productId: id,
            category: category,
            qty: cQty,
            sdp,
            totalSdp,
            pagePrice,
            srp,
            margin,
            marginPercentage,
          };
        });

        await tx.configuratorProductMapping.createMany({
          data: mappings
        });
      }
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
