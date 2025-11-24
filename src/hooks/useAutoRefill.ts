import { useEffect, useState } from 'react';
import { useProducts } from './useProducts';
import { orderService } from '@/services/orders';

interface AutoRefillOptions {
  enabled: boolean;
  onLowStockDetected?: (productId: number, productName: string) => void;
}

export const useAutoRefill = (options: AutoRefillOptions) => {
  const [processedLowStock, setProcessedLowStock] = useState<Set<number>>(new Set());
  const { data: productsData, refetch } = useProducts({ lowStock: true });

  useEffect(() => {
    if (!options.enabled || !productsData?.data) return;

    const lowStockProducts = productsData.data.filter(
      (p) => p.stock <= p.threshold && !processedLowStock.has(p.id)
    );

    if (lowStockProducts.length === 0) return;

    // Process each low stock product
    lowStockProducts.forEach(async (product) => {
      if (options.onLowStockDetected) {
        options.onLowStockDetected(product.id, product.name);
      }

      // Auto-create refill order (optional - can be toggled)
      try {
        await orderService.createOrder({
          productId: product.id,
          quantity: product.threshold * 2, // Order 2x threshold amount
        });
        setProcessedLowStock((prev) => new Set(prev).add(product.id));
      } catch (error) {
        console.error('Failed to create auto-refill order:', error);
      }
    });
  }, [productsData, options.enabled, processedLowStock, options]);

  // Poll every 30 seconds
  useEffect(() => {
    if (!options.enabled) return;

    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [options.enabled, refetch]);

  return {
    lowStockCount: productsData?.data.length || 0,
  };
};

