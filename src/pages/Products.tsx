import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { ProductCard } from '@/components/ProductCard';
import { Modal } from '@/components/Modal';
import { ProductForm } from '@/components/ProductForm';
import { Pagination } from '@/components/Pagination';
import { Input, Select } from '@/components/FormFields';
import { Loading } from '@/components/Loading';
import { useToast } from '@/contexts/useToast';
import { useAutoRefill } from '@/hooks/useAutoRefill';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getErrorMessage } from '@/utils';
import type { Product } from '@/types';

export const Products = () => {
  const { hasRole } = useAuthStore();
  const { success, error: showError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [autoRefillEnabled, setAutoRefillEnabled] = useState(false);

  const { data, isLoading, refetch } = useProducts({
    page,
    limit: 12,
    q: search || undefined,
    category: category || undefined,
    lowStock: lowStockOnly || undefined,
  });

  const deleteProduct = useDeleteProduct();
  const createOrder = useCreateOrder();

  const { lowStockCount } = useAutoRefill({
    enabled: autoRefillEnabled,
    onLowStockDetected: (_productId, productName) => {
      success(`Auto-refill order created for ${productName}`);
    },
  });

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      success('Product deleted successfully');
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to delete product'));
    }
  };

  const handleOrder = async (product: Product) => {
    try {
      await createOrder.mutateAsync({
        productId: product.id,
        quantity: product.threshold * 2,
      });
      success('Order created successfully');
      refetch();
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to create order'));
    }
  };

  const categories = Array.from(new Set(data?.data.map((p) => p.category).filter(Boolean) || []));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Inventory Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Product intelligence center</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Track refill readiness, automate replenishment rules, and enrich supplier insights.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="pill">Total SKUs · {data?.total ?? 0}</span>
            <span className="pill">Low stock · {lowStockCount}</span>
          </div>
        </div>
        {hasRole(['admin', 'manager']) && (
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Product
          </button>
        )}
      </div>

      <section className="card">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by SKU, product name or supplier"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-12"
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          />
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-2">
              <span className="text-sm text-neutral-600">Low stock only</span>
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => {
                  setLowStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-2">
              <span className="text-sm text-neutral-600">Auto-refill demo</span>
              <input
                type="checkbox"
                checked={autoRefillEnabled}
                onChange={(e) => setAutoRefillEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>
      </section>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data?.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={hasRole(['admin', 'manager']) ? setEditingProduct : undefined}
                onOrder={handleOrder}
                onDelete={hasRole(['admin']) ? handleDelete : undefined}
                canEdit={hasRole(['admin', 'manager'])}
                canDelete={hasRole(['admin'])}
              />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              totalItems={data.total}
              itemsPerPage={12}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isCreateModalOpen || !!editingProduct}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct ?? undefined}
          onSuccess={() => {
            const wasEditing = Boolean(editingProduct);
            setIsCreateModalOpen(false);
            setEditingProduct(null);
            refetch();
            success(wasEditing ? 'Product updated' : 'Product created');
          }}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setEditingProduct(null);
          }}
        />
      </Modal>
    </div>
  );
};

