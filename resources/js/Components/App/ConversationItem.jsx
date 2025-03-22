import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formatMessageDateLong, formatMessageDateShort } from "@/helpers";


const ConversationItem = ({ conversation, selectedConversation = null, online = null }) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = " border-transparent";
    if(selectedConversation) {
        if(
            !selectedConversation.isGroup && 
            !conversation.isGroup && 
            selectedConversation.id == conversation.id
        ) {
            classes = " border-blue-500 bg-black/20"
        }

        if(
            selectedConversation.isGroup && 
            conversation.isGroup && 
            selectedConversation.id == conversation.id
        ) {
            classes = " border-blue-500 bg-black/20"
        }
    }


    return (
        <Link
            href={
                conversation.isGroup ? route("chat.group", conversation) : route("chat.user", conversation)
            }
            preserveState
            className={
                "conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-1-4 hover:bg-black/30 "
                + classes + 
                (conversation.isUser && currentUser.is_admin ? " pr-2" : " pr-4")
            }
        >
            { conversation.isUser && (
                <UserAvatar user={conversation} online={online} />
            )}

            {conversation.isGroup && ( <GroupAvatar /> )}

            <div
                className={
                    `flex-1 text-xs max-w-full overflow-hidden ` + 
                    (conversation.isUser && conversation.blockedAt
                        ? " opacity-50"
                        : ""
                    )
                }
            >
                <div className="flex gap-1 justify-between items-center">
                    <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {conversation.name}
                    </h3>
                    {conversation.lastMessageDate && (
                        <span className="text-nowrap">
                            {formatMessageDateShort(conversation.lastMessageDate)}
                        </span>
                    )}
                </div>
                {conversation.lastMessage && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
                        {conversation.lastMessage}
                    </p>
                )}
            </div>

            {currentUser.is_admin && conversation.isUser && (
                <UserOptionsDropdown conversation={conversation} />
            ) || null}
        </Link>
    );
} 

export default ConversationItem;