import { useContext, useEffect, useState } from 'react';
import Card from "../../../../../Components/Card/Card";
import CardWithImage from "../../../../../Components/Card/CardWithImage";
import { CampaignContext } from './CurrentCompaign';
import axios from 'axios'; // Assuming axios is installed

const Report = () => {
  const campaignData = useContext(CampaignContext);
  const [reportData, setReportData] = useState({
    totalLikes: 0,
    totalComments: 0,
    totalEngagements: 0,
    totalContractBudget: 0,
  });

  useEffect(() => {
    // Fetch data from API using the dealID
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`/Brand/getEngagementAndBudgetByDealID/${campaignData._id}`);
        const { totalLikes, totalComments, totalEngagements, totalContractBudget } = response.data;

        // Update state with the fetched data
        setReportData({
          totalLikes,
          totalComments,
          totalEngagements,
          totalContractBudget,
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    if (campaignData?._id) {
      fetchReportData(); // Only fetch data if dealID is available
    }
  }, [campaignData?._id]);

  return (
    <div className="bg-white mx-auto mt-10 rounded-3xl w-[300px] xs:w-[550px] sm:w-[600px] mdm:w-[700px] lg:w-[900px]">
      <div className="px-5 py-3 flex flex-col">
        <p className="lato-bold">Overview</p>

        <div className="mt-6">
          <div className="grid gap-y-5 mt-2 xs:grid-cols-2 xs:grid-rows-3 md:grid-cols-3 md:grid-rows-2">
            {/* Cards without images */}
            <Card
              Heading="Total Likes"
              totalNumbers={reportData.totalLikes}
              Percentage="0" // Replace with real percentage if available
              time="LastMonth"
              Status={1}
            />
            <Card
              Heading="Total Comments"
              totalNumbers={reportData.totalComments}
              Percentage="0" // Replace with real percentage if available
              time="LastMonth"
              Status={1}
            />

            {/* Cards with images */}
            <CardWithImage
              Heading="Total Engagement"
              totalNumbers={reportData.totalEngagements}
              Percentage="0" // Replace with real percentage if available
              time="LastMonth"
              ImageSource="card1.png"
            />
            <CardWithImage
              Heading="Total Budget Spent"
              totalNumbers={`$${reportData.totalContractBudget}`}
              Percentage="0" // Replace with real percentage if available
              time="LastMonth"
              ImageSource="card2.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;