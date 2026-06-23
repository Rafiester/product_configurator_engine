<?php if (isset($component)) { $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54 = $attributes; } ?>
<?php $component = App\View\Components\AppLayout::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('app-layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\AppLayout::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
     <?php $__env->slot('header', null, []); ?> 
        <div class="flex justify-between items-center w-full">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
                    <svg class="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
                    <?php echo e(__('Products (Master Data)')); ?>

                </h2>
            </div>
            <div class="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
                <a href="<?php echo e(route('products.create')); ?>" class="inline-flex items-center justify-center px-6 py-2.5 bg-primary-DEFAULT border border-transparent rounded-lg font-semibold text-white focus:outline-none shadow-sm text-sm">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Create New Product
                </a>
            </div>
        </div>
     <?php $__env->endSlot(); ?>

    <div class="py-6">
        <div class="w-full">
            
            <!-- Filters -->
            <div class="bg-white dark:bg-dark-surface p-4 shadow-sm rounded-xl mb-6 border border-gray-200 dark:border-dark-border">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-dark-border">Search & Filter Products</h3>
                <form method="GET" action="<?php echo e(route('products.index')); ?>" class="flex flex-row items-center gap-4 w-full">
                    <div class="w-full flex-[2]">
                        <input type="text" name="search" value="<?php echo e(request('search')); ?>" placeholder="Search by name..." class="block w-full rounded-md bg-white border-gray-300 placeholder-gray-400 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm">
                    </div>
                    <div class="w-full flex-1">
                        <select name="category" class="block w-full rounded-md bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm">
                            <option value="">Category</option>
                            <?php $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cat): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <option value="<?php echo e($cat); ?>" <?php echo e(request('category') == $cat ? 'selected' : ''); ?>><?php echo e($cat); ?></option>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </select>
                    </div>
                    <div class="w-full flex-1">
                        <select name="configurator" class="block w-full rounded-md bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm">
                            <option value="">Configurator</option>
                            <?php $__currentLoopData = $allConfigurators; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $conf): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <option value="<?php echo e($conf->id); ?>" <?php echo e(request('configurator') == $conf->id ? 'selected' : ''); ?>><?php echo e($conf->name); ?></option>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </select>
                    </div>
                    <div class="w-full flex-1">
                        <select name="status" class="block w-full rounded-md bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm">
                            <option value="">Status</option>
                            <option value="active" <?php echo e(request('status') == 'active' ? 'selected' : ''); ?>>Publish</option>
                            <option value="inactive" <?php echo e(request('status') == 'inactive' ? 'selected' : ''); ?>>Unpublish</option>
                        </select>
                    </div>
                    <div class="flex items-center flex-none">
                        <button type="submit" class="bg-primary-DEFAULT hover:bg-primary-hover active:bg-primary-active text-white font-semibold py-2 px-6 rounded-md shadow-sm sm:text-sm whitespace-nowrap transition-colors">
                            Filter
                        </button>
                        <a href="<?php echo e(route('products.index')); ?>" class="ml-4 sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap transition-colors">Clear</a>
                    </div>
                </form>
            </div>

            <!-- Table -->
            <div class="bg-white dark:bg-dark-surface overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                        <thead class="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">No</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Category</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Qty</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">SDP (RM)</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Total SDP (RM)</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Page Price (RM)</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">SRP (RM)</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Status</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-dark-border">
                            <?php $__empty_1 = true; $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors">
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                    <?php echo e($products->firstItem() + $index); ?>

                                </td>
                                <td class="px-4 py-4 max-w-[350px]">
                                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title="<?php echo e($product->name); ?>">
                                        <?php echo e($product->name); ?>

                                    </div>
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap">
                                    <span class="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-primary-soft dark:bg-primary-darkSoft text-primary-active dark:text-primary-dark">
                                        <?php echo e($product->category); ?>

                                    </span>
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center tabular-nums">
                                    <?php echo e(number_format($product->qty)); ?>

                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-left tabular-nums">
                                    RM <?php echo e(number_format($product->sdp, 2)); ?>

                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100 text-left tabular-nums">
                                    RM <?php echo e(number_format($product->total_sdp, 2)); ?>

                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-left tabular-nums">
                                    RM <?php echo e(number_format($product->page_price, 2)); ?>

                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-left tabular-nums">
                                    RM <?php echo e(number_format($product->srp, 2)); ?>

                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-center">
                                    <?php if($product->status == 'active'): ?>
                                        <span class="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-primary-soft text-primary-active dark:bg-primary-darkSoft dark:text-primary-dark border border-primary-DEFAULT/30 dark:border-primary-DEFAULT/30">Publish</span>
                                    <?php else: ?>
                                        <span class="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Unpublish</span>
                                    <?php endif; ?>
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex justify-end gap-3">
                                        <a href="<?php echo e(route('products.edit', $product)); ?>" class="text-primary-DEFAULT hover:text-primary-hover font-semibold transition-colors">Edit</a>
                                        <form action="<?php echo e(route('products.destroy', $product)); ?>" method="POST" onsubmit="return confirm('Delete this product?');" class="inline m-0">
                                            <?php echo csrf_field(); ?>
                                            <?php echo method_field('DELETE'); ?>
                                            <button type="submit" class="text-red-500 hover:text-red-600 font-semibold transition-colors">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <tr>
                                <td colspan="11" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No products found.</td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="mt-4">
                <?php echo e($products->links()); ?>

            </div>
        </div>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $attributes = $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $component = $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php /**PATH /Users/flo/cms/resources/views/products/index.blade.php ENDPATH**/ ?>