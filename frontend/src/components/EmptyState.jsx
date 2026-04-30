import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
