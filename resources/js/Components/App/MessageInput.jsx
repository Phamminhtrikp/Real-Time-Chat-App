import { useState } from "react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    XCircleIcon
} from "@heroicons/react/24/solid";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { isAudio, isImage } from "@/helpers";
import AttachmentPreview from "./AttachmentPreview";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { v4 as uuidv4 } from 'uuid';

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onFileChange = (ev) => {
        const files = ev.target.files;

        const updatedFiles = [...files].map((file) => {
            return {
                id: uuidv4(),
                file: file,
                url: URL.createObjectURL(file),
            };
        });

        ev.target.value = null;

        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
    }

    const onSendClick = () => {
        if (messageSending) {
            return;
        }

        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage("Please enter your message or upload attachments!");

            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }
        // if(conversation.isUser) {
        //     console.log(">> uid: ", conversation.id)
        // }
        // if (conversation.isGroup) {
        //     console.log(">> group_id", conversation.id);
        // }

        const formData = new FormData();
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
        formData.append("message", newMessage);
        if (conversation.isUser) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.isGroup) {
            formData.append("group_id", conversation.id);
        }

        setMessageSending(true);
        axios.post(route("message.store"), formData, {
            onUploadProgress: (ProgressEvent) => {
                const progress = Math.round(
                    (ProgressEvent.loaded / ProgressEvent.total) * 100
                );
                console.log(">> progress: ", progress);
                setUploadProgress(progress);
            }
        })
            .then((res) => {
                setNewMessage("");
                setMessageSending(false);
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((err) => {
                setMessageSending(false);
                setChosenFiles([]);
                const message = err?.res?.data?.message;
                setInputErrorMessage(
                    message || "An error occured while sending message"
                );
            })
    }

    const onLikeClick = () => {
        if (messageSending) {
            return;
        }

        const data = {
            message: "👍",
        };

        if (conversation.isUser) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.isGroup) {
            data["group_id"] = conversation.id;
        }

        axios.post(route("message.store"), data);
    };


    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        onChange={onFileChange}
                        className="absolute w-8 h-8 left-0 top-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute w-8 h-8 left-0 top-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSendClick}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        onClick={onSendClick}
                        className="btn btn-info rounded-l-none"
                    >
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}

                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sr-only sm:inline">Send</span>
                    </button>
                </div>
                {" "}
                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max="100"
                    ></progress>
                )}
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file) => (
                        <div
                            key={file.id}
                            className={
                                `relative flex justify-between cursor-pointer` +
                                (!isImage(file.file) ? " w-[240px]" : "")
                            }
                        >
                            {isImage(file.file) && (
                                <img
                                    src={file.url} 
                                    alt="" 
                                    className="w-16 h-16 object-cover" 
                                />
                            )}
                            {isAudio(file.file) && (
                                <CustomAudioPlayer
                                    file={file}
                                    showVolume={false}
                                />
                                // <audio src={file.url} controls></audio>
                            )}
                            {!isAudio(file.file) && !isImage(file.file) && (
                                <AttachmentPreview file={file} />
                            )}

                            <button
                                onClick={() => 
                                    setChosenFiles(
                                        chosenFiles.filter((f) => f.id !== file.id)
                                    )
                                }
                                className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10"
                            >
                                <XCircleIcon className="w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-3 xs:order-3 flex p-2">
                <Popover className="relative">
                    <PopoverButton className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6 h6" />
                    </PopoverButton>
                    <PopoverPanel className="absolute z-10 right-0 bottom-full" >
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(ev) =>
                                setNewMessage(newMessage + ev.emoji)
                            }
                        >

                        </EmojiPicker>
                    </PopoverPanel>
                </Popover>
                <button onClick={onLikeClick} className="p-1 text-gray-400 hover:text-gray-300">
                    <HandThumbUpIcon className="w-6 h6" />
                </button>
            </div>
        </div>
    );
}

export default MessageInput;