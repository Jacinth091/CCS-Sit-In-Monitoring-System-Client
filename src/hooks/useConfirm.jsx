import { useState, useCallback } from 'react';
import ConfirmModal from '../components/modals/ConfirmModal';

/**
 * useConfirm — imperative wrapper around ConfirmModal.
 *
 * Usage:
 *   const { confirm, ConfirmModalUI } = useConfirm();
 *
 *   // In JSX somewhere near the root of your component:
 *   {ConfirmModalUI}
 *
 *   // In a handler:
 *   const ok = await confirm({
 *     title: 'Delete Item',
 *     message: 'This cannot be undone.',
 *     variant: 'danger',
 *     confirmText: 'Yes, Delete',
 *   });
 *   if (!ok) return;
 *   // ... do the thing
 */
export function useConfirm() {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
    confirmText: undefined,
    cancelText: 'Cancel',
    resolve: null,
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title ?? 'Are you sure?',
        message: options.message ?? 'This action cannot be undone.',
        variant: options.variant ?? 'danger',
        confirmText: options.confirmText,
        cancelText: options.cancelText ?? 'Cancel',
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((s) => ({ ...s, isOpen: false, resolve: null }));
  }, [state]);

  const handleClose = useCallback(() => {
    state.resolve?.(false);
    setState((s) => ({ ...s, isOpen: false, resolve: null }));
  }, [state]);

  const ConfirmModalUI = (
    <ConfirmModal
      isOpen={state.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={state.title}
      message={state.message}
      variant={state.variant}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
    />
  );

  return { confirm, ConfirmModalUI };
}
