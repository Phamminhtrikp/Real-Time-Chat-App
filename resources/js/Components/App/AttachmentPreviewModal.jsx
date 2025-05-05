import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useMemo, useState } from 'react'

const AttachmentPreviewModal = ({ attachments, index, show = false, onClose = () => { } }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const previewableAttachments = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }, [attachments]);

    const attachment = useMemo(() => {
        return previewableAttachments[currentIndex];
    }, [attachments, currentIndex]);

    const close = () => {
        onClose();
    };

    const prev = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex(currentIndex - 1);
    };

    const next = () => {
        if (currentIndex === previewableAttachments.length - 1) {
            return;
        }
        setCurrentIndex(currentIndex + 1);
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);


    return (
        <Dialog
            as="div"
            id="modal"
            className="relative z-50"
            open={show}
            onClose={close}
        >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex h-full items-center justify-center p-4">
                    <DialogPanel
                        className="flex flex-col w-full h-full transform overflow-hidden rounded-xl bg-slate-800 
                        p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] 
                        data-closed:opacity-0"
                        transition
                    >
                        <button
                            className="absolute right-3 top-3 w-8 h-8 rounded-full bg-gray-400 hover:bg-slate-700 transition
                            flex items-center justify-center text-gray-100 z-40"
                            onClick={close}
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <div className="relative group h-full ">
                            {currentIndex > 0 && (
                                <div
                                    className="absolute opacity-100 text-gray-100 cursor-pointer
                                    flex items-center justify-center w-16 h-16 left-4 top-1/2 -translate-y-1/2
                                    rounded-full bg-black/50 z-30"
                                    onClick={prev}
                                >
                                    <ChevronLeftIcon className="w-12" />
                                </div>
                            )}

                            {currentIndex < previewableAttachments.length - 1 && (
                                <div
                                    className="absolute opacity-100 text-gray-100 cursor-pointer
                                    flex items-center justify-center w-16 h-16 right-4 top-1/2 -translate-y-1/2
                                    rounded-full bg-black/50 z-30"
                                    onClick={next}
                                >
                                    <ChevronRightIcon className="w-12" />
                                </div>
                            )}

                            {attachment && (
                                <div className="flex items-center justify-center w-full h-full p-3">
                                    {isImage(attachment) && (
                                        <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            className="max-w-full max-h-full"
                                        />
                                    )}

                                    {isVideo(attachment) && (
                                        <div className="flex items-center">
                                            <video
                                                src={attachment.url}
                                                controls
                                                autoPlay
                                            ></video>
                                        </div>
                                    )}

                                    {isAudio(attachment) && (
                                        <div className="relative flex justify-center items-center">
                                            <audio
                                                src={attachment.url}
                                                controls
                                                autoPlay
                                            ></audio>
                                        </div>
                                    )}

                                    {isPDF(attachment) && (
                                        <iframe
                                            src={attachment.url}
                                            className="w-full h-full"
                                        ></iframe>
                                    )}

                                    {!isPreviewable(attachment) && (
                                        <div className="p-32 flex flex-col justify-center items-center text-gray-100">
                                            <PaperClipIcon className="w-10 h-10 mb-3" />

                                            <small>{attachment.name}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default AttachmentPreviewModal
