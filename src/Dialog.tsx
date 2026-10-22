import { useEffect, type FormEvent, type MouseEvent, type ReactNode } from 'react';

type DialogProps = {
  label: string;
  className: string;
  onClose: () => void;
  /** When given, the dialog is a <form>. */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

/** Bottom sheet on the phone, centered modal on the desktop (see styles.css). */
export function Dialog({ label, className, onClose, onSubmit, children }: DialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const closeOnBackdrop = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const cls = `dialog ${className}`;
  return (
    <div className="overlay" onMouseDown={closeOnBackdrop}>
      {onSubmit ? (
        <form role="dialog" aria-modal="true" aria-label={label} className={cls} onSubmit={onSubmit} noValidate>
          {children}
        </form>
      ) : (
        <section role="dialog" aria-modal="true" aria-label={label} className={cls}>
          {children}
        </section>
      )}
    </div>
  );
}
