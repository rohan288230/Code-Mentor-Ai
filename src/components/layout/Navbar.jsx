import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={ROUTES.HOME} onClick={closeMenu} className="text-2xl font-extrabold text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
          <GraduationCap size={28} className="text-[var(--color-primary)]" />
          <span className="tracking-tight">Code Mentor AI</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
          {user ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to={ROUTES.COURSES} className="text-gray-300 hover:text-white transition-colors">Courses</Link>
              <Link to={ROUTES.DSA} className="text-gray-300 hover:text-white transition-colors">Practice</Link>
              {user.role === 'admin' && (
                <Link to="/admin/courses" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Admin</Link>
              )}
              <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors ml-4 border-l border-white/10 pl-8">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              <Link to={ROUTES.LOGIN} className="text-gray-300 hover:text-white transition-colors px-4 py-2">Log In</Link>
              <Link to={ROUTES.LOGIN} className="bg-white text-black hover:bg-gray-200 transition-colors px-5 py-2 rounded-full font-semibold">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-[#020617] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4 text-sm font-medium">
              <Link to="/#features" onClick={closeMenu} className="text-gray-300 hover:text-white transition-colors block py-2">Features</Link>
              {user ? (
                <>
                  <Link to={ROUTES.DASHBOARD} onClick={closeMenu} className="text-gray-300 hover:text-white transition-colors block py-2">Dashboard</Link>
                  <Link to={ROUTES.COURSES} onClick={closeMenu} className="text-gray-300 hover:text-white transition-colors block py-2">Courses</Link>
                  <Link to={ROUTES.DSA} onClick={closeMenu} className="text-gray-300 hover:text-white transition-colors block py-2">Practice</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin/courses" onClick={closeMenu} className="text-blue-400 hover:text-blue-300 font-bold transition-colors block py-2">Admin</Link>
                  )}
                  <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-red-400 transition-colors py-2 pt-4 border-t border-white/10 mt-2">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-2">
                  <Link to={ROUTES.LOGIN} onClick={closeMenu} className="text-center text-white border border-white/20 rounded-lg py-3 hover:bg-white/5 transition-colors">Log In</Link>
                  <Link to={ROUTES.LOGIN} onClick={closeMenu} className="text-center bg-white text-black rounded-lg py-3 font-semibold hover:bg-gray-200 transition-colors">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
