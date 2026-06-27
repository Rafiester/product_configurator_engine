export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-fadeIn">
      {/* Modern Fluent SaaS Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-pink-150 dark:border-pink-950/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-450 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
