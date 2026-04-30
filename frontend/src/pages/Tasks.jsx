import { useCallback, useEffect, useState } from 'react';
import api, { getApiErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  MoreVertical,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    dueDate: '',
    assignedTo: ''
  });
  
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setError('');
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks', {
          params: filterProject === 'all' ? undefined : { project: filterProject },
        }),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to load data');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filterProject]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchData, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      window.dispatchEvent(new Event('taskflow:data-updated'));
      fetchData();
      toast.success('Task updated!', { id: loadingToast });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Update failed'), { id: loadingToast });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating task...');
    setSubmitting(true);
    try {
      await api.post('/tasks', newTask);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', projectId: '', dueDate: '', assignedTo: '' });
      window.dispatchEvent(new Event('taskflow:data-updated'));
      fetchData();
      toast.success('Task created!', { id: loadingToast });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Error creating task'), { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProject = projects.find((project) => project._id === newTask.projectId);
  const assignees = selectedProject
    ? selectedProject.members || []
    : user
      ? [user]
      : [];

  const filteredTasks = tasks.filter(task => 
    filterStatus === 'all' ? true : task.status === filterStatus
  );

  const isOverdue = (date, status) => {
    return status !== 'done' && new Date(date) < new Date();
  };

  if (loading) return <Loader label="Loading tasks..." />;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage individual work items and priorities.</p>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
            {['all', 'todo', 'in-progress', 'done'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                  filterStatus === status 
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
          <select
            value={filterProject}
            onChange={(e) => {
              setLoading(true);
              setFilterProject(e.target.value);
            }}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          >
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Work Item</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTasks.map((task) => (
                <tr key={task._id} className={`${isOverdue(task.dueDate, task.status) ? 'bg-red-50/50 dark:bg-red-950/10' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}>
                  <td className="px-6 py-5">
                    <div className="flex items-start">
                      <div className={`mt-1 w-2 h-2 rounded-full mr-3 ${
                        task.status === 'done' ? 'bg-green-500' :
                        task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white leading-tight">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">{task.description}</p>
                        <p className="text-[11px] font-semibold text-gray-400 mt-1">
                          Assigned to {task.assignedTo?.name || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                      {task.projectId?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center text-xs font-bold ${
                      isOverdue(task.dueDate, task.status) 
                        ? 'text-red-500' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {isOverdue(task.dueDate, task.status) && (
                        <span className="ml-2 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded text-[10px] uppercase">Overdue</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      task.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                        className="text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1.5 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer dark:text-white"
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={CheckCircle2}
                title="No tasks yet"
                description="Create a task to assign work, track status, and monitor deadlines."
                action={
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Create Task</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Add a new item to your team's workflow.</p>
            
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design System Audit"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project</label>
                  <select
                    required
                    value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white text-sm"
                  >
                    <option value="">Select...</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assign To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white text-sm"
                >
                  <option value="">Assign to me</option>
                  {assignees.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  required
                  placeholder="What needs to be done?"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="inline-flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating
                    </span>
                  ) : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
