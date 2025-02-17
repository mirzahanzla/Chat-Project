import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FetchDataUser from '../../../Table/FetchDataUser';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

const Report = ({ onCloseIssue }) => {
    const [isSupportOpen, setIsSupportOpen] = useState(true);
    const [AddReportState, setAddReportState] = useState(false);



    const slideIn = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '100%', opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isSupportOpen && (
                <div className='bg-neutral-300/65 z-20 fixed w-full h-full right-0'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={slideIn}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-end items-start h-full z-10">
                            <div className="bg-white p-4 lg:w-[700px] h-screen overflow-auto">
                                <div className="hover:cursor-pointer" onClick={() => {
                                    onCloseIssue(false);
                                    setIsSupportOpen(false);
                                }}>
                                    <img src="/Svg/Close.svg" alt="Close" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="justify-center flex text-center py-2 cursor-pointer w-[150px] font-bold poppins-semibold">
                                        <p>Report </p>
                                    </div>
                                    <div className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]" onClick={() => { setAddReportState(true) }}>
                                        <p>Add Report</p>
                                    </div>
                                </div>
                                {/*add start  */}
                                <FetchReport />
                                {/* add finish */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {AddReportState && <AddReport2 onClose={() => { setAddReportState(false) }} />}

        </AnimatePresence>
    );
};




import UpdateReport from './UpdateReport';
import FetchReport from '../../../Table/FetchREport';
import AddReport2 from './AddReport2';

const ReportForm = () => {
    const [name, setName] = useState('');
    const [sumOfLikes, setSumOfLikes] = useState('');
    const [sumOfComments, setSumOfComments] = useState('');
    const [sumOfEngagements, setSumOfEngagements] = useState('');
    const [noOfPosts, setNoOfPosts] = useState('');
    const [avgEngagementRate, setAvgEngagementRate] = useState('');
    const [followerCount, setFollowerCount] = useState('');
    const [addLoading, setAddLoading] = useState(false); // State for add report loading
    const [addStatus, setAddStatus] = useState(null); // State for add report status

  

    return (
        <div className=" p-5 rounded-xl mb-5">
            <UpdateReport />
        
        </div>
    );
};


export default Report;
