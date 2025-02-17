import { useState, useRef } from 'react';
import Brand from './brand';

const InfluencerModel = ({ rowData, onClose, Update, setUpdate }) => {
    const contractLinkRef = useRef(null);
    const [status, setStatus] = useState(true);
    const [message, setMessage] = useState('');

    if (!rowData) return null;

   
    
    // Function to toggle attachment modal
    const handleOpenAttachment = () => {
        console.log("Link is ")
        console.log(rowData.influencerData.verificationAttachment)
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>Transaction</title></head>
                <body style="margin:0;">
                    <img src="${rowData.influencerData.verificationAttachment}" style="width:100%;height:auto;" />
                </body>
            </html>
        `);
        newWindow.document.close();
    };

    // Function to approve or reject influencer status
    const InfluncerApproved = async () => {
       
        
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/Support/influencerVerifyStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ influencerId: rowData.influencerData._id, status }),
            });

            if (response.ok) {
                alert('Updated successfully!');
                setUpdate(!Update);
                onClose(); // Close the modal after updating
            } else {
                alert('Failed to update status.');
            }
        } catch (error) {
            console.error('Error updating influencer status:', error);
            alert('An error occurred while updating.');
        }
    };

    // Handle form submission to update status
    const handleSubmit = () => {
        InfluncerApproved();
    };

    return (
        <>
            <div>
                <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10`}>
                    <div className="bg-white p-4 rounded-lg w-[300px] md:w-[500px]">
                        <img
                            src="/Svg/Close.svg"
                            alt="Close"
                            className="cursor-pointer ml-auto size-[20px]"
                            onClick={onClose}
                        />

                        {/* <Brand getValue={getValue} /> */}

                        <div className="flex w-full mt-5 justify-between items-center text-[14px] poppins-regular">
                            {/* Open Attachment */}
                            <div>
                                <p className="poppins-semibold text-[14px] text-center">Status</p>
                                <select
                                    className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="true">Approve</option>
                                    <option value="false">Reject</option>
                                </select>
                            </div>

                            <div className="flex justify-between items-center my-3 text-[9px] sm:text-[10px] mdm:text-[12px]">
                                <div className="flex justify-end h-[34px] space-x-3">
                                    <div
                                        className="OrangeButtonWithText-v4 flex items-center cursor-pointer"
                                        onClick={handleOpenAttachment}
                                    >
                                        <p>Open Attachment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Send Button */}
                        <div onClick={handleSubmit} className="mt-5 flex">
                            <button className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-full">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InfluencerModel;
