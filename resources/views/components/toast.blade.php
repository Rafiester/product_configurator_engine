<div x-data="toastNotifier()" 
     @notify.window="add($event.detail)" 
     class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
    
    <template x-for="toast in toasts" :key="toast.id">
        <div x-show="toast.show" 
             x-transition:enter="transition ease-out duration-300 transform"
             x-transition:enter-start="opacity-0 translate-x-8"
             x-transition:enter-end="opacity-100 translate-x-0"
             x-transition:leave="transition ease-in duration-200 transform"
             x-transition:leave-start="opacity-100 translate-x-0"
             x-transition:leave-end="opacity-0 translate-x-8"
             class="pointer-events-auto bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-lg p-4 flex items-start gap-3 relative overflow-hidden"
             :class="{
                'border-l-4 border-l-primary-DEFAULT': toast.type === 'success',
                'border-l-4 border-l-red-500': toast.type === 'error',
                'border-l-4 border-l-yellow-500': toast.type === 'warning',
                'border-l-4 border-l-blue-500': toast.type === 'info'
             }">
             
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
                <!-- Success Icon -->
                <svg x-show="toast.type === 'success'" class="w-5 h-5 text-primary-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <!-- Error Icon -->
                <svg x-show="toast.type === 'error'" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <!-- Warning Icon -->
                <svg x-show="toast.type === 'warning'" class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <!-- Info Icon -->
                <svg x-show="toast.type === 'info'" class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 dark:text-gray-100" x-text="toast.title"></p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1" x-text="toast.message"></p>
            </div>

            <!-- Close Button -->
            <button @click="remove(toast.id)" class="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    </template>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('toastNotifier', () => ({
            toasts: [],
            add(options) {
                const id = Date.now();
                const toast = { 
                    id, 
                    show: true, 
                    type: options.type || 'info',
                    title: options.title || 'Notification',
                    message: options.message || '',
                    duration: options.duration || 4000 
                };
                this.toasts.push(toast);
                
                setTimeout(() => {
                    this.remove(id);
                }, toast.duration);
            },
            remove(id) {
                const index = this.toasts.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.toasts[index].show = false;
                    setTimeout(() => {
                        this.toasts = this.toasts.filter(t => t.id !== id);
                    }, 300); // Wait for exit transition
                }
            }
        }));
        
        window.notify = function(options) {
            window.dispatchEvent(new CustomEvent('notify', { detail: options }));
        };
    });
</script>
