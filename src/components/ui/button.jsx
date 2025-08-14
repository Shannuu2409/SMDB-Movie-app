import clsx from 'clsx'

const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none h-9 px-4 py-2';

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
};

export function Button({ className = '', variant = 'default', size = 'md', ...props }) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
}


