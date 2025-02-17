import { useState, useRef } from 'react';

const WithDrawModel = ({ rowData, onClose, Update, setUpdate }) => {
    const [status, setStatus] = useState(true);
    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [message, setMessage] = useState('');

    if (!rowData) return null;

    // Function to toggle attachment modal
    const handleOpenAttachment = () => {
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
    const handleStatusChange = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/support/withdraw/Review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: rowData._id, // Replace with appropriate ID
                    status,
                    name,
                    accountNumber,
                }),
            });

            if (response.ok) {
                alert('Status updated successfully!');
                setUpdate(!Update);
                onClose();
            } else {
                alert('Failed to update status.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred while updating.');
        }
    };

    return (
        <>
            <div>
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-4 rounded-lg w-[300px] md:w-[500px]">
                        <img
                            src="/Svg/Close.svg"
                            alt="Close"
                            className="cursor-pointer ml-auto size-[20px]"
                            onClick={onClose}
                        />


                        <div className='grid grid-cols-2 space-x-5'>

                            {/* Name Input */}
                            <div className="mt-4">
                                <label className="poppins-semibold text-[14px]">Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="border-[1px] rounded-lg px-3 py-2 w-full"
                                    value={rowData.userID.fullName}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter name"
                                />
                            </div>

                            {/* Account Number Input */}
                            <div className="mt-4">
                                <label className="poppins-semibold text-[14px]">Account Number</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="border-[1px] rounded-lg px-3 py-2 w-full"
                                    value={rowData.accountID.paymentAccount}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Enter account number"
                                />

                            </div>

                        </div>

                        <div className='grid grid-cols-2 space-x-5'>

                       <div>
                       <label className="poppins-semibold text-[14px]">Account Name</label>
                        <input
                            readOnly
                            type="text"
                            className="border-[1px] rounded-lg px-3 py-2 w-full"
                            value={rowData.accountID.accountHolderName}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                        />
                       </div>
                       <div>
                       <label className="poppins-semibold text-[14px]">Bank Name</label>
                        <input
                            readOnly
                            type="text"
                            className="border-[1px] rounded-lg px-3 py-2 w-full"
                            value={rowData.accountID.bankName}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                        />
                       </div>
                       

                        </div>

                        <div>
                       <label className="poppins-semibold text-[14px]">Amount</label>
                        <input
                            readOnly
                            type="text"
                            className="border-[1px] rounded-lg px-3 py-2 w-full"
                            value={rowData.amount}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                        />
                       </div>

                        {/* Status Selection */}
                        <div className="flex w-full mt-5 justify-between items-center text-[14px] poppins-regular">
                            <div>
                                <p className="poppins-semibold text-[14px] text-center">Status</p>
                                <select
                                    className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value === 'true')}
                                >
                                    <option value="true">Approve</option>
                                    <option value="false">Reject</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div onClick={handleStatusChange} className="mt-5 flex">
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

export default WithDrawModel;
