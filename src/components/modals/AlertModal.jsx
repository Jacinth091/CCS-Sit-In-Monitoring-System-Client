import { AlertCircle, Info, ShieldAlert, CheckCircle, X } from 'lucide-react';

const VARIANT_CONFIG = {
  info: {
    icon: Info,
    iconBg: 'bg-primary/5 border-primary/10',
    iconColor: 'text-primary',
    buttonClass: 'bg-primary hover:bg-primary-hover text-white',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-500',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  warning: {
    icon: AlertCircle,
    iconBg: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-500',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  error: {
    icon: ShieldAlert,
    iconBg: 'bg-red-50 border-red-100',
    iconColor: 'text-red-500',
    buttonClass: 'bg-red-500 hover:bg-red-600 text-white',
  },
};

/**
 * AlertModal — a styled replacement for window.alert().
 * 
 * Props:
 *  isOpen      boolean
 *  onClose     () => void
 *  title       string
 *  message     string | ReactNode
 *  buttonText  string (optional, default "Understood")
 *  variant     "info" | "success" | "warning" | "error" (default "info")
 */
export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Understood',
  variant = 'info',
}) {
  if (!isOpen) return null;

  const cfg = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <div
      className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="alertdialog"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-border animate-fade-in-up overflow-hidden relative">
        
        {/* Close Button (Optional top right) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-primary-light/40 hover:text-primary hover:bg-bg-secondary transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── Body ── */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border ${cfg.iconBg}`}>
            <Icon className={`h-8 w-8 ${cfg.iconColor}`} />
          </div>

          <h3 className="text-xl font-black text-primary tracking-tight mb-3">
            {title}
          </h3>

          <p className="text-sm font-medium text-primary-light leading-relaxed max-w-xs">
            {message}
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="px-8 pb-8">
          <button
            onClick={onClose}
            className={`w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-md transition-all active:scale-[0.98] ${cfg.buttonClass}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
