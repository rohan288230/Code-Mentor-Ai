import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, House, Code, BookOpen, FileText, IdCard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSidebarOpen(false); // Default hidden on mobile
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true); // Default open on desktop
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change if mobile
  useEffect(() => {
    if (isMobile) {
      setTimeout(() => setIsSidebarOpen(false), 0);
    }
  }, [location.pathname, isMobile]);

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: House },
    { name: 'DSA Questions', path: ROUTES.DSA, icon: Code },
    { name: 'All Courses', path: ROUTES.COURSES, icon: BookOpen },
    { name: 'Resume Maker', path: ROUTES.RESUME, icon: FileText },
    { name: 'Interview Prep', path: ROUTES.INTERVIEW, icon: IdCard },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-darker)] text-[var(--color-text-main)] overflow-hidden">
      
      {/* Mobile Top Bar (Only visible when mobile and sidebar is closed) */}
      {isMobile && (
        <div className="fixed top-0 left-0 w-full h-16 bg-[#1e293b]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold">
            <GraduationCap size={24} />
            <span>Code Mentor AI</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu size={24} className="text-white" />
          </button>
        </div>
      )}

      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside 
            variants={isMobile ? sidebarVariants : {}}
            initial={isMobile ? "closed" : false}
            animate={isMobile ? "open" : false}
            exit={isMobile ? "closed" : false}
            className={`fixed left-0 top-0 h-screen w-[280px] bg-[#1e293b]/95 backdrop-blur-xl border-r border-white/10 flex flex-col px-6 py-8 z-50 transition-all duration-300 ${!isMobile && !isSidebarOpen ? 'w-[80px] px-4' : ''}`}
          >
            <div className="flex justify-between items-center mb-10">
              <div className={`text-2xl font-extrabold text-[var(--color-primary)] flex items-center gap-3 ${!isMobile && !isSidebarOpen ? 'justify-center w-full' : ''}`}>
                <GraduationCap size={28} className="shrink-0" /> 
                <span className={`whitespace-nowrap ${!isMobile && !isSidebarOpen ? 'hidden' : ''}`}>Code Mentor AI</span>
              </div>
              
              {/* Close Button on Mobile */}
              {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                  <X size={24} />
                </button>
              )}
            </div>
            
            <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === ROUTES.INTERVIEW && location.pathname === ROUTES.RESUME);
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`flex items-center gap-4 p-4 rounded-xl font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] shadow-sm' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    title={item.name}
                  >
                    <item.icon size={22} className={`shrink-0 ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
                    <span className={`whitespace-nowrap ${!isMobile && !isSidebarOpen ? 'hidden' : ''}`}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {user && (
              <div className={`mt-auto flex items-center gap-4 pt-6 border-t border-white/10 ${!isMobile && !isSidebarOpen ? 'justify-center' : ''}`}>
                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center font-black text-white text-xl shadow-lg border border-white/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className={`${!isMobile && !isSidebarOpen ? 'hidden' : 'flex flex-col overflow-hidden'}`}>
                  <span className="font-bold text-white whitespace-nowrap truncate">{user.name}</span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">{user.role || 'Student'}</span>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 min-h-screen w-full ${isMobile ? 'pt-16 px-4 pb-8' : (isSidebarOpen ? 'ml-[280px] p-8 md:p-10' : 'ml-[80px] p-8 md:p-10')}`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
