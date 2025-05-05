import { useEventBus } from "@/EventBus";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    EllipsisVerticalIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";


const MessageOptionsDropdown = ({ message }) => {
    const { emit } = useEventBus();

    const onMessageDelete = () => {
        // Send axios post request to delete message and show notification on success
        axios
            .delete(route("message.destroy", message.id))
            .then((res) => {
                emit('message.deleted', { message, prevMessage: res.data.message });
            })
            .catch((err) => {
                console.error(err)
            });
    }

    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-y-1/2 mr-2">
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white" >
                    <EllipsisVerticalIcon className="w-4 h-4" />
                </MenuButton>

                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-28 origin-top-right rounded-xl border border-white/5 bg-black p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <MenuItem>
                        <button
                            onClick={onMessageDelete}
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    );
}

export default MessageOptionsDropdown;