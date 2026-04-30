import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 p-8 sm:p-10 relative overflow-hidden">
        
        {/* Decorative subtle glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/30 mb-6">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Log in to manage your tasks efficiently.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4" />
              Remember me
            </label>
            <a href="#" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:active:scale-100 group"
          >
            {loading ? (
              <>
                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="relative z-10 mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
