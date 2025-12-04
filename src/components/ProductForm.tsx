import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Input, Textarea, Select } from './FormFields';
import { Loading } from './Loading';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      let imageUrl = product?.image || '';
      
      // If new image is uploaded, convert to base64 or use data URL
      if (imageFile) {
        imageUrl = await convertImageToBase64(imageFile);
      } else if (!imagePreview && product?.image) {
        // Keep existing image if no new one is selected
        imageUrl = product.image;
      }

      const productData = {
        ...data,
        image: imageUrl || undefined,
      };

      if (product) {
        await updateProduct.mutateAsync({ id: product.id, data: productData });
      } else {
        await createProduct.mutateAsync(productData);
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
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Product Image
        </label>
        <div className="mt-1 flex items-center gap-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-32 w-32 object-cover rounded-xl border-2 border-primary-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1 hover:bg-danger/90 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="h-32 w-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50">
              <PhotoIcon className="h-12 w-12 text-slate-400" />
            </div>
          )}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="btn btn-secondary cursor-pointer inline-flex items-center gap-2"
            >
              <PhotoIcon className="h-5 w-5" />
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </label>
            <p className="mt-2 text-xs text-slate-500">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>

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

