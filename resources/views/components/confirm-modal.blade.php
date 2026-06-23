<div x-data="confirmModal()" 
     @confirm-action.window="open($event.detail)" 
     x-show="show" 
     class="fixed inset-0 z-50 overflow-y-auto" 
     style="display: none;"
     x-cloak>
     
    <!-- Backdrop -->
    <div x-show="show" 
         x-transition:enter="transition-opacity ease-linear duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition-opacity ease-linear duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm"></div>

    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <!-- Modal Panel -->
        <div x-show="show" 
             x-transition:enter="transition ease-out duration-300 transform"
             x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
             x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave="transition ease-in duration-200 transform"
             x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
             @click.away="cancel()"
             class="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-surface shadow-xl rounded-2xl border border-gray-200 dark:border-white/10 z-10">
            
            <div class="sm:flex sm:items-start">
                <!-- Warning Icon -->
                <div x-show="options.type === 'danger'" class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <!-- Info Icon -->
                <div x-show="options.type !== 'danger'" class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100" x-text="options.title"></h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-600 dark:text-gray-400" x-text="options.message"></p>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                <button type="button" @click="confirm()" 
                        class="w-full inline-flex justify-center rounded-xl border border-transparent px-6 py-2.5 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        :class="options.type === 'danger' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' : 'bg-primary-DEFAULT hover:bg-primary-hover focus:ring-primary-DEFAULT'"
                        x-text="options.confirmText || 'Confirm'">
                </button>
                <button type="button" @click="cancel()" 
                        class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-2.5 bg-white dark:bg-dark-surface2 text-base font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        x-text="options.cancelText || 'Cancel'">
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('confirmModal', () => ({
            show: false,
            options: {},
            open(options) {
                this.options = {
                    title: options.title || 'Are you sure?',
                    message: options.message || '',
                    confirmText: options.confirmText || 'Confirm',
                    cancelText: options.cancelText || 'Cancel',
                    type: options.type || 'info',
                    onConfirm: options.onConfirm || null,
                    onCancel: options.onCancel || null
                };
                this.show = true;
            },
            confirm() {
                if (this.options.onConfirm) this.options.onConfirm();
                this.show = false;
            },
            cancel() {
                if (this.options.onCancel) this.options.onCancel();
                this.show = false;
            }
        }));
        
        window.confirmAction = function(options) {
            window.dispatchEvent(new CustomEvent('confirm-action', { detail: options }));
        };
    });
</script>
