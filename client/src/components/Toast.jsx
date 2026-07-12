import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: 'rgba(18, 18, 26, 0.95)',
        color: '#f1f1f1',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '12px 16px',
      },
      success: {
        iconTheme: { primary: '#22c55e', secondary: '#0a0a0f' },
      },
      error: {
        iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' },
      },
    }}
  />
);

export default Toast;
