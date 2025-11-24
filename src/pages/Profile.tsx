import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/FormFields';
import { useToast } from '@/contexts/useToast';
import { Badge } from '@/components/Badge';
import apiClient from '@/services/api';
import { getErrorMessage } from '@/utils';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile = () => {
  const { user } = useAuthStore();
  const { success, error: showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
        }
      : undefined,
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    try {
      await apiClient.put(`/users/${user.id}`, data);
      success('Profile updated successfully');
      // Refresh user data
      window.location.reload();
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to update profile'));
    }
  };

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
      </div>

      <div className="card max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Account Information</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Role:</span>
            <Badge variant="info">{user.role}</Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('name')}
            label="Name"
            error={errors.name?.message}
            required
          />
          <Input
            {...register('email')}
            type="email"
            label="Email"
            error={errors.email?.message}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

