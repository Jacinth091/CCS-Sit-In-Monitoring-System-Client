import { AlertTriangle, Loader2, Trash2, ShieldAlert } from 'lucide-react';

const VARIANT_CONFIG = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-50 border-red-100',
    iconColor: 'text-red-500',
    confirmClass: 'bg-red-500 hover:bg-red-600 text-white',
    confirmDefault: 'Yes, Delete',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-500',
    confirmClass: 'bg-amber-500 hover:bg-amber-600 text-white',
    confirmDefault: 'Yes, Continue',
  },
  info: {
    icon: ShieldAlert,
    iconBg: 'bg-primary/5 border-primary/10',
    iconColor: 'text-primary',
    confirmClass: 'bg-primary hover:bg-primary-hover text-white',
    confirmDefault: 'Confirm',
  },
};

/**
 * ConfirmModal — a styled replacement for window.confirm().
 *
 * Props:
 *  isOpen      boolean
 *  onClose     () => void          — called on "Cancel"
 *  onConfirm   () => void          — called on "Confirm"
 *  title       string
 *  message     string | ReactNode
 *  confirmText string              (optional, overrides variant default)
 *  cancelText  string              (optional, default "Cancel")
 *  variant     "danger" | "warning" | "info"   (default "danger")
 *  isLoading   boolean             (optional)
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) {
  if (!isOpen) return null;

  const cfg = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.danger;
  const Icon = cfg.icon;
  const finalConfirmText = confirmText ?? cfg.confirmDefault;

  return (
    <div
      className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="alertdialog"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border animate-fade-in-up overflow-hidden">

        {/* ── Body ── */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border ${cfg.iconBg}`}>
            <Icon className={`h-8 w-8 ${cfg.iconColor}`} />
          </div>

          <h3
            id="confirm-modal-title"
            className="text-xl font-black text-primary tracking-tight mb-3"
          >
            {title}
          </h3>

          <p
            id="confirm-modal-message"
            className="text-sm font-medium text-primary-light leading-relaxed max-w-xs"
          >
            {message}
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-bg-secondary border border-border text-sm font-bold text-primary hover:bg-border transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 ${cfg.confirmClass}`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              finalConfirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
