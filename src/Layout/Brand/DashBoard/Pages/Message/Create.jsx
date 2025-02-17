// import React, { useState } from 'react';

// function PopupFormComponent() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [members, setMembers] = useState([{ id: Date.now(), name: '' }]);

//   // Function to toggle modal visibility
//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen);
//   };

//   // Function to add a new member
//   const addMember = () => {
//     setMembers([...members, { id: Date.now(), name: '' }]);
//   };

//   return (
//     <div>
//       {/* Button to open modal */}
//       <div
//         className="OrangeButtonWithText-v3 fixed bottom-10 right-10 sm:bottom-0 sm:right-0 sm:relative sm:size-[30px] mdm:size-[40px] flex items-center cursor-pointer justify-center"
//         onClick={toggleModal}
//       >
//         <p className="text-2xl">+</p>
//       </div>

//       {/* Modal overlay */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           {/* Modal content */}
//           <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
//             <h2 className="text-lg font-semibold mb-4">Add New Member</h2>

//             {/* Input for Name Title */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Name Title</label>
//               <input
//                 type="text"
//                 className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
//                 placeholder="Enter Name Title"
//               />
//             </div>

//             {/* Dynamic members list */}
//             {members.map((member, index) => (
//               <div key={member.id} className="flex items-center mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mr-2">Member {index + 1}</label>
//                 <input
//                   type="text"
//                   className="px-3 py-2 border border-gray-300 rounded-md flex-1"
//                   placeholder="Search Member"
//                   value={member.name}
//                   onChange={(e) =>
//                     setMembers(
//                       members.map((m) =>
//                         m.id === member.id ? { ...m, name: e.target.value } : m
//                       )
//                     )
//                   }
//                 />
//               </div>
//             ))}

//             {/* Button to add a new member */}
//             <button
//               className="bg-orange-500 text-white px-4 py-2 rounded-md mb-4"
//               onClick={addMember}
//             >
//               Add Member
//             </button>

//             {/* Create and Cancel buttons */}
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 rounded-md border border-gray-300"
//                 onClick={toggleModal}
//               >
//                 Cancel
//               </button>
//               <button className="px-4 py-2 rounded-md bg-green-500 text-white">
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PopupFormComponent;
