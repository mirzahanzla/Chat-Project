import { useState, useRef } from 'react';
import Brand from './brand';

const PaymentModel = ({ rowData, onClose, Update, setUpdate }) => {
    const contractLinkRef = useRef(null);
    const [status, setStatus] = useState( 'Approve');
    const [message, setMessage] = useState('');
    console.log("Payment model clicked is ")
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
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>Transaction</title></head>
                <body style="margin:0;">
                    <img src="${rowData.transactionImage}" style="width:100%;height:auto;" />
                </body>
            </html>
        `);
        newWindow.document.close();
    };

    const getValue = () => {
        return rowData.dealID
    }

    const PaymentApproved= async ()=>{
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/Support/PaymentApproved/${rowData._id}/${rowData.contractID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Updated successfully!');
            setUpdate(!Update)
            onClose(); // Close the modal after updating
        } else {
            alert('Failed to update issue.');
        }
    }

    const PaymentRejected= async ()=>{
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/Support/PaymentRejected/${rowData._id}/${rowData.contractID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Rejected Email is sent successfully!');
            setUpdate(!Update)
            onClose(); // Close the modal after updating
        } else {
            alert('Failed to update issue.');
        }
    }

    // Handle form submission to update status and message
    const handleSubmit = async () => {

         status==="Approve"? PaymentApproved(): PaymentRejected()
        
       
    };

    return (
        <>
            <div>

                <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10`} >
                    <div className="bg-white p-4 rounded-lg w-[300px] md:w-[500px]">
                        <img
                            src="/Svg/Close.svg"
                            alt=""
                            className="cursor-pointer ml-auto size-[20px]"
                            onClick={onClose}
                        />


                        <Brand getValue={getValue} />

                        <div className="flex  w-full mt-5 justify-between  items-center text-[14px] poppins-regular">




                            {/* Open Attachment */}

                            <div className="">
                                <p className="poppins-semibold text-[14px] text-center">Status</p>
                                <select
                                    className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Approve">Approve</option>
                                    <option value="Reject">Reject</option>
                                </select>
                            </div>



                            <div className="flex justify-between items-center  my-3 text-[9px] sm:text-[10px] mdm:text-[12px]">





                                <div className="flex justify-end h-[34px] space-x-3 ">
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

export default PaymentModel;
