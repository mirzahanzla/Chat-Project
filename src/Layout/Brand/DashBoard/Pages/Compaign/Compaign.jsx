import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateCampaign from './CreateCampaign';

const Compaign = () => {
  const navigate = useNavigate();
  const [campaignData, setCampaignData] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [CreateCompaignstate, setCreateCompaignstate] = useState(0);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await axios.get('/Brand/getCampaigns', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const campaigns = response.data.deals || [];
        setCampaignData(campaigns);

        // Calculate total budget and active campaigns count
        let budgetSum = 0;
        let activeCount = 0;
        
        campaigns.forEach(campaign => {
          budgetSum += campaign.budget || 0; // Assuming 'budget' is a field in each campaign
          if (campaign.status === 'Active') {
            activeCount += 1;
          }
        });

        setTotalBudget(budgetSum);
        setActiveCampaigns(activeCount);

      } catch (error) {
        if (error.response && error.response.data && error.response.data.message === "Brand not found") {
          setCampaignData([]); 
          setTotalBudget(0); 
          setActiveCampaigns(0);
        } else {
          console.error('Error fetching campaign data:', error);
        }
      }
    };

    fetchCampaignData();
  }, []);

  const countInvitedInfluencers = (userStatuses) => {
    if (!userStatuses) return 0;
    return userStatuses.filter(status => status.status === 'Invited').length;
  };

  return (
    <>
      {/* Top bar total posted ,active comapign */}
      <div className="pt-5 w-[300px] sm:w-[500px] mdm:w-[700px] mx-auto h-screen">

        {/* Information bar of whole campaign */}
        <div className="px-2 py-3 sm:py-7 rounded-2xl border-2 bg-white flex justify-around items-center">

          <div className="pl-1 mdm:pl-10 flex flex-col items-center">
            <p className="text-black/50 poppins-regular text-[7px] sm:text-[10px] mdm:text-[12px]">Active Campaigns</p>
            <p className="poppins-semibold text-[7px] sm:text-[10px] mdm:text-[12px]">{activeCampaigns}</p>
          </div>

          {/* Left border */}
          <div className="border-l-2 h-[30px]"></div>

          <div className="pl-1 mdm:pl-10 flex flex-col items-center text-[7px] sm:text-[10px]">
            <p className="text-black/50 poppins-regular mdm:text-[12px]">Total Campaigns</p>
            <p className="poppins-semibold mdm:text-[12px]">{campaignData.length}</p>
          </div>

          {/* Left border */}
          <div className="border-l-2 h-[30px]"></div>

          <div className="pl-1 mdm:pl-10 flex flex-col items-center text-[7px] sm:text-[10px] mdm:text-[12px]">
            <p className="text-black/50 poppins-regular">Total Budget</p>
            <p className="poppins-semibold">${totalBudget.toFixed(2)}</p>
          </div>

        </div>

        {/* campaign bar and create Campaign button */}
        <div className="flex justify-between mt-5">
          <p className="poppins-semibold text-lg">Campaign</p>
          <div className="OrangeButtonWithText mt-2 xs:mt-0 flex items-center sm:text-[12px] lg:text-sm xs:text-[10px] cursor-pointer poppins-regular text-[12px]">
            {/* <p onClick={() => navigate('CreateCampaign')}>+ Create Campaign</p> */}
            <p onClick={() => { setCreateCompaignstate(1) }}>+ Create Campaign</p>
          </div>
        </div>

        {/* List of all the Campaigns of the user */}
        {campaignData.length > 0 && (
          campaignData.map((campaign) => (
            <div key={campaign._id} className="px-2 py-7 rounded-2xl bg-white bt-10 flex justify-around mt-5 items-center cursor-pointer" 
              onClick={() => navigate('CurrentCompaign', { state: { campaign }  })}>
              <div className="flex gap-x-2 items-center">
                <div className="flex items-center size-[35px] sm:size-[50px]">
                  <img className="aspect-square Avatar" src={campaign.dealImage} alt="Campaign" />
                </div>
                <div className="poppins-regula text-[7px] sm:text-[10px] mdm:text-[12px]">
                  <p>Campaign Description</p>
                  <div className="flex flex-col sm:flex-row text-black/50">
                    <p className="poppins-semibold">{campaign.campaignDes.substring(0, 35)}...</p>
                  </div>
                </div>
              </div>

              <div className="pl-10 flex flex-col items-center text-[7px] sm:text-[10px] mdm:text-[12px]">
                <p className="poppins-regular">Invited Influencers</p>
                <p className="poppins-semibold text-black/50">{countInvitedInfluencers(campaign.userStatuses)}</p>
              </div>

              <div className="pl-10 flex flex-col items-center text-[7px] sm:text-[10px] mdm:text-[12px]">
                <p className="poppins-regular">Campaign Budget</p>
                <p className="poppins-semibold text-black/50">${campaign.budget || 0}</p>
              </div>

              <img src="Svg/More.svg" alt="More" />
            </div>
          ))
        )}
      </div>
      {CreateCompaignstate === 1 && <CreateCampaign  onClose={setCreateCompaignstate}/>}

    </>
  );
}

export default Compaign;