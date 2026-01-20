import toast from 'react-hot-toast';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'loading';
  id?: string;
}

export const Toast = {
  createNewToast: ({ message, type, id }: ToastProps) => {
    switch (type) {
      case 'success':
        return toast.success(message, { id });
      case 'error':
        return toast.error(message, { id });
      case 'loading':
        return toast.loading(message, { id });
      default:
        return toast(message, { id });
    }
  },
};
