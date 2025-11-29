import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, type = 'info', onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    padding: '0',
                    marginLeft: 'auto'
                }}
            >
                ×
            </button>
        </div>
    );
};

export default Toast;
