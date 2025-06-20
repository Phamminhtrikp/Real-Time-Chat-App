import AttachmentPreviewModal from '@/Components/App/AttachmentPreviewModal';
import ConversationHeader from '@/Components/App/ConverstationHeader';
import MessageInput from '@/Components/App/MessageInput';
import MessageItem from '@/Components/App/MessageItem';
import { useEventBus } from '@/eventBus';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

function Home({ messages = null, selectedConversation = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const loadMoreIntersect = useRef(null);
    const messagesCtrRef = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});

    const { on } = useEventBus();

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.isGroup &&
            selectedConversation.id == message.groupId
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }

        if (
            selectedConversation &&
            selectedConversation.isUser && (
                selectedConversation.id == message.senderId ||
                selectedConversation.id == message.receiverId)
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }

    }

    const messageDeleted = ({ message }) => {
        if (
            selectedConversation &&
            selectedConversation.isGroup &&
            selectedConversation.id == message.groupId
        ) {
            setLocalMessages((prevMessages) => {
                return prevMessages.filter((m) => m.id !== message.id);
            });
        }

        if (
            selectedConversation &&
            selectedConversation.isUser && (
                selectedConversation.id == message.senderId ||
                selectedConversation.id == message.receiverId)
        ) {
            setLocalMessages((prevMessages) => {
                return prevMessages.filter((m) => m.id !== message.id);
            });
        }
    };

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages) {
            return;
        }

        // Find the first message object
        const firstMessage = localMessages[0];
        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }
                // Calculate how much is scrolled from bottom and scroll to the same position from bottom after messages are loaded
                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;
                setScrollFromBottom(tmpScrollFromBottom);

                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(), ...prevMessages];
                })
            });
    }, [localMessages, noMoreMessages]);


    const onAttachmentClick = (attachments, ind) => {
        setPreviewAttachment({
            attachments,
            ind,
        });
        setShowAttachmentPreview(true);
    }

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
            offDeleted();
        }

    }, [selectedConversation]);


    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        // Recover scroll from bottom after messages are loaded
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );

        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100);
        }

        return () => {
            observer.disconnect();
        }

    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className='w-32 h-32 inline-block' />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {/* Messagses  */}


                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No Messages Found!
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex flex-1 flex-col">
                                <div ref={loadMoreIntersect}>{loadMoreIntersect && <span className='loading loading-snipper'></span>}</div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <MessageInput conversation={selectedConversation} />
                </>
            )}

            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user} >
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
}


export default Home;
