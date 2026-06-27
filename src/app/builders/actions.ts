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

export async function syncBuilderProducts(builderId: string, mappings: any[], selectedCategories?: string[]) {
  try {
    trace('SYNC_ATTEMPT', { builderId, mappingsCount: mappings.length, selectedCategories });

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

      // Update builder's selectedCategories list
      if (selectedCategories) {
        await tx.builder.update({
          where: { id: builderId },
          data: { selectedCategories }
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

export async function duplicateBuilder(id: string) {
  try {
    trace('DUPLICATE_ATTEMPT', { id });

    // Fetch the original builder details including its products mappings
    const original = await prisma.builder.findUnique({
      where: { id },
      include: {
        products: true
      }
    });

    if (!original) {
      return { success: false, error: 'Original builder not found.' };
    }

    // Create duplicate builder
    const duplicated = await prisma.builder.create({
      data: {
        name: `${original.name} (Copy)`,
        status: original.status,
        selectedCategories: original.selectedCategories,
        products: {
          create: original.products.map(p => ({
            productId: p.productId,
            category: p.category,
            qty: p.qty,
            sdp: p.sdp,
            totalSdp: p.totalSdp,
            pagePrice: p.pagePrice,
            srp: p.srp,
            margin: p.margin,
            marginPercentage: p.marginPercentage
          }))
        }
      }
    });

    trace('DUPLICATE_SUCCESS', { originalId: id, duplicatedId: duplicated.id });
    revalidatePath('/builders');
    return { success: true, id: duplicated.id };
  } catch (error: any) {
    trace('DUPLICATE_FAILED', { id, error: error.message });
    return { success: false, error: error.message };
  }
}
