<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center w-full">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
                    <svg class="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
                    {{ __('Configurators') }}
                </h2>
            </div>
            <div class="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
                <a href="{{ route('configurators.create') }}" class="inline-flex items-center justify-center px-6 py-2.5 bg-primary-DEFAULT border border-transparent rounded-lg font-semibold text-black dark:text-white focus:outline-none shadow-sm text-sm">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Configurator
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-[1280px] mx-auto px-6 space-y-6">
            
            @foreach($configurators as $configurator)
            <!-- Configurator Card -->
            <div class="bg-white dark:bg-dark-surface2 shadow-sm rounded-lg border border-gray-200 dark:border-dark-border transition-all duration-300"
                 x-data="pcBuilder({{ Js::from($allProductsByCategory) }}, {{ Js::from($configurator->products) }}, '{{ $configurator->id }}')">
                
                <!-- Card Header -->
                <div class="p-6 border-b border-gray-200 dark:border-dark-border flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 dark:bg-dark-surface rounded-t-lg">
                    <div class="mb-4 md:mb-0">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 inline-block mr-3">{{ $configurator->name }}</h3>
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {{ $configurator->status == 'active' ? 'bg-primary-soft text-primary-active dark:bg-primary-darkSoft dark:text-primary-DEFAULT border border-primary-border' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700' }}">
                            {{ ucfirst($configurator->status) }}
                        </span>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <a href="{{ route('configurators.edit', $configurator) }}" class="text-primary-DEFAULT hover:text-primary-hover font-medium transition-colors">Edit Details</a>
                        
                        <form action="{{ route('configurators.destroy', $configurator) }}" method="POST" class="inline" @submit.prevent="window.confirmAction({ title: 'Delete Configurator?', message: 'This action cannot be undone.', type: 'danger', confirmText: 'Delete', onConfirm: () => $el.submit() })">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
                        </form>

                        <div class="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-lg inline-block">
                            <button @click="expanded = !expanded" class="bg-primary-DEFAULT text-black dark:text-white font-semibold py-2 px-4 rounded-md shadow-sm flex items-center space-x-2">
                                <span x-text="expanded ? 'Collapse Builder' : 'Expand Builder'"></span>
                                <svg x-show="expanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                <svg x-show="!expanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Collapsible PC Builder -->
                <div x-show="expanded" class="pb-4" x-transition style="display: none;">
                    <div class="flex justify-between items-center mb-4 px-6 pt-4">
                        <h4 class="text-md font-bold text-gray-900 dark:text-gray-100">Dynamic PC Builder</h4>
                    </div>

                    <div class="w-full overflow-x-auto">
                        <table class="w-full min-w-full text-left border-collapse table-fixed whitespace-nowrap">
                            <thead class="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th class="py-3 px-4 font-semibold text-left text-gray-600 dark:text-gray-300 w-36">Category</th>
                                    <th class="py-3 px-4 font-semibold text-left text-gray-600 dark:text-gray-300">Product</th>
                                    <th class="py-3 px-4 font-semibold text-center text-gray-600 dark:text-gray-300 w-20">Qty</th>
                                    <th class="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-28">SDP (RM)</th>
                                    <th class="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">Total SDP (RM)</th>
                                    <th class="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-36">Page Price (RM)</th>
                                    <th class="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">SRP (RM)</th>
                                    <th class="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-28">Margin</th>
                                    <th class="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-24">Margin %</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-dark-border">
                                <template x-for="(row, index) in rows" :key="row.category">
                                    <tr class="hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors">
                                        <td class="py-2 px-4 font-medium text-gray-900 dark:text-gray-100 truncate" x-text="row.category"></td>
                                        <td class="py-2 px-4">
                                            <select x-model="row.product_id" @change="onProductChange(row)" class="w-full bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT truncate">
                                                <option value="">-- Select Product --</option>
                                                <template x-for="product in (productsByCategory[row.category] || [])" :key="product.id">
                                                    <option :value="product.id" :selected="product.id == row.product_id" x-text="product.name"></option>
                                                </template>
                                            </select>
                                        </td>
                                        <td class="py-2 px-4 text-center">
                                            <input type="number" min="1" x-model.number="row.qty" class="w-16 bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm text-center focus:border-primary-DEFAULT focus:ring-primary-DEFAULT" :disabled="!row.product_id">
                                        </td>
                                        <td class="py-2 px-4 text-right text-gray-600 dark:text-gray-400" x-text="row.product_id ? formatCurrency(row.sdp) : '-'"></td>
                                        <td class="py-2 px-4 text-right text-gray-900 dark:text-gray-100 font-medium" x-text="row.product_id ? formatCurrency(row.sdp * row.qty) : '-'"></td>
                                        <td class="py-2 px-4 text-right text-gray-600 dark:text-gray-400" x-text="row.product_id ? formatCurrency(row.page_price) : '-'"></td>
                                        <td class="py-2 px-4 text-right text-gray-600 dark:text-gray-400" x-text="row.product_id ? formatCurrency(row.srp) : '-'"></td>
                                        <td class="py-2 px-4 text-right font-medium" 
                                            :class="marginClass(row.page_price - (row.sdp * row.qty))"
                                            x-text="row.product_id ? formatCurrency(row.page_price - (row.sdp * row.qty)) : '-'"></td>
                                        <td class="py-2 px-4 text-right font-medium"
                                            :class="marginClass(row.page_price - (row.sdp * row.qty))"
                                            x-text="row.product_id ? (row.page_price > 0 ? formatPercent(((row.page_price - (row.sdp * row.qty)) / row.page_price) * 100) : '-') : '-'"></td>
                                    </tr>
                                </template>
                            </tbody>
                            <tfoot class="bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-dark-border font-bold text-sm">
                                <tr>
                                    <td colspan="4" class="py-3 px-4 text-right text-gray-900 dark:text-gray-100">GRAND TOTAL:</td>
                                    <td class="py-3 px-4 text-right text-gray-900 dark:text-gray-100" x-text="formatCurrency(totalSdpSum)"></td>
                                    <td class="py-3 px-4 text-right text-gray-900 dark:text-gray-100" x-text="formatCurrency(pagePriceSum)"></td>
                                    <td class="py-3 px-4 text-right text-gray-900 dark:text-gray-100" x-text="formatCurrency(srpSum)"></td>
                                    <td class="py-3 px-4 text-right" :class="marginClass(marginSum)" x-text="formatCurrency(marginSum)"></td>
                                    <td class="py-3 px-4 text-right" :class="marginClass(marginSum)" x-text="pagePriceSum > 0 ? formatPercent(marginPercentageSum) : '-'"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <!-- Save Button Below Table -->
                    <div class="mt-4 flex justify-end px-6">
                        <button @click="saveConfiguration" class="bg-primary-DEFAULT text-black dark:text-white font-semibold py-2 px-8 rounded-lg shadow-sm flex items-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                            <span>Save Configuration</span>
                        </button>
                    </div>
                </div>
            </div>
            @endforeach

            @if($configurators->isEmpty())
                <div class="bg-white dark:bg-dark-surface2 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border text-center text-gray-500 dark:text-gray-400">
                    No configurators found. Add one to get started!
                </div>
            @endif

            <div class="mt-4">
                {{ $configurators->links() }}
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('pcBuilder', (productsByCategory, existingSelections, configuratorId) => ({
                expanded: false, // Default is collapsed
                categories: ['GPU', 'RAM', 'CPU', 'Chassis', 'Motherboard', 'SSD', 'PSU', 'Cooler', 'ARGB / Accessories'],
                productsByCategory: productsByCategory,
                rows: [],
                
                init() {
                    this.rows = this.categories.map(category => {
                        const existing = existingSelections.find(s => s.pivot.category === category);
                        
                        if (existing) {
                            if (!this.productsByCategory[category]) {
                                this.productsByCategory[category] = [];
                            }
                            const found = this.productsByCategory[category].find(p => p.id === existing.id);
                            if (!found) {
                                this.productsByCategory[category].push({
                                    id: existing.id,
                                    name: existing.name + ' (Inactive)',
                                    sdp: existing.pivot.sdp,
                                    page_price: existing.pivot.page_price,
                                    srp: existing.pivot.srp
                                });
                            }
                        }

                        return {
                            category: category,
                            product_id: existing ? existing.id : '',
                            qty: existing ? parseInt(existing.pivot.qty) : 1,
                            sdp: existing ? parseFloat(existing.pivot.sdp) : 0,
                            page_price: existing ? parseFloat(existing.pivot.page_price) : 0,
                            srp: existing ? parseFloat(existing.pivot.srp) : 0,
                        };
                    });
                },
                
                onProductChange(row) {
                    if (row.product_id) {
                        const productList = this.productsByCategory[row.category] || [];
                        const product = productList.find(p => p.id === row.product_id);
                        if (product) {
                            row.sdp = parseFloat(product.sdp || 0);
                            row.page_price = parseFloat(product.page_price || 0);
                            row.srp = parseFloat(product.srp || 0);
                        }
                    } else {
                        row.sdp = 0;
                        row.page_price = 0;
                        row.srp = 0;
                    }
                },
                
                get totalSdpSum() {
                    return this.rows.reduce((sum, row) => sum + (row.product_id ? (parseFloat(row.sdp) * parseInt(row.qty)) : 0), 0);
                },
                
                get pagePriceSum() {
                    return this.rows.reduce((sum, row) => sum + (row.product_id ? parseFloat(row.page_price) : 0), 0);
                },

                get srpSum() {
                    return this.rows.reduce((sum, row) => sum + (row.product_id ? parseFloat(row.srp) : 0), 0);
                },
                
                get marginSum() {
                    return this.pagePriceSum - this.totalSdpSum;
                },
                
                get marginPercentageSum() {
                    if (this.pagePriceSum === 0) return 0;
                    return (this.marginSum / this.pagePriceSum) * 100;
                },

                formatNumber(value) {
                    return parseFloat(value || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                },

                formatCurrency(value) {
                    if (value === null || value === undefined || value === '') return '-';
                    return 'RM ' + this.formatNumber(value);
                },

                formatPercent(value) {
                    if (value === null || value === undefined || value === '') return '-';
                    return this.formatNumber(value) + '%';
                },

                marginClass(value) {
                    if (!value && value !== 0) return '';
                    return parseFloat(value) > 0 ? 'text-primary-DEFAULT font-semibold' : (parseFloat(value) < 0 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400');
                },
                
                async saveConfiguration() {
                    const payload = {
                        selections: this.rows.filter(r => r.product_id).map(r => {
                            const total_sdp = parseFloat(r.sdp) * parseInt(r.qty);
                            const margin = parseFloat(r.page_price) - total_sdp;
                            const margin_percentage = r.page_price > 0 ? (margin / r.page_price) * 100 : 0;
                            return {
                                category: r.category,
                                product_id: r.product_id,
                                qty: parseInt(r.qty),
                                sdp: parseFloat(r.sdp),
                                total_sdp: total_sdp,
                                page_price: parseFloat(r.page_price),
                                srp: parseFloat(r.srp),
                                margin: margin,
                                margin_percentage: margin_percentage
                            };
                        })
                    };
                    
                    try {
                        const response = await fetch(`/configurators/${configuratorId}/sync-products`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                            window.notify({ type: 'success', title: 'Configuration Saved', message: 'Your configuration has been saved successfully.' });
                            this.isSaving = false;
                        } else {
                            window.notify({ type: 'error', title: 'Error', message: 'Failed to save configuration.' });
                            this.isSaving = false;
                        }
                    } catch (error) {
                        console.error('Error saving configuration:', error);
                        window.notify({ type: 'error', title: 'Error', message: 'Error saving configuration.' });
                        this.isSaving = false;
                    }
                }
            }));
        });
    </script>
</x-app-layout>