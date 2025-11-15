import toast, { Toaster } from 'react-hot-toast';

// Custom toast styles matching Coreum theme
const toastStyles = {
  style: {
    background: '#0e141d',
    color: '#fff',
    border: '1px solid #25D695',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  iconTheme: {
    primary: '#25D695',
    secondary: '#0e141d',
  },
};

// Success toast
export const showSuccess = (message: string) => {
  return toast.success(message, {
    ...toastStyles,
    duration: 3000,
    icon: '✅',
  });
};

// Error toast
export const showError = (message: string) => {
  return toast.error(message, {
    ...toastStyles,
    duration: 4000,
    icon: '❌',
    style: {
      ...toastStyles.style,
      border: '1px solid #ff6b6b',
    },
  });
};

// Info toast
export const showInfo = (message: string) => {
  return toast(message, {
    ...toastStyles,
    duration: 3000,
    icon: 'ℹ️',
    style: {
      ...toastStyles.style,
      border: '1px solid #4a9eff',
    },
  });
};

// Warning toast
export const showWarning = (message: string) => {
  return toast(message, {
    ...toastStyles,
    duration: 3500,
    icon: '⚠️',
    style: {
      ...toastStyles.style,
      border: '1px solid #ffd700',
    },
  });
};

// Loading toast
export const showLoading = (message: string) => {
  return toast.loading(message, {
    ...toastStyles,
  });
};

// Custom toast with custom icon
export const showCustom = (message: string, icon: string) => {
  return toast(message, {
    ...toastStyles,
    duration: 3000,
    icon,
  });
};

// Dismiss a specific toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Promise toast for async operations
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    toastStyles
  );
};

// Game-specific toasts
export const gameToasts = {
  betPlaced: (amount: number) =>
    showSuccess(`Bet placed: ${amount} COREUM`),

  betWon: (amount: number, multiplier: number) =>
    showSuccess(`🎉 You won ${amount} COREUM! (${multiplier}x)`),

  betLost: () =>
    showError('Better luck next time!'),

  insufficientBalance: () =>
    showWarning('Insufficient balance. Please deposit COREUM.'),

  gameStarting: (seconds: number) =>
    showInfo(`Game starting in ${seconds} seconds...`),

  cashout: (amount: number) =>
    showSuccess(`💰 Cashed out: ${amount} COREUM`),

  connectionLost: () =>
    showError('Connection lost. Reconnecting...'),

  connectionRestored: () =>
    showSuccess('Connection restored!'),
};

export { Toaster };
export default toast;
