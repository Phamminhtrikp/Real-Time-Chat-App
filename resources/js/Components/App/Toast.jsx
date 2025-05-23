import { useEventBus } from '@/EventBus';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const Toast = ({ }) => {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on('toast.show', (message) => {
            const uuid = uuidv4();

            setToasts((oldToasts) => [...oldToasts, { message, uuid }]);

            setTimeout(() => {
                setToasts((oldToasts) => oldToasts.filter((toast) => toast.uuid !== uuid));
            }, 5000);
        })
    }, [on]);

    return (
        <div className="toast min-w-[280px]">
            {toasts.map((toast) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success px-4 py-3 rounded-lg text-gray-100"
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}

export default Toast;
