import { useEventBus } from '@/EventBus';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import UserAvatar from './UserAvatar';
import { Link } from '@inertiajs/react';

const NewMessageNotification = ({ }) => {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on('newMessageNotification', ({ message, user, groupId }) => {
            const uuid = uuidv4();

            setToasts((oldToasts) => [...oldToasts, { message, uuid, user, groupId }]);

            setTimeout(() => {
                setToasts((oldToasts) => oldToasts.filter((toast) => toast.uuid !== uuid));
            }, 5000);
        })
    }, [on]);

    return (
        <div className="toast toast-top toast-center min-w-[280px]">
            {toasts.map((toast) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success px-4 py-3 rounded-lg text-gray-100"
                >
                    <Link
                        href={toast.groupId
                            ? route("chat.group", toast.groupId)
                            : route("chat.user", toast.user.id)
                        }
                        className="flex items-center gap-2"
                    >
                        <UserAvatar user={toast.user} />
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default NewMessageNotification;
