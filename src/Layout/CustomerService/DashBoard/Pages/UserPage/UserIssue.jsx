import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // Import motion from framer-motion
import FetchDataUser from '../../../../../Components/Table/FetchDataUser';

const UserIssue = () => {
    const [isSupportOpen, setIsSupportOpen] = useState(true); // Corrected useState naming
    const [CreateIssueModal, setCreateIssueModal] = useState(false); // Corrected useState naming

    // Define the slide-in animation
    const slideIn = {
        hidden: { x: '100%', opacity: 0 }, // Start from the right off-screen
        visible: { x: '0%', opacity: 1 },   // Slide into place
        exit: { x: '100%', opacity: 0 },    // Slide out to the right
    };

    const onClose = () => {
        setCreateIssueModal(false)
    }

    return (
        <AnimatePresence>
            {isSupportOpen && (



                <div className='bg-neutral-300/65 z-20 relative'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={slideIn}
                        transition={{ duration: 0.5 }} // Customize the duration
                    >
                        <div className="flex justify-end items-start h-screen z-10">
                            <div className="bg-white p-4 lg:w-[700px] h-screen overflow-auto">
                                <div className="hover:cursor-pointer" onClick={() => setIsSupportOpen(false)}>
                                    <img src="/Svg/Close.svg" alt="Close" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="justify-center flex text-center py-2 cursor-pointer w-[150px] font-bold poppins-semibold">
                                        <p>Support</p>
                                    </div>
                                    <div className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]" onClick={() => { setCreateIssueModal(true) }}>
                                        <p>+ Create Issue</p>
                                    </div>
                                </div>
                                <FetchDataUser />
                                {/* This is the table */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {CreateIssueModal ? <CreateIssue onClose={onClose} /> : ""}
        </AnimatePresence>
    );
};



const CreateIssue = ({ onClose }) => {
    const contractLinkRef = useRef(null);
    const [attachment, setAttachment] = useState(null);
    const [attachmentName, setAttachmentName] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');

    const url=import.meta.env.VITE_SERVER_BASE_URL


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
            setAttachment(file);
            setAttachmentName(file.name);
        } else {
            alert("Please upload a valid JPG or JPEG file.");
        }
    };

    const handleIssueTypeChange = (e) => {
        setIssueType(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        
        formData.append('userId', '67291b58692bcdb0ac1082cb');
        formData.append('issue', issueType);
        formData.append('description', description);

        {(issueType === 'Contract') && (
            formData.append('contractLink', contractLinkRef.current.value)
        )}

        formData.append('attachment', attachment); // This will be sent as a file
        

        try {
            const response = await fetch(`/api/issues/new`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Issue submitted successfully!');
                onClose(); // Close the modal after successful submission
            } else {
                alert('Failed to submit issue');
            }
        } catch (error) {
            console.error('Error submitting issue:', error);
            alert('An error occurred while submitting the issue');
        }
    };

    return (
        <>
            <div className='text-[14px]'>
                <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-30 overflow-y-scroll`}>
                    <div className='p-10 h-screen'>
                        <div className="bg-white p-4 rounded-lg w-[300px] md:w-[500px]">
                            <img
                                src="/Svg/Close.svg"
                                alt="Close"
                                className="cursor-pointer ml-auto size-[20px]"
                                onClick={onClose}
                            />

                            <div className="flex w-full my-3 justify-between items-center">
                                <div>
                                    <p className="poppins-semibold">Issue</p>
                                    <select className="border-[1px] rounded-lg px-3 py-2 w-[150px] text-black/50 font-medium" onChange={handleIssueTypeChange}>
                                        <option value="">Select Issue Type</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Payment">Payment</option>
                                        <option value="Account">Account</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="flex flex-col items-end h-[34px] space-y-1">
                                    <div className="OrangeButtonWithText-v4 py-2 flex items-center cursor-pointer">
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <p>Upload Attachment</p>
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept=".jpg, .jpeg,.png"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }} // Hide the default file input
                                        />
                                    </div>
                                    {attachmentName && (
                                        <p className="text-[12px] text-black/50">{attachmentName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="text-[14px] mt-5">
                                <p className="poppins-semibold text-[14px]">Description</p>
                                <textarea
                                    className="w-full border-[1px] rounded-lg px-3 py-2 text-black/50"
                                    rows="4"
                                    placeholder="Write something..."
                                    onChange={handleDescriptionChange}
                                ></textarea>
                            </div>

                            {(issueType === 'Contract') && (
                                <div className='w-full mt-5'>
                                    <p className="poppins-semibold text-[14px]">Contract Link</p>
                                    <input
                                        type="text"
                                        placeholder="Enter the contract link"
                                        className="border-[1px] rounded-lg outline-none font-normal w-full px-3 pr-10 py-[6px] text-black/50"
                                        ref={contractLinkRef}
                                    />
                                </div>
                            )}

                            {attachment && (
                                <div className="mt-4">
                                    <p className="poppins-semibold text-[14px]">Attachment Preview</p>
                                    <img
                                        src={URL.createObjectURL(attachment)}
                                        alt="Uploaded Attachment"
                                        className="w-full h-auto border rounded-md"
                                    />
                                </div>
                            )}

                            <div className="mt-5 flex">
                                <button
                                    className="OrangeButtonWithText-v4 py-2 px-10 text-[14px] rounded-lg w-full"
                                    onClick={handleSubmit} // Call the submit function
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};







export default UserIssue;
