// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';

const RequestDeal = ({ onClose, dealID }) => {
  // const [isModalOpen, setModalOpen] = useState(false);
  const [showPopOver, setShowPopOver] = useState(false);
  const [budget, setBudget] = useState(10); // Default value 10
  const [platformFee, setPlatformFee] = useState((10 * 0.1).toFixed(2)); // Default platform fee
  const [coverLetter, setCoverLetter] = useState(''); // Ensure cover letter is filled
  const [link, setLink] = useState(''); // Single link state
  const [posts, setPosts] = useState(1); // Default posts is 1
  const [revisions, setRevisions] = useState(1); // Default revisions is 1
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleBudgetChange = (e) => {
    const newBudget = Math.max(10, e.target.value); // Minimum budget is 10
    setBudget(newBudget);
    setPlatformFee((newBudget * 0.1).toFixed(2));
  };

  const handleCoverLetterChange = (e) => {
    setCoverLetter(e.target.value); // Update cover letter text
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value); // Update single link state
  };

  const handlePostsChange = (e) => {
    setPosts(Math.max(1, e.target.value)); // Minimum 1 post
  };

  const handleRevisionsChange = (e) => {
    setRevisions(Math.max(0, e.target.value)); // Revisions can't be less than 0
  };

  const handleDeadlineChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day
    if (selectedDate >= today) {
      setDeadline(e.target.value);
    } else {
      alert('Deadline must be today or later');
    }
  };

  const handleSubmit = async () => {
    if (!budget || !coverLetter || !posts || revisions === undefined || !deadline) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Authorization token is missing');
        return;
      }

      const response = await axios.post('/api/addProposal', {
        dealID,
        budget,
        platformFee,
        coverLetter,
        link,
        posts,
        revisions,
        deadline
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Proposal requested successfully:', response.data);
      onClose();
    } catch (error) {
      console.error('Error requesting proposal:', error);
    } finally {
      setLoading(false);
      setShowPopOver(false);
      // onClose(); // Automatically close modal after submission
    }
  };

  return (
    <div className="z-10 fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center text-[9px] sm:text-[10px] mdm:text-[12px]">
      <div className="w-[500px] bg-white p-10 rounded-xl relative">
        
      <div className='flex justify-end'>
         
     
      </div>

        <div className="grid grid-cols-2">
          <div className="mt-4">
            <label className="block font-semibold">Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              className="mt-1 border border-gray-300 rounded-lg p-2 w-[200px]"
              placeholder="Enter your budget (min 10)"
            />
          </div>

        <div className="mt-4">
          <label className="block font-semibold">Posts</label>
          <input
            type="number"
            value={posts}
            onChange={handlePostsChange}
            className="mt-1 border border-gray-300 rounded-lg p-2 w-[200px]"
            placeholder="Enter the number of posts (min 1)"
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Revisions</label>
          <input
            type="number"
            value={revisions}
            onChange={handleRevisionsChange}
            className="mt-1 border border-gray-300 rounded-lg p-2 w-[200px]"
            placeholder="Enter revisions (min 0)"
          />
        </div>
       
        <div className="mt-4">
          <label className="block font-semibold">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={handleDeadlineChange}
            className="mt-1 border border-gray-300 rounded-lg p-2 w-[200px]"
          />
        </div>

        <div className="mt-2">
          <p className="text-gray-400">Platform Fee: ${platformFee}</p>
        </div>

          
        </div>
        <div className="mt-4">
          <label className="block font-semibold">Instagram or Previous Work Link</label>
          <input
            type="text"
            value={link}
            onChange={handleLinkChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your Instagram or other work link"
          />
        </div>






        <div className="mt-4">
            <label className="block font-semibold">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={handleCoverLetterChange}
              className="mt-1 border border-gray-300 rounded-lg p-2 w-full h-[100px]"
              placeholder="Enter your cover letter"
            />
          </div>

        <div className="mt-6">
          <div
            className={`w-full ${loading ? 'bg-gray-500' : 'bg-orange-500'} text-white py-2 px-4 rounded-lg flex justify-center mb-3 mx-3 cursor-pointer`}
            onClick={handleSubmit}
    
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </div>
          <div
            className={`w-full text-primary  border-primary border-2 flex justify-center py-2 px-4 rounded-lg outline-2  mx-3 cursor-pointer`}
           onClick={onClose}
    
            disabled={loading}
          >
           Close
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDeal;