import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { formatRelativeTime } from '@/utils';
import { useToast } from '@/contexts/useToast';
import { BellIcon } from '@heroicons/react/24/outline';

export const Notifications = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const { success } = useToast();

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const handleMarkRead = async (id: number) => {
    try {
      await markRead.mutateAsync(id);
      success('Notification marked as read');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync();
      success('All notifications marked as read');
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary">
            Mark all as read
          </button>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="card text-center py-12">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => !notification.read && handleMarkRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                    {!notification.read && <Badge variant="info">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatRelativeTime(notification.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

