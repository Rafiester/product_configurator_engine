export default function DashboardPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-dark-surface overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
          <div className="p-6 text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">You're logged in!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to the Next.js migration of the PC Configurator Admin Panel. Use the navigation bar above to manage Product Master Data and Configurations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
