@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT rounded-md shadow-sm transition-colors duration-200']) }}>
