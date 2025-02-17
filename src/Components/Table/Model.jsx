import { useState, useRef } from 'react';

const Modal = ({ rowData, onClose ,Update,setUpdate }) => {
    const contractLinkRef = useRef(null);
    const [status, setStatus] = useState(rowData.status || 'Pending');
    const [message, setMessage] = useState('');
  
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
        window.open(rowData.attachment, "_blank");
    };

    // Handle form submission to update status and message
    const handleSubmit = async () => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/Support/issues/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issueId: rowData._id,
                status,
                message
            })
        });

        if (response.ok) {
            alert('Issue updated successfully!');
            setUpdate(!Update)
            onClose(); // Close the modal after updating
        } else {
            alert('Failed to update issue.');
        }
    };

    return (
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
                            src={`${rowData.userId.photo}`}
                            alt=""
                        />
                        <div className="flex flex-1 flex-col ml-2">
                            <div className="flex flex-1 justify-between items-center">
                                <p className="poppins-semibold">
                                    {rowData.userId.fullName}
                                </p>
                            </div>
                            <div className="flex justify-between text-black/50 text-[12px]">
                                <p>@{rowData.userId.fullName}</p>
                            </div>
                        </div>
                    </div>

                    {rowData.attachment && <div className="flex justify-end h-[34px] space-x-3">
                        <div
                            className="OrangeButtonWithText-v4 flex items-center cursor-pointer"
                            onClick={handleOpenAttachment}
                        >
                            <p>Open Attachment</p>
                        </div>
                    </div>}

                    
                </div>

                <div className="mx-5">
                   

                    <div className="text-[14px] mt-5">
                        <p className="poppins-bold">Description</p>
                        <div className="DealsBorder-v2 mt-2 border-[1px] rounded-lg px-3 py-2  text-black/50 font-medium">
                            <p className="font-medium text-black/50 py-2 text-center">
                                {rowData.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex text-[14px] poppins-regular mx-5">
                    

                    <div className="mt-5">
                        <p className="poppins-semibold text-[14px] text-center">Status</p>
                        <select
                            className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Review">In Review</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5 flex">
                    <button
                        className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-full"
                        onClick={handleSubmit}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
