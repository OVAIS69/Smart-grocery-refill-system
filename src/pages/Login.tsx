import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/FormFields';
import { Loading } from '@/components/Loading';
import { useToast } from '@/contexts/useToast';
import { getErrorMessage } from '@/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const { error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'manager@demo.com',
      password: 'password',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/', { replace: true });
    } catch (error) {
      showError(getErrorMessage(error, 'Login failed. Please check your credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div 
          className="card shadow-2xl border-2 border-primary-100"
          style={{ animation: 'slide-up 0.6s ease-out' }}
        >
          <div className="text-center mb-8">
            {/* Animated Logo */}
            <div 
              className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden shadow-lg"
              style={{ animation: 'glow-float 3s ease-in-out infinite' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 opacity-50 blur-xl animate-pulse" />
              <svg 
                className="w-10 h-10 text-white relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2" style={{ animation: 'fade-in 0.8s ease-out' }}>
              Smart Grocery Refill
            </h2>
            <p className="mt-2 text-sm text-slate-600" style={{ animation: 'fade-in 1s ease-out' }}>
              Sign in to manage your inventory
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} style={{ animation: 'fade-in 1.2s ease-out' }}>
            <div className="space-y-4">
              <div>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  label="Email address"
                  autoComplete="email"
                  error={errors.email?.message}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  label="Password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 text-base font-semibold"
              >
                {isLoading ? <Loading size="sm" /> : 'Sign in'}
              </button>
            </div>

            <div className="rounded-xl border-2 border-primary-100 bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                Demo Accounts
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  <span><strong className="text-primary-600">Admin:</strong> admin@demo.com / password</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  <span><strong className="text-primary-600">Manager:</strong> manager@demo.com / password</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  <span><strong className="text-primary-600">Supplier:</strong> supplier@demo.com / password</span>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

