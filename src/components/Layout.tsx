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
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-primary-50">
      <div className="pointer-events-none fixed inset-0 bg-grid-light opacity-40" aria-hidden />
      <div className="relative">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Sidebar />
          <main className="min-h-[calc(100vh-4rem)] flex-1 py-8 md:pl-8">
            <div className="space-y-8">{children}</div>
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

