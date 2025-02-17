import { useState, useRef } from 'react';

const Modal = ({ rowData, onClose }) => {
    const contractLinkRef = useRef(null);
    const [isAttachmentModalVisible, setAttachmentModalVisible] = useState(false);
    console.log("id is ")
    console.log(rowData)

    if (!rowData) return null;

    // Function to open the contract link in a new tab
    const handleOpenContractLink = () => {
        const link = contractLinkRef.current.value;
        if (link) {
            window.open(link, '_blank');
        } else {
            alert("Contract link is empty!");
        }
    };

    // Function to toggle attachment modal
    const handleOpenAttachment = () => {
        setAttachmentModalVisible(true);
    };

    const handleCloseAttachment = () => {
        setAttachmentModalVisible(false);
    };
    const url = `${import.meta.env.VITE_REACT_APP_BASE_URL}/Queries/contract`;
    return (

        <>


            <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10`} >
                <div className="bg-white p-4 rounded-lg w-[300px] md:w-[500px]">
                    <img
                        src="/Svg/Close.svg"
                        alt=""
                        className="cursor-pointer ml-auto size-[20px]"
                        onClick={onClose}
                    />

                    <div className="flex justify-between w-full my-3 text-[9px] sm:text-[10px] mdm:text-[12px]">
                        <div className="flex">
                            <img
                                className="hidden sm:block size-[35px] Avatar"
                                src={`/Media/${rowData.user.img}`}
                                alt=""
                            />
                            <div className="flex flex-1 flex-col ml-2">
                                <div className="flex flex-1 justify-between items-center">
                                    <p className="poppins-semibold">
                                        {rowData.user.name}
                                    </p>
                                </div>
                                <div className="flex justify-between text-black/50 text-[12px]">
                                    <p>{rowData.user.username}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end h-[34px] space-x-3">
                            <div
                                className="OrangeButtonWithText-v4 flex items-center cursor-pointer"
                                onClick={handleOpenAttachment}
                            >
                                <p>Open Attachment</p>
                            </div>
                        </div>
                    </div>

                    <div className="mx-5">
                        {(rowData.issue === 'Contract' || rowData.issue === 'Payment') &&
                            <div className="flex justify-between lato-black text-[14px] poppins-regular items-center mt-5">
                                <div>
                                    <p className="poppins-bold text-center">Issue</p>
                                    <div className="DealsBorder-v2 mt-2">
                                        <p className="font-medium text-black/50 py-1">
                                            Instagram
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="poppins-bold text-center">Contract Link</p>
                                    <div className="flex items-center gap-x-2 mt-2 py-2">
                                        <input
                                            type="text"
                                            readOnly
                                            className="border-[1px] rounded-3xl outline-none font-normal w-[200px] px-3 pr-10 py-[6px] text-black/50"
                                            ref={contractLinkRef}
                                            defaultValue={`${url}`}
                                        />
                                        <div
                                            className="OrangeButtonWithText-v4 py-[7px] text-[12px] flex items-center cursor-pointer"
                                            onClick={handleOpenContractLink}
                                        >
                                            <p>Open</p>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        }

                        <div className="text-[14px] mt-5">
                            <p className="poppins-bold">Description</p>
                            <div className="DealsBorder-v2 mt-2">
                                <p className="font-medium text-black/50 py-2 text-center">
                                  {rowData.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex  text-[14px] poppins-regular">
                        {/* Message Input */}
                        <div className="mx-5 mt-5 w-full">
                            <p className="poppins-semibold text-[14px] text-center">
                                Message
                            </p>
                            <textarea
                                className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50 "
                                rows="4"
                                placeholder="Write something..."
                            ></textarea>
                        </div>

                        {/* Status Dropdown */}
                        <div className="mt-5">
                            <p className="poppins-semibold text-[14px]  text-center">
                                Status
                            </p>
                            <select className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {/* Send Button */}
                    <div className="mt-5 flex">
                        <button className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-full">
                            Send
                        </button>
                    </div>

                </div>
            </div>

            {/* Attachment Modal */}
            {isAttachmentModalVisible && (
                <div className="absolute top-[1%]  flex justify-center h-fit items-center  bg-opacity-70 z-40">
                    <div className="bg-white p-4 rounded-lg  md:w-[600px]">
                        <img
                            src="/Svg/Close.svg"
                            alt=""
                            className="cursor-pointer ml-auto size-[20px] "
                            onClick={handleCloseAttachment}
                        />
                        <p className="poppins-semibold text-center mt-4">Attachment</p>
                        <div className="mt-4 flex justify-center items-center">
                            <img
                                src={`${rowData.attachment}`}
                                alt="User attachment"
                                className="w-full h-[600px] object-cover "
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
