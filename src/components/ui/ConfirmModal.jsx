import React from 'react';
import { AlertTriangle, HelpCircle, CheckCircle, X } from 'lucide-react';

const ICONS = {
  confirm: HelpCircle,
  warning: AlertTriangle,
  success: CheckCircle
};

const COLORS = {
  confirm: 'text-blue-500 bg-blue-100',
  warning: 'text-amber-500 bg-amber-100',
  success: 'text-green-500 bg-green-100'
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'confirm'
}) {
  if (!isOpen) return null;

  const Icon = ICONS[type] || HelpCircle;
  const iconColor = COLORS[type] || COLORS.confirm;

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in-up">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-bounce-in">
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div className="p-6 text-center">
          <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${iconColor}`}>
            <Icon className="w-7 h-7" />
          </div>

          {title && (
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
          )}
          
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        <div className="flex border-t border-slate-100">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 text-slate-500 font-medium hover:bg-slate-50 transition border-r border-slate-100"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 text-indigo-600 font-bold hover:bg-indigo-50 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export function useConfirmModal() {
  const [state, setState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
    type: 'confirm',
    resolver: null
  });

  const show = React.useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title || '',
        message,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        type: options.type || 'confirm',
        resolver: resolve
      });
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    state.resolver?.(true);
    setState(prev => ({ ...prev, isOpen: false }));
  }, [state.resolver]);

  const handleCancel = React.useCallback(() => {
    state.resolver?.(false);
    setState(prev => ({ ...prev, isOpen: false }));
  }, [state.resolver]);

  const modal = React.useMemo(() => (
    <ConfirmModal
      isOpen={state.isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      type={state.type}
    />
  ), [state, handleConfirm, handleCancel]);

  return { show, modal };
}

export default ConfirmModal;