import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [user, navigate]);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'signup' && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password, rememberMe);
        toast.success('Welcome back!');
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
      }
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-secondary)]/10 blur-[150px] rounded-full pointer-events-none" />

      <Link to={ROUTES.HOME} className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20 font-medium">
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] p-8 md:p-10 relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        <div className="text-center mb-6">
          <Link to={ROUTES.HOME} className="inline-flex items-center justify-center gap-2 text-2xl font-extrabold text-[var(--color-primary)] mb-6 hover:opacity-80 transition-opacity">
            <GraduationCap size={28} /> Code Mentor AI
          </Link>
          
          {/* Tabs */}
          <div className="flex bg-black/40 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setFormData({ name: '', email: '', password: '' }); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setFormData({ name: '', email: '', password: '' }); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'signup' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-gray-400 text-sm">
            {activeTab === 'login' ? 'Enter your details to sign in to your account' : 'Start your journey to mastering coding'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <input 
                type="text" 
                required 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-white placeholder-gray-600"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-white placeholder-gray-600"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-white placeholder-gray-600"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {activeTab === 'signup' && formData.password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2"
              >
                <div className="flex gap-1 mb-1.5 h-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`flex-1 rounded-full transition-colors duration-300 ${
                        strength >= level 
                          ? strength <= 2 ? 'bg-yellow-500' : 'bg-green-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>Password strength</span>
                  <span>{strength <= 1 ? 'Weak' : strength <= 3 ? 'Good' : 'Strong'}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'login' && (
            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-white/20 group-hover:border-[var(--color-primary)]'}`}>
                  <CheckCircle2 size={12} className={`text-black transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[var(--color-primary)] hover:underline">Forgot password?</a>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-white text-black font-semibold rounded-xl py-3 mt-4 hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
