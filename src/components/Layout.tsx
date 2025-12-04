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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/30 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative">
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

