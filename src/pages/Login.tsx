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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div 
          className="card border-primary-500/30 bg-dark-800/80 backdrop-blur-xl shadow-glow-green-lg"
          style={{ animation: 'slide-up 0.6s ease-out' }}
        >
          <div className="text-center mb-8">
            {/* Animated Logo */}
            <div 
              className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden"
              style={{ animation: 'glow-float 3s ease-in-out infinite' }}
            >
              <div className="absolute inset-0 bg-primary-500/50 blur-xl animate-pulse" />
              <svg 
                className="w-10 h-10 text-white relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <h2 className="text-4xl font-extrabold glow-text mb-2" style={{ animation: 'fade-in 0.8s ease-out' }}>
              Smart Grocery Refill
            </h2>
            <p className="mt-2 text-sm text-primary-300/80" style={{ animation: 'fade-in 1s ease-out' }}>
              Sign in to manage your inventory
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} style={{ animation: 'fade-in 1.2s ease-out' }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-400 mb-2">
                  Email address
                </label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger glow-text">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-400 mb-2">
                  Password
                </label>
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  placeholder="Enter your password"
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-danger glow-text">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 text-base font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? <Loading size="sm" /> : 'Sign in'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            <div className="rounded-xl border border-primary-500/30 bg-primary-500/5 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold text-primary-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                Demo Accounts
              </p>
              <ul className="space-y-2.5 text-xs text-primary-300/80">
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-500/10 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-green-sm" />
                  <span><strong className="text-primary-400">Admin:</strong> admin@demo.com / password</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-500/10 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-green-sm" />
                  <span><strong className="text-primary-400">Manager:</strong> manager@demo.com / password</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-500/10 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-green-sm" />
                  <span><strong className="text-primary-400">Supplier:</strong> supplier@demo.com / password</span>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

