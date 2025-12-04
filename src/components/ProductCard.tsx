import { Badge } from './Badge';
import { formatCurrency } from '@/utils/currency';
import { isLowStock } from '@/utils/validators';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onOrder?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const ProductCard = ({
  product,
  onEdit,
  onOrder,
  onDelete,
  canEdit = false,
  canDelete = false,
}: ProductCardProps) => {
  const lowStock = isLowStock(product.stock, product.threshold);

  const getProductImage = (product: Product) => {
    if (product.image) return product.image;
    // Fallback to placeholder images based on category
    const categoryImages: Record<string, string> = {
      'Grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
      'Personal Care': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
      'Dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    };
    return categoryImages[product.category] || 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop';
  };

  return (
    <div
      className={`card relative overflow-hidden transition duration-300 hover:-translate-y-1 ${
        lowStock ? 'border-danger/30 bg-danger/5' : ''
      }`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-primary-50/40" aria-hidden />
      <div className="relative">
        {/* Product Image */}
        <div className="mb-4 -mx-6 -mt-6">
          <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-100 to-primary-50">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop';
              }}
            />
            <div className="absolute top-3 left-3">
              <span className="pill bg-white/90 backdrop-blur-sm">{product.category || 'General'}</span>
            </div>
            {lowStock && (
              <div className="absolute top-3 right-3">
                <Badge variant="danger">Low Stock</Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-neutral-900">{product.name}</h3>
          </div>
          <div className="text-right ml-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Price</p>
            <p className="text-2xl font-semibold text-primary-700">{formatCurrency(product.price)}</p>
          </div>
        </div>

        {product.description && (
          <p className="mt-3 line-clamp-2 text-sm text-neutral-500">{product.description}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-3">
            <p className="text-xs uppercase tracking-wide text-primary-600">Current Stock</p>
            <p className={`text-2xl font-semibold ${lowStock ? 'text-danger' : 'text-primary-700'}`}>
              {product.stock}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-100 bg-white p-3 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Threshold</p>
            <p className="text-2xl font-semibold text-neutral-800">{product.threshold}</p>
          </div>
        </div>

        {lowStock && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
            ⚠️ Auto-refill will trigger at {product.threshold} units
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {onOrder && (
            <button
              onClick={() => onOrder(product)}
              className="btn btn-primary flex-1 text-sm"
              aria-label={`Order ${product.name}`}
            >
              Create Order
            </button>
          )}
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="btn btn-secondary text-sm"
              aria-label={`Edit ${product.name}`}
            >
              Edit
            </button>
          )}
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(product)}
              className="btn btn-danger text-sm"
              aria-label={`Delete ${product.name}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

