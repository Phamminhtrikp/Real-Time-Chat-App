import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition
} from "@headlessui/react";
import {
    EllipsisVerticalIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    UserIcon
} from "@heroicons/react/24/solid";
import axios from "axios";
// import { Fragment } from "react";



const UserOptionsDropdown = ({ conversation }) => {
    const changeUserRole = () => {
        console.log("Change user role");
        if (!conversation.isUser) {
            return;
        }

        // Send axios post request to change user role and show notification on succcess
        axios
            .post(route("user.changeRole", conversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onBlockUser = () => {
        console.log("Block User");
        if (!conversation.isUser) {
            return;
        }

        // Send axios post request to block user and show notification on success
        axios
            .post(route("user.blockUnblock", conversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <div className="text-right">
            <Menu>

                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white" >
                    <EllipsisVerticalIcon className="w-4 h-4" />
                </MenuButton>

                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-40 origin-top-right rounded-xl border border-white/5 bg-black p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <MenuItem>
                        <button
                            onClick={onBlockUser}
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                        >
                            {conversation.blockedAt && (
                                <>
                                    <LockOpenIcon className="size-4 fill-white/30" />
                                    Unlock User
                                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd>
                                </>
                            )}

                            {!conversation.blockedAt && (
                                <>
                                    <LockClosedIcon className="w-4 h-4 mr-2" />
                                    Block User
                                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd>
                                </>
                            )}
                        </button>
                    </MenuItem>

                    <MenuItem>
                        <button
                            onClick={changeUserRole}
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                        >
                            {conversation.isAdmin && (
                                <>
                                    <UserIcon className="w-4 h-4 mr-2 " />
                                    Make Regular User
                                </>
                            )}

                            {!conversation.isAdmin && (
                                <>
                                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                    Make Admin
                                </>
                            )}
                        </button>
                    </MenuItem>


                </MenuItems>

            </Menu>
        </div>
    );
}

export default UserOptionsDropdown;