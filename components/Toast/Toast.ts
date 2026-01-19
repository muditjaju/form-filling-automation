import toast from 'react-hot-toast';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'loading';
}

export const Toast = {
  createNewToast: ({ message, type }: ToastProps) => {
    switch (type) {
      case 'success':
        return toast.success(message);
      case 'error':
        return toast.error(message);
      case 'loading':
        return toast.loading(message);
      default:
        return toast(message);
    }
  },
};
