interface AlertBannerProps {
  variant: 'success' | 'error';
  children: React.ReactNode;
  onDismiss?: () => void;
}

export function AlertBanner({ variant, children, onDismiss }: AlertBannerProps) {
  const styles =
    variant === 'success'
      ? 'border-l-4 border-masthead bg-masthead/5 text-masthead'
      : 'border-l-4 border-wire bg-wire/5 text-wire';

  return (
    <div className={`flex items-start justify-between gap-3 rounded-sm px-4 py-3 text-sm ${styles}`}>
      <span>{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="text-current opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
