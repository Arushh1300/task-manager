import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signup(name, email, password);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-950 transition-colors">
      {/* Left Side - Visual */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 p-12 flex-col justify-between items-start text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <CheckSquare className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
          </div>
          <h2 className="text-5xl font-black leading-tight mb-6">
            Join the elite teams<br />moving faster.
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Start your 14-day free trial today. No credit card required. Cancel anytime.
          </p>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
            <p className="text-2xl font-bold">10k+</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Active Users</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Uptime Rate</p>
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary-600 rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-[120px]"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Get Started</h2>
            <p className="text-gray-500 dark:text-gray-400">Create your account to start managing projects.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
              By signing up, you agree to our <a href="#" className="text-primary-600 font-bold">Terms of Service</a> and <a href="#" className="text-primary-600 font-bold">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3.5 rounded-2xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
