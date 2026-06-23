<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight">
            {{ __('Edit Configurator: ') }} {{ $configurator->name }}
        </h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <!-- Edit Name/Status Form -->
            <div class="bg-white dark:bg-dark-surface overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
                <div class="p-6">
                    <form method="POST" action="{{ route('configurators.update', $configurator) }}">
                        @csrf
                        @method('PUT')
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Name</label>
                                <input type="text" name="name" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT" value="{{ old('name', $configurator->name) }}" required>
                            </div>
                            <div>
                                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Status</label>
                                <select name="status" class="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT">
                                    <option value="active" {{ $configurator->status == 'active' ? 'selected' : '' }}>Active</option>
                                    <option value="inactive" {{ $configurator->status == 'inactive' ? 'selected' : '' }}>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="mt-8 flex justify-end items-center space-x-6">
                            <a href="{{ route('configurators.index') }}" class="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                                Cancel
                            </a>
                            <button type="submit" class="bg-primary-DEFAULT hover:bg-primary-hover text-black dark:text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-colors focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2">
                                Save Details
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
