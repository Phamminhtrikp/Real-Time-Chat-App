import { UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";

const GroupAvatar = ({ }) => {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div className={`bg-gray-400 text-gray-700 dark:text-gray-300 rounded-full w-8`}>
                    <span className="text-xl">
                        <UserGroupIcon className="w-4" />
                    </span>
                </div>
            </div>
        </>
    );
}

export default GroupAvatar;