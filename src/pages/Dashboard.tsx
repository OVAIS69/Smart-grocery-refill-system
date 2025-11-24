import { ReactNode } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/hooks/useNotifications';
import { isLowStock } from '@/utils/validators';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  ShoppingCartIcon,
  BellIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export const Dashboard = () => {
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 10 });
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 5 });
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();

  const lowStockProducts = productsData?.data.filter((p) => isLowStock(p.stock, p.threshold)) || [];
  const unreadNotifications = notifications?.filter((n) => !n.read) || [];
  const pendingOrders = ordersData?.data.filter((o) => o.status === 'pending') || [];

  if (productsLoading || ordersLoading || notificationsLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      <section className="card relative overflow-hidden border-none bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white shadow-card">
        <div className="absolute right-0 top-0 hidden h-full w-1/3 bg-white/10 lg:block" aria-hidden />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Operational Pulse</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back! Inventory is healthy and ready to automate.</h1>
          <p className="mt-2 text-white/80">
            Track refill readiness, critical alerts, and supplier fulfillment at a glance.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white/10 px-5 py-3 text-sm">
              Auto-refill <span className="font-semibold text-white">enabled</span>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-3 text-sm">
              SLA compliance <span className="font-semibold text-white">98%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={productsData?.total || 0}
          icon={<CubeIcon className="h-6 w-6 text-primary-600" />}
          chip="+4 added this week"
        />
        <StatCard
          title="Low Stock"
          value={lowStockProducts.length}
          icon={<ExclamationTriangleIcon className="h-6 w-6 text-warning" />}
          chip="Attention needed"
          tone="warning"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders.length}
          icon={<ShoppingCartIcon className="h-6 w-6 text-accent-500" />}
          chip="Supplier updates"
          tone="accent"
        />
        <StatCard
          title="Unread Alerts"
          value={unreadNotifications.length}
          icon={<BellIcon className="h-6 w-6 text-secondary-500" />}
          chip="Notifications center"
          tone="secondary"
        />
      </section>

      {lowStockProducts.length > 0 && (
        <section className="card border border-danger/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-danger">Low stock watchlist</p>
              <h2 className="mt-1 text-xl font-semibold text-neutral-900">
                {lowStockProducts.length} items below threshold
              </h2>
              <p className="text-sm text-neutral-500">Auto-refill will prioritize these SKUs</p>
            </div>
            <Link to="/products?lowStock=true" className="btn btn-secondary">
              Review all
            </Link>
          </div>
          <div className="mt-6 grid gap-3">
            {lowStockProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-2xl border border-danger/10 bg-danger/5 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-neutral-900">{product.name}</p>
                  <p className="text-xs text-neutral-500">{product.category}</p>
                </div>
                <Badge variant="danger">
                  {product.stock} / {product.threshold}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {ordersData && ordersData.data.length > 0 && (
        <section className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Fulfillment pipeline</p>
              <h2 className="text-xl font-semibold text-neutral-900">Recent Orders</h2>
            </div>
            <Link to="/orders" className="btn btn-secondary">
              View orders
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {ordersData.data.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white/80 px-4 py-3 shadow-soft"
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    #{order.id} · {order.product?.name || 'Unknown Product'}
                  </p>
                  <p className="text-xs text-neutral-500">Quantity: {order.quantity}</p>
                </div>
                <Badge
                  variant={
                    order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'info'
                  }
                >
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  chip?: string;
  icon: ReactNode;
  tone?: 'warning' | 'accent' | 'secondary';
}

const toneMap = {
  warning: 'from-warning/20 to-warning/10 text-warning',
  accent: 'from-accent-100 to-white text-accent-600',
  secondary: 'from-secondary-100 to-white text-secondary-600',
};

const StatCard = ({ title, value, chip, icon, tone }: StatCardProps) => {
  return (
    <div className="card border-none bg-white/90 shadow-soft">
      <div
        className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
          tone ? toneMap[tone] : 'from-primary-50 to-white text-primary-700'
        }`}
      >
        {icon}
        {title}
      </div>
      <p className="mt-4 text-3xl font-semibold text-neutral-900">{value}</p>
      {chip && <p className="text-sm text-neutral-500">{chip}</p>}
    </div>
  );
};

