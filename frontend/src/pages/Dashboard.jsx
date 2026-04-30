import { useCallback, useEffect, useState } from 'react';
import api, { getApiErrorMessage } from '../api/axios';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const StatCard = ({ title, value, icon: Icon, colorClass, progress }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
        <TrendingUp className="w-3 h-3 mr-1" />
        +12%
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{value}</h3>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-400">Monthly Goal</span>
            <span className="text-gray-900 dark:text-white">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div 
              className="h-full rounded-full bg-primary-600 transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
      try {
        setError('');
        const [tasksResponse, projectsResponse] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects'),
        ]);
        const tasks = tasksResponse.data;
        
        const now = new Date();
        const computedStats = tasks.reduce((acc, task) => {
          acc.total++;
          if (task.status === 'done') acc.completed++;
          else acc.pending++;
          
          if (task.status !== 'done' && new Date(task.dueDate) < now) {
            acc.overdue++;
          }
          return acc;
        }, { total: 0, completed: 0, pending: 0, overdue: 0 });

        setStats(computedStats);
        setChartData([
          { name: 'Todo', tasks: computedStats.pending },
          { name: 'Done', tasks: computedStats.completed },
          { name: 'Overdue', tasks: computedStats.overdue },
        ]);
        setRecentProjects(projectsResponse.data.slice(0, 3));
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to load dashboard data');
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    const refresh = () => fetchStats();
    const timeoutId = window.setTimeout(refresh, 0);

    window.addEventListener('taskflow:data-updated', refresh);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('taskflow:data-updated', refresh);
    };
  }, [fetchStats]);

  if (loading) return <Loader label="Loading dashboard..." />;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </p>
          )}
        </div>
        <button className="hidden md:flex items-center text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
          Download Report
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={BarChart3} 
          colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          progress={75}
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={CheckCircle2} 
          colorClass="bg-green-500/10 text-green-600 dark:text-green-400"
          progress={completionRate}
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={Clock} 
          colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          progress={40}
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={AlertCircle} 
          colorClass="bg-red-500/10 text-red-600 dark:text-red-400"
          progress={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Activity Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(14, 165, 233, 0.08)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Bar dataKey="tasks" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Recent Projects</h3>
          <div className="space-y-4">
            {recentProjects.map(project => (
              <div key={project._id} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mr-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</p>
                  <p className="text-xs text-gray-500">
                    Updated {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentProjects.length === 0 && (
              <EmptyState title="No projects yet" description="Create a project to start organizing team work." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
