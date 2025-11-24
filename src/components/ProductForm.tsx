import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Input, Textarea, Select } from './FormFields';
import { Loading } from './Loading';
import type { Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  threshold: z.number().int().min(0, 'Threshold must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().optional(),
  unit: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock: product.stock,
          threshold: product.threshold,
          category: product.category,
          sku: product.sku || '',
          unit: product.unit || '',
        }
      : undefined,
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      // Error handling is done by the mutation
    }
  };

  const categories = [
    'Grocery',
    'Beverages',
    'Dairy',
    'Fruits & Vegetables',
    'Snacks',
    'Household',
    'Personal Care',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('name')}
        label="Product Name"
        error={errors.name?.message}
        required
      />
      <Textarea
        {...register('description')}
        label="Description"
        error={errors.description?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('price', { valueAsNumber: true })}
          type="number"
          step="0.01"
          label="Price (₹)"
          error={errors.price?.message}
          required
        />
        <Input
          {...register('stock', { valueAsNumber: true })}
          type="number"
          label="Stock Quantity"
          error={errors.stock?.message}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('threshold', { valueAsNumber: true })}
          type="number"
          label="Threshold Level"
          error={errors.threshold?.message}
          required
        />
        <Select
          {...register('category')}
          label="Category"
          options={[
            { value: '', label: 'Select category' },
            ...categories.map((cat) => ({ value: cat, label: cat })),
          ]}
          error={errors.category?.message}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('sku')}
          label="SKU (optional)"
          error={errors.sku?.message}
        />
        <Input
          {...register('unit')}
          label="Unit (e.g., kg, L, pcs)"
          error={errors.unit?.message}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? <Loading size="sm" /> : product ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

