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
        <div class="flex justify-between items-center">
            <div>
                <h2 class="font-bold text-2xl text-gray-900 dark:text-gray-100 leading-tight flex items-center gap-3">
                    <?php echo e($product->name); ?>

                    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-primary-soft dark:bg-primary-darkSoft text-primary-active dark:text-primary-dark border border-primary-DEFAULT/20"><?php echo e($product->category); ?></span>
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage product details and configurator availability</p>
            </div>
            <button type="submit" form="product-edit-form" class="bg-primary-DEFAULT hover:bg-primary-hover text-black dark:text-white font-semibold py-2 px-6 rounded-xl shadow-sm transition-colors focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Save Changes
            </button>
        </div>
     <?php $__env->endSlot(); ?>

    <?php
        $initialConfigData = [];
        foreach($product->configurators as $conf) {
            $initialConfigData[$conf->id] = [
                'enabled' => true,
                'qty' => $conf->pivot->qty ?? 1
            ];
        }
    ?>

    <div class="py-6" x-data="configManager(<?php echo e(json_encode($initialConfigData)); ?>, <?php echo e($product->sdp); ?>, <?php echo e($product->page_price); ?>, <?php echo e($product->srp); ?>)">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            <?php if($errors->any()): ?>
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    <span class="block sm:inline">There were some problems with your input.</span>
                    <ul class="mt-2 list-disc list-inside text-sm">
                        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <li><?php echo e($error); ?></li>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </ul>
                </div>
            <?php endif; ?>

            <form id="product-edit-form" method="POST" action="<?php echo e(route('products.update', $product)); ?>" class="flex flex-col lg:flex-row gap-6">
                <?php echo csrf_field(); ?>
                <?php echo method_field('PUT'); ?>
                
                <!-- LEFT COLUMN: PRIMARY CONFIG PANEL -->
                <div class="flex-1 space-y-6">
                    
                    <!-- Base Details Card -->
                    <div class="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-dark-border">Base Product Details</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Product Name <span class="text-red-500">*</span></label>
                                <input type="text" name="name" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT" value="<?php echo e(old('name', $product->name)); ?>" required>
                            </div>
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Category <span class="text-red-500">*</span></label>
                                <select name="category" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT" required>
                                    <option value="">-- Select Category --</option>
                                    <?php $__currentLoopData = ['GPU', 'RAM', 'CPU', 'Chassis', 'Motherboard', 'SSD', 'PSU', 'Cooler', 'ARGB / Accessories']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cat): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <option value="<?php echo e($cat); ?>" <?php echo e(old('category', $product->category) == $cat ? 'selected' : ''); ?>><?php echo e($cat); ?></option>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Status <span class="text-red-500">*</span></label>
                                <select name="status" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT">
                                    <option value="active" <?php echo e(old('status', $product->status) == 'active' ? 'selected' : ''); ?>>Publish</option>
                                    <option value="inactive" <?php echo e(old('status', $product->status) == 'inactive' ? 'selected' : ''); ?>>Unpublish</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Global Quantity <span class="text-red-500">*</span></label>
                                <input type="number" name="qty" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('qty', $product->qty)); ?>" required>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">SDP (RM) <span class="text-red-500">*</span></label>
                                <input type="number" step="0.01" name="sdp" x-model.number="baseSdp" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('sdp', $product->sdp)); ?>" required>
                            </div>
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Page Price (RM) <span class="text-red-500">*</span></label>
                                <input type="number" step="0.01" name="page_price" x-model.number="basePagePrice" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('page_price', $product->page_price)); ?>" required>
                            </div>
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">SRP (RM) <span class="text-red-500">*</span></label>
                                <input type="number" step="0.01" name="srp" x-model.number="baseSrp" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums" value="<?php echo e(old('srp', $product->srp)); ?>" required>
                            </div>
                        </div>
                    </div>

                    <!-- Configurators Assignment -->
                    <div class="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border p-6">
                        <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-dark-border">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Assign Configurators</h3>
                            <span class="text-sm text-gray-600 dark:text-gray-400" x-text="enabledCount + ' Enabled'"></span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Toggle the configurators where this product should be available as a component selection.</p>
                        
                        <div class="space-y-3">
                            <?php $__empty_1 = true; $__currentLoopData = $configurators; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $configurator): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                <div class="border border-gray-200 dark:border-dark-border rounded-lg overflow-hidden transition-colors"
                                     :class="{ 'border-primary-DEFAULT/50 ring-1 ring-primary-DEFAULT/20 dark:border-primary-DEFAULT/50 dark:bg-dark-surface2': isEnabled('<?php echo e($configurator->id); ?>') }">
                                    
                                    <!-- Card Header / Toggle -->
                                    <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors">
                                        <div class="flex items-center gap-3">
                                            <input type="checkbox" name="configurator_ids[]" value="<?php echo e($configurator->id); ?>" 
                                                class="rounded bg-white border-gray-300 dark:border-gray-700 text-primary-DEFAULT dark:bg-gray-800 focus:ring-primary-DEFAULT"
                                                @change="toggleConfig('<?php echo e($configurator->id); ?>', $event.target.checked)"
                                                :checked="isEnabled('<?php echo e($configurator->id); ?>')">
                                            <div>
                                                <div class="font-semibold text-gray-900 dark:text-gray-100"><?php echo e($configurator->name); ?></div>
                                                <div class="text-xs text-gray-600 dark:text-gray-400">
                                                    <?php if($configurator->status == 'active'): ?>
                                                        <span class="text-green-600 dark:text-green-400">Active Builder</span>
                                                    <?php else: ?>
                                                        <span class="text-red-500 dark:text-red-400">Inactive</span>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-sm font-medium" :class="isEnabled('<?php echo e($configurator->id); ?>') ? 'text-primary-DEFAULT' : 'text-gray-600 dark:text-gray-400'" x-text="isEnabled('<?php echo e($configurator->id); ?>') ? 'Enabled' : 'Disabled'"></div>
                                    </label>

                                    <!-- Expanded Options -->
                                    <div x-show="isEnabled('<?php echo e($configurator->id); ?>')" x-transition x-cloak class="bg-gray-50 dark:bg-dark-surface p-4 border-t border-gray-200 dark:border-dark-border">
                                        <div class="flex items-center gap-4 max-w-sm">
                                            <label class="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Quantity Required:</label>
                                            <input type="number" name="configurator_qty[<?php echo e($configurator->id); ?>]" min="1"
                                                class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT tabular-nums py-1.5"
                                                x-model.number="getQtyModel('<?php echo e($configurator->id); ?>').value">
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                                <div class="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-dark-border rounded-lg">
                                    No configurators exist in the system.
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: STICKY SUMMARY PANEL -->
                <div class="lg:w-80 shrink-0">
                    <div class="sticky top-6 space-y-6">
                        <div class="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                            <div class="bg-primary-soft dark:bg-primary-darkSoft p-4 border-b border-primary-DEFAULT/20">
                                <h3 class="text-primary-active dark:text-primary-dark font-semibold flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Live Summary
                                </h3>
                            </div>
                            <div class="p-5 space-y-4">
                                <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Active Deployments</span>
                                    <span class="font-semibold text-gray-900 dark:text-gray-100" x-text="enabledCount + ' Configurators'"></span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Base Est. Cost</span>
                                    <span class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums" x-text="'RM ' + formatCurrency(totalEstimatedCost)"></span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Base SRP</span>
                                    <span class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums" x-text="'RM ' + formatCurrency(baseSrp)"></span>
                                </div>
                                <div class="flex justify-between items-center pt-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Estimated Margin</span>
                                    <span class="font-bold tabular-nums" :class="margin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'" x-text="'RM ' + formatCurrency(margin) + ' (' + marginPercentage + '%)'"></span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400">
                            <p class="font-semibold mb-1 text-gray-900 dark:text-gray-100">💡 How it works</p>
                            <p>Enabling a configurator allows this product to be selected by users in that specific PC Builder workflow. The required quantity multiplies the base cost estimation.</p>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('configManager', (initialConfigData, initialSdp, initialPagePrice, initialSrp) => ({
                configs: initialConfigData || {},
                baseSdp: parseFloat(initialSdp) || 0,
                basePagePrice: parseFloat(initialPagePrice) || 0,
                baseSrp: parseFloat(initialSrp) || 0,

                init() {
                    // Ensure Alpine state creates responsive properties for Qty
                    Object.keys(this.configs).forEach(id => {
                        if(typeof this.configs[id].qty === 'undefined') {
                            this.configs[id].qty = 1;
                        }
                    });
                },

                isEnabled(id) {
                    return this.configs[id] && this.configs[id].enabled;
                },

                toggleConfig(id, checked) {
                    if (!this.configs[id]) {
                        this.configs[id] = { enabled: checked, qty: 1 };
                    } else {
                        this.configs[id].enabled = checked;
                    }
                },

                // Returns a reactive object reference for x-model
                getQtyModel(id) {
                    if (!this.configs[id]) {
                        this.configs[id] = { enabled: false, qty: 1 };
                    }
                    return {
                        get value() { return this.configs[id].qty; },
                        set value(val) { this.configs[id].qty = val; }
                    }.bind(this);
                },

                get enabledCount() {
                    return Object.values(this.configs).filter(c => c.enabled).length;
                },

                get totalEstimatedCost() {
                    let total = 0;
                    Object.values(this.configs).forEach(c => {
                        if (c.enabled) {
                            total += (this.baseSdp * (parseInt(c.qty) || 1));
                        }
                    });
                    // If no configs enabled, fallback to single unit cost for preview
                    if (this.enabledCount === 0) return this.baseSdp;
                    return total;
                },

                get margin() {
                    return this.baseSrp - this.totalEstimatedCost;
                },

                get marginPercentage() {
                    if (this.baseSrp <= 0) return 0;
                    let m = this.margin;
                    return ((m / this.baseSrp) * 100).toFixed(1);
                },

                formatCurrency(value) {
                    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            }));
        });
    </script>
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
<?php /**PATH /Users/flo/cms/resources/views/products/edit.blade.php ENDPATH**/ ?>