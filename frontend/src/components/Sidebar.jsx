import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 h-screen border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors sticky top-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <CheckSquare className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">TaskFlow</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            <div className="flex items-center">
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                item.path === window.location.pathname ? 'text-primary-600' : 'group-hover:text-primary-500'
              }`} />
              {item.name}
            </div>
            <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform ${
              item.path === window.location.pathname ? 'opacity-100 translate-x-0' : '-translate-x-2'
            }`} />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl mb-4">
          <div className="flex items-center mb-1">
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold mr-3 border-2 border-white dark:border-gray-800">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
