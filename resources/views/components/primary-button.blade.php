<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center px-4 py-2 bg-primary-DEFAULT border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-hover focus:bg-primary-hover active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm']) }}>
    {{ $slot }}
</button>
