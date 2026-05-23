import { useState, useCallback } from 'react';
import AlertModal from '../components/modals/AlertModal';

/**
 * useAlert — imperative wrapper around AlertModal.
 * 
 * Usage:
 *   const { alert, AlertModalUI } = useAlert();
 * 
 *   // In JSX:
 *   {AlertModalUI}
 * 
 *   // In handler:
 *   await alert({
 *     title: 'Success!',
 *     message: 'Your profile has been updated.',
 *     variant: 'success'
 *   });
 */
export function useAlert() {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
    buttonText: 'Understood',
    resolve: null,
  });

  const alert = useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title ?? 'Attention',
        message: options.message ?? '',
        variant: options.variant ?? 'info',
        buttonText: options.buttonText ?? 'Understood',
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    state.resolve?.();
    setState((s) => ({ ...s, isOpen: false, resolve: null }));
  }, [state]);

  const AlertModalUI = (
    <AlertModal
      isOpen={state.isOpen}
      onClose={handleClose}
      title={state.title}
      message={state.message}
      variant={state.variant}
      buttonText={state.buttonText}
    />
  );

  return { alert, AlertModalUI };
}
