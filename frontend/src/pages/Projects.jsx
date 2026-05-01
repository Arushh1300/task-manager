import { useCallback, useEffect, useState } from 'react';
import api, { getApiErrorMessage } from '../api/axios';
import { Plus, Users, FolderOpen, MoreVertical, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  const fetchProjects = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to load projects');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchProjects, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating project...');
    setSubmitting(true);
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setIsModalOpen(false);
      fetchProjects();
      toast.success('Project created successfully!', { id: loadingToast });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Error creating project'), { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const loadingToast = toast.loading('Deleting project...');
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
      toast.success('Project deleted successfully!', { id: loadingToast });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Error deleting project'), { id: loadingToast });
    }
  };

  if (loading) return <Loader label="Loading projects..." />;
  if (!user) return null;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and collaborate on your team projects.</p>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter projects..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState
              icon={FolderOpen}
              title="No projects yet"
              description="Create your first project to organize tasks, members, and deadlines."
              action={
                user?.role === 'admin' && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </button>
                )
              }
            />
          </div>
        )}
        {projects.map((project) => (
          <div key={project._id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6" />
              </div>
              {user?.role === 'admin' ? (
                <button 
                  onClick={() => handleDeleteProject(project._id)}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              ) : (
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 h-10">{project.description}</p>
            
            <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Team Members
                </span>
                <div className="flex -space-x-2">
                  {(project.members || []).slice(0, 3).map(member => (
                    <div key={member._id} className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                      {member.name?.slice(0, 2).toUpperCase() || 'U'}
                    </div>
                  ))}
                  {(project.members?.length || 0) > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-400">
                {project.members?.length || 0} member{project.members?.length === 1 ? '' : 's'}
              </p>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary-600 h-full rounded-full w-2/3 shadow-sm"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Create Project</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Set up a new space for your team to collaborate.</p>
            
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  required
                  placeholder="Describe the goals and scope..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                  rows="4"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
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
                  ) : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
