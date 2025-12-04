import { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/FormFields';
import { Loading } from '@/components/Loading';
import { formatDate } from '@/utils';
import { formatCurrency } from '@/utils/currency';
import { useToast } from '@/contexts/useToast';
import type { Order } from '@/types';
import { getErrorMessage } from '@/utils';

export const Orders = () => {
  const { user, hasRole } = useAuthStore();
  const { success, error: showError } = useToast();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | ''>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data, isLoading, refetch } = useOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
    supplierId: user?.role === 'supplier' ? user.id : undefined,
  });

  const updateStatus = useUpdateOrderStatus();

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (!selectedOrder) return;
    try {
      await updateStatus.mutateAsync({ id: selectedOrder.id, status: newStatus });
      success('Order status updated successfully');
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to update order status'));
    }
  };

  const handlePaymentUpdate = async (paymentStatus: Order['paymentStatus']) => {
    if (!selectedOrder) return;
    try {
      await updateStatus.mutateAsync({ 
        id: selectedOrder.id, 
        paymentStatus: paymentStatus as 'paid' | 'unpaid' | 'partial'
      });
      success('Payment status updated successfully');
      setIsPaymentModalOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (error) {
      showError(getErrorMessage(error, 'Failed to update payment status'));
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: (row: Order) => `#${row.id}`,
    },
    {
      header: 'Product',
      accessor: (row: Order) => row.product?.name || 'Unknown',
    },
    {
      header: 'Quantity',
      accessor: 'quantity' as keyof Order,
    },
    {
      header: 'Status',
      accessor: (row: Order) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>,
    },
    {
      header: 'Payment',
      accessor: (row: Order) => (
        <div className="flex items-center gap-2">
          <Badge
            variant={
              row.paymentStatus === 'paid'
                ? 'success'
                : row.paymentStatus === 'unpaid'
                ? 'danger'
                : 'warning'
            }
          >
            {row.paymentStatus || 'unpaid'}
          </Badge>
          {hasRole(['admin', 'supplier']) && row.paymentStatus !== 'paid' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrder(row);
                setIsPaymentModalOpen(true);
              }}
              className="text-xs text-primary-600 hover:text-primary-700 underline"
            >
              Update
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: Order) => (
        <span className="font-semibold text-neutral-900">
          {row.totalAmount ? `$${row.totalAmount.toFixed(2)}` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Requested By',
      accessor: (row: Order) => row.requestedByUser?.name || 'N/A',
    },
    {
      header: 'Date',
      accessor: (row: Order) => formatDate(row.createdAt),
    },
    ...(hasRole(['supplier', 'admin'])
      ? [
          {
            header: 'Actions',
            accessor: (row: Order) => (
              <button
                onClick={() => {
                  setSelectedOrder(row);
                  setIsStatusModalOpen(true);
                }}
                className="btn btn-secondary text-sm"
                disabled={row.status === 'delivered' || row.status === 'cancelled'}
              >
                Update Status
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Fulfilment</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Order lifecycle control</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Track supplier SLAs, update statuses, and surface blockers before they impact shelves.
          </p>
        </div>
        <Select
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as Order['status'] | '');
            setPage(1);
          }}
          className="w-52"
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard label="Open orders" value={data?.data.filter((o) => o.status !== 'delivered').length || 0} />
            <SummaryCard label="Deliveries today" value={data?.data.filter((o) => o.status === 'delivered').length || 0} tone="success" />
            <SummaryCard label="Supplier touchpoints" value={data?.data.length || 0} tone="accent" />
          </div>
          <div className="card">
            <Table
              columns={columns}
              data={data?.data || []}
              emptyMessage="No orders found"
              onRowClick={(order) => {
                setSelectedOrder(order as Order);
                setIsStatusModalOpen(true);
              }}
            />
          </div>

          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              totalItems={data.total}
              itemsPerPage={10}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Update Order Status"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
              <p className="text-sm text-neutral-500">Order #{selectedOrder.id}</p>
              <p className="text-lg font-semibold text-neutral-900">{selectedOrder.product?.name}</p>
              <p className="text-xs text-neutral-400">Requested on {formatDate(selectedOrder.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">Select new status</p>
              <div className="grid grid-cols-2 gap-3">
                {(['pending', 'confirmed', 'shipped', 'delivered'] as Order['status'][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={
                      updateStatus.isPending ||
                      status === selectedOrder.status ||
                      (selectedOrder.status === 'delivered' && status !== 'delivered')
                    }
                    className="btn btn-secondary text-sm disabled:opacity-50"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Update Payment Status"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
              <p className="text-sm text-neutral-500">Order #{selectedOrder.id}</p>
              <p className="text-lg font-semibold text-neutral-900">{selectedOrder.product?.name}</p>
              <p className="text-sm text-neutral-600 mt-2">
                Amount: <span className="font-semibold">{formatCurrency(selectedOrder.totalAmount || 0)}</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">Select payment status</p>
              <div className="grid grid-cols-3 gap-3">
                {(['unpaid', 'partial', 'paid'] as Order['paymentStatus'][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handlePaymentUpdate(status)}
                    disabled={
                      updateStatus.isPending ||
                      status === selectedOrder.paymentStatus
                    }
                    className="btn btn-secondary text-sm disabled:opacity-50"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const SummaryCard = ({ label, value, tone }: { label: string; value: number; tone?: 'success' | 'accent' }) => {
  const toneClass =
    tone === 'success'
      ? 'from-success/20 to-white text-success'
      : tone === 'accent'
      ? 'from-accent-100 to-white text-accent-600'
      : 'from-primary-50 to-white text-primary-700';

  return (
    <div className="rounded-2xl border border-white/60 bg-gradient-to-r p-5 shadow-soft">
      <p className={`text-xs font-semibold uppercase tracking-wide ${toneClass}`}>{label}</p>
      <p className="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
};

