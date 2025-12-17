import { createContext, useContext, useState, useRef } from 'react';
import Toast from '../component/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = `${Date.now()}-${toastCounter.current++}`;
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div style={{ 
        position: 'fixed', 
        bottom: '24px', 
        right: '24px',
        left: 'auto',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '12px',
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 48px)'
      }}>
        {toasts.map((toast, index) => (
          <div 
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              transform: `translateY(${index * -8}px)`
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={null}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
