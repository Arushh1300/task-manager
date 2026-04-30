const Loader = ({ label = 'Loading...', fullScreen = false }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-48'}`}>
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400" />
      {label}
    </div>
  </div>
);

export default Loader;
