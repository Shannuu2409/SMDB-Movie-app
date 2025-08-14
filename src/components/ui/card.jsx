import clsx from 'clsx'

export function Card({ className = '', ...props }) {
  return (
    <div className={clsx('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props} />
  );
}


