import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './Toast';
import { useToast } from '@/contexts/useToast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative">
      {/* Animated Glowing Background Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern with Green Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      
      {/* Content */}
      <div className="relative backdrop-blur-sm">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Sidebar />
          <main className="min-h-[calc(100vh-4rem)] flex-1 py-8 md:pl-8">
            <div className="space-y-8 relative z-10">{children}</div>
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

