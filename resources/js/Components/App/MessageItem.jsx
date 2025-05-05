import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React from 'react';
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "./MessageAttachments";

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;


    return (
        <div
            className={
                "chat " +
                (message.senderId === currentUser.id
                    ? "chat-end"
                    : "chat-start"
                )
            }
        >
            {<UserAvatar user={message.sender} />}

            <div className="chat-header dark:text-gray-300">
                {message.senderId !== currentUser.id
                    ? message.sender.name
                    : ""
                }
                <time className="text-xs opacity-50 ml-2 ">
                    {formatMessageDateLong(message.createdAt)}
                </time>
            </div>

            <div
                className={
                    "chat-bubble relative " +
                    (message.senderId === currentUser.id
                        ? " chat-bubble-info"
                        : ""
                    )
                }
            >
                <div className="chat-message">
                    <div className="chat-message-content">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                    <MessageAttachments
                        attachments={message.attachments}
                        attachmentClick={attachmentClick}
                    />
                </div>
            </div>

        </div>
    );
}

export default MessageItem;