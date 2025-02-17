import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FetchDataUser from '../../../Table/FetchDataUser';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

const Predict = ({ onCloseIssue, User }) => {
    const [isSupportOpen, setIsSupportOpen] = useState(true);
 


    const slideIn = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '100%', opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isSupportOpen && (
                <div className='bg-neutral-300/65 z-20 absolute right-0'>
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
                                        <p>User Profile </p>
                                    </div>
                                    <div className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]" >
                                        <p>Withdrawal</p>
                                    </div>
                                </div>
                                {/*add start  */}

                                {/* add finish */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

        </AnimatePresence>
    );
};




export default Predict;
