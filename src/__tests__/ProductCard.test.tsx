import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 100,
  stock: 5,
  threshold: 10,
  category: 'Grocery',
};

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/₹100/)).toBeInTheDocument();
    expect(screen.getByText(/Stock: 5/)).toBeInTheDocument();
  });

  it('should show low stock badge when stock is below threshold', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/Low Stock/)).toBeInTheDocument();
  });

  it('should not show low stock badge when stock is above threshold', () => {
    const productWithHighStock = { ...mockProduct, stock: 15 };
    render(<ProductCard product={productWithHighStock} />);
    expect(screen.queryByText(/Low Stock/)).not.toBeInTheDocument();
  });
});

