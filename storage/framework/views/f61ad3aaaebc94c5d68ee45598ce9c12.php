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
        <h2 class="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight">
            <?php echo e(__('Create New Product')); ?>

        </h2>
     <?php $__env->endSlot(); ?>

    <div class="py-6">
        <div class="w-full">
            <div class="bg-white dark:bg-dark-surface overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
                <div class="p-6">
                    
                    <?php if($errors->any()): ?>
                        <div class="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative" role="alert">
                            <strong class="font-bold">Whoops!</strong>
                            <span class="block sm:inline">There were some problems with your input.</span>
                            <ul class="mt-2 list-disc list-inside text-sm">
                                <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <li><?php echo e($error); ?></li>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </ul>
                        </div>
                    <?php endif; ?>

                    <form method="POST" action="<?php echo e(route('products.store')); ?>">
                        <?php echo csrf_field(); ?>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left Column -->
                            <div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Product Name <span class="text-red-500">*</span></label>
                                    <input type="text" name="name" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT" value="<?php echo e(old('name')); ?>" required>
                                </div>

                                <div class="mb-4">
                                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Category <span class="text-red-500">*</span></label>
                                    <input type="text" name="category" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT" value="<?php echo e(old('category')); ?>" required>
                                </div>

                                <div class="mb-4">
                                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Quantity <span class="text-red-500">*</span></label>
                                    <input type="number" name="qty" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('qty', 0)); ?>" required>
                                </div>

                                <div class="mb-4">
                                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Status <span class="text-red-500">*</span></label>
                                    <select name="status" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT">
                                        <option value="active" <?php echo e(old('status') == 'active' ? 'selected' : ''); ?>>Publish</option>
                                        <option value="inactive" <?php echo e(old('status') == 'inactive' ? 'selected' : ''); ?>>Unpublish</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">SDP (RM) <span class="text-red-500">*</span></label>
                                    <input type="number" step="0.01" name="sdp" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('sdp', 0.00)); ?>" required>
                                </div>

                                <div class="mb-4">
                                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Page Price (RM) <span class="text-red-500">*</span></label>
                                    <input type="number" step="0.01" name="page_price" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('page_price', 0.00)); ?>" required>
                                </div>

                                <div class="mb-4">
                                    <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">SRP (RM) <span class="text-red-500">*</span></label>
                                    <input type="number" step="0.01" name="srp" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('srp', 0.00)); ?>" required>
                                </div>
                            </div>
                        </div>

                        <!-- Configurator Assignment -->
                        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Configurator Assignment</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Select which configurators this product should be available in.</p>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <?php $__empty_1 = true; $__currentLoopData = $configurators; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $configurator): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                    <label class="inline-flex items-center hover:bg-gray-50 dark:hover:bg-dark-surface2 p-2 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-dark-border">
                                        <input type="checkbox" name="configurator_ids[]" value="<?php echo e($configurator->id); ?>" class="rounded bg-white border-gray-300 dark:border-gray-700 text-primary-DEFAULT dark:bg-gray-800 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT" <?php echo e((is_array(old('configurator_ids')) && in_array($configurator->id, old('configurator_ids'))) ? 'checked' : ''); ?>>
                                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100"><?php echo e($configurator->name); ?></span>
                                    </label>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                                    <span class="text-sm text-gray-500 dark:text-gray-500">No configurators available.</span>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="flex items-center justify-end mt-10 border-t border-gray-200 dark:border-dark-border pt-6">
                            <a href="<?php echo e(route('products.index')); ?>" class="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mr-6 transition-colors">Cancel</a>
                            <button type="submit" class="bg-primary-DEFAULT hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-colors focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2">
                                Create Product
                            </button>
                        </div>
                    </form>
                </div>
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
<?php /**PATH /Users/flo/cms/resources/views/products/create.blade.php ENDPATH**/ ?>