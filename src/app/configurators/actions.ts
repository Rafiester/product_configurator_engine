'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const trace = (action: string, details: any) => {
  console.info(`[TRACE - ${new Date().toISOString()}] CONFIGURATOR_${action}:`, JSON.stringify(details));
};

export async function createConfigurator(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      status: formData.get('status') as string || 'active',
    };

    trace('CREATE_ATTEMPT', { name: data.name });

    const config = await prisma.configurator.create({ data });

    trace('CREATE_SUCCESS', { id: config.id });
    revalidatePath('/configurators');
    return { success: true, id: config.id };
  } catch (error: any) {
    trace('CREATE_FAILED', { error: error.message });
    return { success: false, error: error.message };
  }
}

export async function updateConfigurator(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      status: formData.get('status') as string || 'active',
    };

    trace('UPDATE_ATTEMPT', { id, name: data.name });

    await prisma.configurator.update({
      where: { id },
      data
    });

    trace('UPDATE_SUCCESS', { id });
    revalidatePath('/configurators');
    return { success: true };
  } catch (error: any) {
    trace('UPDATE_FAILED', { id, error: error.message });
    return { success: false, error: error.message };
  }
}

export async function deleteConfigurator(id: string) {
  try {
    trace('DELETE_ATTEMPT', { id });

    // Hard delete since Configurator model doesn't use soft deletes in our schema
    await prisma.configurator.delete({
      where: { id },
    });

    trace('DELETE_SUCCESS', { id });
  } catch (error: any) {
    trace('DELETE_FAILED', { id, error: error.message });
    throw error;
  }
  
  revalidatePath('/configurators');
}

export async function syncConfiguratorProducts(configuratorId: string, mappings: any[]) {
  try {
    trace('SYNC_ATTEMPT', { configuratorId, mappingsCount: mappings.length });

    // Run in a transaction to ensure clean wipe & replace
    await prisma.$transaction(async (tx) => {
      // Delete old mappings
      await tx.configuratorProductMapping.deleteMany({
        where: { configuratorId }
      });

      // Prepare new mappings
      const newMappings = mappings.map(m => ({
        configuratorId,
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
        await tx.configuratorProductMapping.createMany({
          data: newMappings
        });
      }
    });

    trace('SYNC_SUCCESS', { configuratorId });
    revalidatePath('/configurators');
    return { success: true };
  } catch (error: any) {
    trace('SYNC_FAILED', { configuratorId, error: error.message });
    return { success: false, message: error.message };
  }
}
