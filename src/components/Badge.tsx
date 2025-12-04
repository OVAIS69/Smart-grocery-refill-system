import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-dark-700/80 text-primary-300 border border-primary-500/30',
  success: 'bg-primary-500/20 text-primary-400 border border-primary-500/40',
  warning: 'bg-warning/20 text-warning border border-warning/40',
  danger: 'bg-danger/20 text-danger border border-danger/40',
  info: 'bg-accent-500/20 text-accent-400 border border-accent-500/40',
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm',
        variantStyles[variant],
        variant === 'success' && 'shadow-glow-green-sm',
        className
      )}
    >
      {children}
    </span>
  );
};

