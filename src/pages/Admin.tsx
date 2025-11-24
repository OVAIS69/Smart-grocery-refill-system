import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';
import { Input, Select } from '@/components/FormFields';
import { useToast } from '@/contexts/useToast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/types';
import { getErrorMessage } from '@/utils';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'manager', 'supplier']),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export const Admin = () => {
  const { success, error: showError } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get<User[]>('/users');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: editingUser
      ? {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }
      : undefined,
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await apiClient.put(`/users/${editingUser.id}`, data);
        success('User updated successfully');
      } else {
        await apiClient.post('/users', data);
        success('User created successfully');
      }
      setIsCreateModalOpen(false);
      setEditingUser(null);
      reset();
      refetch();
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to save user'));
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      await apiClient.delete(`/users/${user.id}`);
      success('User deleted successfully');
      refetch();
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to delete user'));
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof User },
    { header: 'Email', accessor: 'email' as keyof User },
    {
      header: 'Role',
      accessor: (row: User) => <Badge variant="info">{row.role}</Badge>,
    },
    {
      header: 'Actions',
      accessor: (row: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditingUser(row)}
            className="btn btn-secondary text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="btn btn-danger text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage system users and roles</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
          Add User
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="card">
          <Table columns={columns} data={users || []} emptyMessage="No users found" />
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen || !!editingUser}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingUser(null);
          reset();
        }}
        title={editingUser ? 'Edit User' : 'Create User'}
      >
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
          <Select
            {...register('role')}
            label="Role"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'supplier', label: 'Supplier' },
            ]}
            error={errors.role?.message}
            required
          />
          {!editingUser && (
            <Input
              {...register('password')}
              type="password"
              label="Password"
              error={errors.password?.message}
              required
            />
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingUser(null);
                reset();
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

