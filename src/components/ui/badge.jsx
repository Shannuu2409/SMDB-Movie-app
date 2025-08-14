import clsx from 'clsx'

const base = 'inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold';

const variants = {
  default: 'bg-muted text-foreground border-transparent',
  secondary: 'bg-secondary text-secondary-foreground border-transparent',
  outline: 'text-foreground',
};

export function Badge({ className = '', variant = 'default', ...props }) {
  return (
    <span className={clsx(base, variants[variant], className)} {...props} />
  );
}


