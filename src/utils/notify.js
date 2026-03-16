import { toast } from 'sonner';

export const notify = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      ...options
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 4000,
      ...options
    });
  },

  info: (message, options = {}) => {
    toast.info(message, {
      duration: 3000,
      ...options
    });
  },

  warning: (message, options = {}) => {
    toast.warning(message, {
      duration: 4000,
      ...options
    });
  },

  message: (message, options = {}) => {
    toast(message, {
      duration: 3000,
      ...options
    });
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, {
      loading: messages.loading || '加载中...',
      success: messages.success || '操作成功',
      error: messages.error || '操作失败',
      ...options
    });
  }
};

export { toast };

export default notify;