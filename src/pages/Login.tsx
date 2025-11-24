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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Smart Grocery
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Demo credentials: manager@demo.com / password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              {...register('email')}
              id="email"
              type="email"
              label="Email address"
              autoComplete="email"
              error={errors.email?.message}
              className="rounded-t-md"
              required
            />
            <Input
              {...register('password')}
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              error={errors.password?.message}
              className="rounded-b-md"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loading size="sm" /> : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
            <p className="font-semibold mb-2">Demo Accounts:</p>
            <ul className="space-y-1 text-xs">
              <li>• admin@demo.com / password (Admin)</li>
              <li>• manager@demo.com / password (Manager)</li>
              <li>• supplier@demo.com / password (Supplier)</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

