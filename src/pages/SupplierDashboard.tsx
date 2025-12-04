import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils';
import { Link } from 'react-router-dom';
import {
  TruckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { Order, PaymentStatus } from '@/types';

export const SupplierDashboard = () => {
  const { user } = useAuthStore();
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | ''>('');

  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    supplierId: user?.id,
    limit: 50,
  });

  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 100 });

  if (ordersLoading || productsLoading) {
    return <Loading />;
  }

  const orders = ordersData?.data || [];
  const filteredOrders = paymentFilter
    ? orders.filter((o) => o.paymentStatus === paymentFilter)
    : orders;

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    shippedOrders: orders.filter((o) => o.status === 'shipped').length,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
    unpaidOrders: orders.filter((o) => o.paymentStatus === 'unpaid').length,
    paidOrders: orders.filter((o) => o.paymentStatus === 'paid').length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    pendingRevenue: orders
      .filter((o) => o.paymentStatus === 'unpaid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  const recentOrders = filteredOrders.slice(0, 10);
  const topProducts = productsData?.data
    .filter((p) => orders.some((o) => o.productId === p.id))
    .slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-white/80">Supplier Portal</p>
        <h1 className="mt-2 text-3xl font-semibold">Fulfillment Dashboard</h1>
        <p className="mt-2 text-sm text-white/90">
          Manage orders, track payments, and monitor your supplier performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<TruckIcon className="h-6 w-6 text-primary-600" />}
          subtitle={`${stats.pendingOrders} pending`}
        />
        <StatCard
          title="Unpaid Orders"
          value={stats.unpaidOrders}
          icon={<ExclamationTriangleIcon className="h-6 w-6 text-warning" />}
          subtitle={formatCurrency(stats.pendingRevenue)}
          tone="warning"
        />
        <StatCard
          title="Paid Orders"
          value={stats.paidOrders}
          icon={<CheckCircleIcon className="h-6 w-6 text-success" />}
          subtitle={formatCurrency(stats.totalRevenue)}
          tone="success"
        />
        <StatCard
          title="Shipped Today"
          value={stats.shippedOrders}
          icon={<ClockIcon className="h-6 w-6 text-accent-500" />}
          subtitle={`${stats.deliveredOrders} delivered`}
          tone="accent"
        />
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card border border-primary-100 bg-gradient-to-br from-primary-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-600">Total Revenue</p>
              <p className="mt-2 text-3xl font-semibold text-primary-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="mt-1 text-sm text-primary-600">From {stats.paidOrders} paid orders</p>
            </div>
            <div className="rounded-2xl bg-primary-100 p-4">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card border border-warning/20 bg-gradient-to-br from-warning/10 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-warning">Pending Payment</p>
              <p className="mt-2 text-3xl font-semibold text-warning">
                {formatCurrency(stats.pendingRevenue)}
              </p>
              <p className="mt-1 text-sm text-warning">From {stats.unpaidOrders} unpaid orders</p>
            </div>
            <div className="rounded-2xl bg-warning/20 p-4">
              <ClockIcon className="h-8 w-8 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Filter */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-400">Order Management</p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-900">Recent Orders</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentFilter('')}
              className={`btn btn-secondary text-sm ${!paymentFilter ? 'bg-primary-100' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setPaymentFilter('unpaid')}
              className={`btn btn-secondary text-sm ${paymentFilter === 'unpaid' ? 'bg-warning/20' : ''}`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setPaymentFilter('paid')}
              className={`btn btn-secondary text-sm ${paymentFilter === 'paid' ? 'bg-success/20' : ''}`}
            >
              Paid
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-center py-8 text-neutral-500">No orders found</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-100 bg-white/80 p-4 shadow-soft hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-neutral-900">#{order.id}</p>
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'pending'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {order.status}
                    </Badge>
                    <Badge
                      variant={
                        order.paymentStatus === 'paid'
                          ? 'success'
                          : order.paymentStatus === 'unpaid'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {order.paymentStatus || 'unpaid'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">{order.product?.name || 'Unknown Product'}</p>
                  <p className="text-xs text-neutral-400">Qty: {order.quantity} · {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-400">Amount</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatCurrency(order.totalAmount || 0)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {orders.length > 10 && (
          <div className="mt-6">
            <Link to="/orders" className="btn btn-secondary w-full">
              View All Orders
            </Link>
          </div>
        )}
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Product Insights</p>
              <h2 className="mt-1 text-xl font-semibold text-neutral-900">Top Products</h2>
            </div>
            <ChartBarIcon className="h-6 w-6 text-neutral-400" />
          </div>
          <div className="mt-6 space-y-3">
            {topProducts.map((product) => {
              const productOrders = orders.filter((o) => o.productId === product.id);
              const totalQuantity = productOrders.reduce((sum, o) => sum + o.quantity, 0);
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white/60 p-4"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-700">{totalQuantity} units</p>
                    <p className="text-xs text-neutral-400">{productOrders.length} orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  tone?: 'warning' | 'success' | 'accent';
}

const StatCard = ({ title, value, icon, subtitle, tone }: StatCardProps) => {
  const toneClass =
    tone === 'warning'
      ? 'from-warning/20 to-white text-warning'
      : tone === 'success'
      ? 'from-success/20 to-white text-success'
      : tone === 'accent'
      ? 'from-accent-100 to-white text-accent-600'
      : 'from-primary-50 to-white text-primary-700';

  return (
    <div className="card border-none bg-white/90 shadow-soft">
      <div className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r px-4 py-2 text-xs font-semibold uppercase tracking-wide ${toneClass}`}>
        {icon}
        {title}
      </div>
      <p className="mt-4 text-3xl font-semibold text-neutral-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
    </div>
  );
};

