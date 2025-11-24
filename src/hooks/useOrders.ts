import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orders';
import type { Order, OrderFilters } from '@/types';

export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getOrders(filters),
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order['status'] }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
  });
};

