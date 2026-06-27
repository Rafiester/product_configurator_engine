'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const trace = (action: string, details: any) => {
  console.info(`[TRACE - ${new Date().toISOString()}] BUILDER_${action}:`, JSON.stringify(details));
};

export async function createBuilder(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      status: formData.get('status') as string || 'active',
      selectedCategories: formData.getAll('categories') as string[],
    };

    trace('CREATE_ATTEMPT', { name: data.name, selectedCategories: data.selectedCategories });

    const builder = await prisma.builder.create({ data });

    trace('CREATE_SUCCESS', { id: builder.id });
    revalidatePath('/builders');
    return { success: true, id: builder.id };
  } catch (error: any) {
    trace('CREATE_FAILED', { error: error.message });
    return { success: false, error: error.message };
  }
}

export async function updateBuilder(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      status: formData.get('status') as string || 'active',
    };

    trace('UPDATE_ATTEMPT', { id, name: data.name });

    await prisma.builder.update({
      where: { id },
      data
    });

    trace('UPDATE_SUCCESS', { id });
    revalidatePath('/builders');
    return { success: true };
  } catch (error: any) {
    trace('UPDATE_FAILED', { id, error: error.message });
    return { success: false, error: error.message };
  }
}

export async function deleteBuilder(id: string) {
  try {
    trace('DELETE_ATTEMPT', { id });

    // Hard delete since Builder model doesn't use soft deletes in our schema
    await prisma.builder.delete({
      where: { id },
    });

    trace('DELETE_SUCCESS', { id });
  } catch (error: any) {
    trace('DELETE_FAILED', { id, error: error.message });
    throw error;
  }
  
  revalidatePath('/builders');
}

export async function syncBuilderProducts(builderId: string, mappings: any[]) {
  try {
    trace('SYNC_ATTEMPT', { builderId, mappingsCount: mappings.length });

    // Run in a transaction to ensure clean wipe & replace
    await prisma.$transaction(async (tx) => {
      // Delete old mappings
      await tx.builderProductMapping.deleteMany({
        where: { builderId }
      });

      // Prepare new mappings
      const newMappings = mappings.map(m => ({
        builderId,
        productId: m.product_id,
        category: m.category,
        qty: parseInt(m.qty) || 0,
        sdp: parseFloat(m.sdp) || 0,
        totalSdp: parseFloat(m.totalSdp) || 0,
        pagePrice: parseFloat(m.pagePrice) || 0,
        srp: parseFloat(m.srp) || 0,
        margin: parseFloat(m.margin) || 0,
        marginPercentage: parseFloat(m.marginPercentage) || 0,
      }));

      // Insert new mappings
      if (newMappings.length > 0) {
        await tx.builderProductMapping.createMany({
          data: newMappings
        });
      }
    });

    trace('SYNC_SUCCESS', { builderId });
    revalidatePath('/builders');
    return { success: true };
  } catch (error: any) {
    trace('SYNC_FAILED', { builderId, error: error.message });
    return { success: false, message: error.message };
  }
}
