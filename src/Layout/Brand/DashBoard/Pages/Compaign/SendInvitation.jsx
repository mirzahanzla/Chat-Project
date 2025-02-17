import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { CampaignContext } from './CurrentCompaign';
import './index.css';

const SendInvitation = ({ influencersOptions, selectedInfluencers, spendings, campaignBudget, handleChange }) => {
  const campaignData = useContext(CampaignContext);
  const [budget, setBudget] = useState(50);
  const [posts, setPosts] = useState(1);
  const [deadline, setDeadline] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [revisions, setRevisions] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleInvitation = async () => {
    if (!selectedInfluencers || selectedInfluencers.length === 0) {
      alert("Please select at least one influencer.");
      return;
    }
  
    // Ensure budget is at least $10 when sending the invitation
    if (budget < 10) {
      alert("Budget must be at least $10.");
      return;
    }
  
    // Check if the current spendings are greater than or equal to the campaign budget
    if (spendings >= campaignBudget) {
      alert("You cannot invite more influencers in this campaign.");
      return;
    }

    if ((budget * selectedInfluencers.length) > campaignBudget){
      alert("Invitation budget can not be greater than campaign budget.");
      return;
    }
  
    // Calculate the total spendings (current spendings + the new spendings for all selected influencers)
    const newTotalSpendings = spendings + (selectedInfluencers.length * budget);
  
    // Check if the new total spendings exceed the campaign budget
    if (newTotalSpendings > campaignBudget) {
      const remainingBudget = campaignBudget - spendings;
      alert(`You only have $${remainingBudget} left in your campaign budget. You cannot invite more influencers.`);
      return;
    }
    
    const status = 'Invited';
    const influencerIDs = selectedInfluencers.map(influencer => influencer.value);
    const milestone = { budget, posts, deadline, revisions, status };
    const data = {
      milestones: milestone,
      deliverables: campaignData?.taskDes,
      influencerIDs,
      dealID: campaignData?._id,
    };
  
    try {
      const authToken = localStorage.getItem('authToken');
      setLoading(true);
  
      const response = await fetch('/Brand/addContract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      const result = await response.json();
      console.log('Contracts successfully created:', result);
  
      // Set success message and start loading for redirection
      setSuccessMessage('Invitation sent successfully!');
      setRedirecting(true);
      setTimeout(() => {
        navigate('/Compaign');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating contracts:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };  

  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    setBudget(value); // Allow budget to be any number
  };

  const handlePostsChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setPosts(value);
    }
  };

  const handleDeadlineChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selectedDate >= tomorrow) {
      setDeadline(selectedDate);
    }
  };

  return (
    <div className="bg-white xs:w-[300px] md:w-[400px] rounded-3xl p-4">
      {loading ? (
        <div className="centered-spinner">
          <div className="spinner"></div>
          {redirecting && <div className="loading-message">Redirecting Please wait...</div>}
        </div>
      ) : (
        <>
          {successMessage && (
            <div className="success-message">
              {successMessage}
              {redirecting && <div className="loading-message">Redirecting Please wait...</div>}
            </div>
          )}
          <div className="grid grid-cols-12 items-center">
            <div className="flex justify-self-center self-center size-[35px] sm:size-[45px] col-span-2">
              <img className="aspect-square Avatar" src={campaignData.dealImage} alt="" />
            </div>
            <div className="col-span-6 text-[9px] sm:text-[10px] mdm:text-[12px]">
              <p className="poppins-semibold">{campaignData.title}</p>
              <p>{campaignData.description}</p>
            </div>
            <div className="w-[70px] sm:w-[100px] mdm:w-[100px] text-center col-span-3 text-[9px] sm:text-[10px] mdm:text-[10px]">
              <p className={`OrangeButtonWithText cursor-pointer text-primary`} onClick={handleInvitation}>Send Invitation</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[9px] sm:text-[10px] mdm:text-[10px] items-center mt-5 mx-10">
              <p className="poppins-semibold text-[13px]">Planned</p>
              <div className="OrangeButtonWithText mt-2 xs:mt-0 items-center cursor-pointer" onClick={() => setIsEditing(!isEditing)}>
                <p>{isEditing ? 'Save' : 'Edit'}</p>
              </div>
            </div>

            <div className="border-2 mx-10 mt-3 p-5 text-[9px] sm:text-[10px] mdm:text-[12px] rounded-xl">
              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between items-center">
                  <label className="poppins-semibold">Budget</label>
                  
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="number"
                        value={budget}
                        onChange={handleBudgetChange}
                        className="text-black/50 lato-regular border rounded-md p-1 w-20"
                        min="0"
                      />
                    </div>
                  ) : (
                    <div className="relative flex items-center">
                      <span
                        className="mr-2 text-blue-500 text-xl font-bold cursor-pointer"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        ?
                      </span>
                      {showTooltip && (
                        <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-sm p-3 rounded shadow-lg w-64">
                          This budget will be the same for all influencers.
                        </div>
                      )}
                      <p className="text-black/50 lato-regular">${budget}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <label className="poppins-semibold">Posts</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={posts}
                      onChange={handlePostsChange}
                      className="text-black/50 lato-regular border rounded-md p-1 w-20"
                      min="1"
                    />
                  ) : (
                    <p className="text-black/50 lato-regular">{posts}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <label className="poppins-semibold">Deadline</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={deadline.toISOString().split('T')[0]}
                      onChange={handleDeadlineChange}
                      className="text-black/50 lato-regular border rounded-md p-1 w-20"
                    />
                  ) : (
                    <p className="text-black/50 lato-regular">{deadline.toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <label className="poppins-semibold">Revisions</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={revisions}
                      min={0}
                      max={5}
                      onChange={(e) => setRevisions(Math.min(5, Math.max(0, Number(e.target.value))))}
                      className="text-black/50 lato-regular border rounded-md p-1 w-20"
                    />
                  ) : (
                    <p className="text-black/50 lato-regular">{revisions}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-2 mx-10 mt-3 p-5 text-[9px] sm:text-[10px] mdm:text-[12px] rounded-xl">
              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between">
                  <p className="poppins-semibold">Select Influencers</p>
                  <p className="text-black/50 lato-regular">Max 3</p>
                </div>
                <div className="mt-3 w-full">
                  <Select
                    options={influencersOptions}
                    value={selectedInfluencers}
                    onChange={handleChange}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="Select influencers"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SendInvitation;