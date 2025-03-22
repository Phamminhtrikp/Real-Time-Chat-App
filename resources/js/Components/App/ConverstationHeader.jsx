import { usePage, Link } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";


const ConversationHeader = ({ selectedConversation }) => {
    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('dashboard')}
                            className="inline-block sm:hidden dark:text-gray-300"
                        >
                            <ChevronLeftIcon className="w-6" />
                        </Link>

                        {selectedConversation.isUser && (
                            <UserAvatar user={selectedConversation} />
                        )}

                        {selectedConversation.isGroup && <GroupAvatar /> }

                        <div className="text-gray-700 dark:text-gray-300">
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.isGroup && (
                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConversationHeader;

