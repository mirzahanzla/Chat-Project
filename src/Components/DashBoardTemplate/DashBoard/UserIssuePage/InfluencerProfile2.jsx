import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FetchDataUser from '../../../Table/FetchDataUser';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

const InfluencerProfile2 = ({ onCloseIssue, user }) => {
    const [isSupportOpen, setIsSupportOpen] = useState(true);
    const location = useLocation();
    

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);
    const [originalUser, setOriginalUser] = useState(user); // Store original user data

    const handleBackClick = () => {
        window.history.back();
    };

    if (!user) {
        return <div className="text-red-500 text-center">No user data available</div>;
    }

    const toggleEdit = () => {
        if (isEditing) {
            setEditedUser(originalUser); // Revert to original data on cancel
        } else {
            setEditedUser(user); // Start editing with current user data
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({
            ...editedUser,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`/user/editProfileData/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: editedUser.fullName,
                    age: editedUser.age,
                    gender: editedUser.gender,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setEditedUser(updatedUser.user);
            setOriginalUser(updatedUser.user); // Update original user data with new data
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('There was an error updating your profile.');
        }
    };

    const categories = user.category.length > 0 ? JSON.parse(user.category[0]) : [];



    const slideIn = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '100%', opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isSupportOpen && (
                <div className='bg-neutral-300/65 z-20 absolute right-0 '>
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
                                    {/* <div className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]" >
                                        <p>Withdrawal</p>
                                    </div> */}
                                     <div className="flex justify-between">
                    {isEditing ? (
                        <>
                            <button
                               className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]"
                                onClick={handleSaveChanges}
                            >
                                Save Changes
                            </button>
                            <button
                                className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 transition"
                                onClick={toggleEdit}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]"
                            onClick={toggleEdit}
                        >
                            Edit
                        </button>
                    )}
                   
                </div>
                                </div>
                                {/*add start  */}
                              
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={user.photo}
                        alt={`${user.fullName}'s profile`}
                        className="rounded-full w-24 h-24 object-cover mb-2"
                    />
                    <h2 className="text-2xl font-medium">{editedUser.fullName}</h2>
                    <p className="text-gray-600">{editedUser.email}</p>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="fullName"
                                value={editedUser.fullName}
                                onChange={handleInputChange}
                                className="mt-2 border border-gray-300 rounded-md p-2 w-full"
                            />
                            <input
                                type="text"
                                name="age"
                                value={editedUser.age}
                                onChange={handleInputChange}
                                className="mt-2 border border-gray-300 rounded-md p-2 w-full"
                            />
                            <select
                                name="gender"
                                value={editedUser.gender}
                                onChange={handleInputChange}
                                className="mt-2 border border-gray-300 rounded-md p-2 w-full"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500">Age: {editedUser.age}</p>
                            <p className="text-gray-500">Gender: {editedUser.gender}</p>
                            <p className="text-gray-500">User Type: {user.userType}</p>
                        </>
                    )}
                </div>

                <div className="mb-4  ">
                    <div className="mb-3">
                        <label htmlFor="website" className="block text-gray-700">Website:</label>
                        <p className="mt-1 block  hover:underline">
                            <a href={user.website} target="_blank" rel="noopener noreferrer">
                                {user.website}
                            </a>
                        </p>
                    </div>
                    <div>
                        <label htmlFor="categories" className="block text-gray-700">Categories:</label>
                        <div className="mt-1 flex flex-col gap-2">
                            {categories.length > 0 ? (
                                categories.map((cat, index) => (
                                    <p
                                        key={index}
                                        className='OrangeButtonBorder text-primary text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px] cursor-pointer w-[100px]'
                                    >
                                        {cat}
                                    </p>
                                ))
                            ) : (
                                <p className='OrangeButtonBorder text-primary text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px] cursor-pointer'>
                                    No Categories
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                

                                {/* add finish */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

        </AnimatePresence>
    );
};



export default InfluencerProfile2;
