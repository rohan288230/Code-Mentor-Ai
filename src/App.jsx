import { Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import { Loader2 } from 'lucide-react';
import { AppRoutes } from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-darker)] text-[var(--color-primary)]">
    <Loader2 size={40} className="animate-spin" />
  </div>
);

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-darker)]">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <Navbar />
      <main className="flex-grow pt-20">
        <Suspense fallback={<FullScreenLoader />}>
          <AppRoutes />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
