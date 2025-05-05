import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { MagnifyingGlassCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useEventBus } from "@/EventBus";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState(conversations);
    const [sortedConversations, setSortedConversations] = useState([]);
    // const [localselectedConversation, setLocalselectedConversation] = useState(selectedConversation);
    const [onlineUsers, setOnlineUsers] = useState({});
    const { on } = useEventBus();


    const isUserOnline = (userId) => onlineUsers[userId];


    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    }

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                // If the message is for user
                if (
                    message.receiverId &&
                    !u.isGroup &&
                    (u.id == message.senderId || u.id == message.receiverId)
                ) {
                    u.lastMessage = message.message;
                    u.lastMessageDate = message.createdAt;
                    return u;
                }

                // If the message is for group
                if (
                    message.groupId &&
                    u.isGroup &&
                    u.id == message.groupId
                ) {
                    u.lastMessage = message.message;
                    u.lastMessageDate = message.createdAt;
                    return u;
                }
                return u;
            })
        })
    }

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);

        return () => {
            offCreated();
        }
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blockedAt && b.blockedAt) {
                    return a.blockedAt > b.blockedAt ? 1 : -1;
                } else if (a.blockedAt) {
                    return 1;
                } else if (b.blockedAt) {
                    return -1;
                }

                if (a.lastMessageDate && b.lastMessageDate) {
                    return b.lastMessageDate.localeCompare(
                        a.lastMessageDate
                    );
                } else if (a.lastMessageDate) {
                    return -1;
                } else if (b.lastMessageDate) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);


    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => {
                        return [user.id, user]
                    })
                );

                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObj };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;

                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.log('error', error);
            });

        return () => {
            Echo.leave('online');
        };
    }, []);

    return (
        <>
            <div className="flex-1 flex w-full h-screen overflow-hidden pt-3 pl-2 gap-x-2">
                <div className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden rounded-lg 
                    ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                    }`}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl text-slate-500 font-medium">
                        My Conversations
                        <div className="tooltip tooltip-left" data-tip="Create New Group">
                            <button className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>

                    <div className="px-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full"
                        />
                    </div>

                    <div className="flex-1 overflow-auto">
                        {sortedConversations && sortedConversations.map((conversation) => (
                            <ConversationItem
                                key={`${conversation.isGroup ? "group_" : "user_"}${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                                selectedConversation={selectedConversation}
                            />
                        ))}
                    </div>

                </div>

                <div className="flex-1 flex flex-col overflow-hidden pr-2 rounded-lg">
                    {children}
                </div>
            </div>
        </>
    );
}

export default ChatLayout;