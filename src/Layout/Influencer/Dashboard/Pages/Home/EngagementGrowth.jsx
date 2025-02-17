import React from 'react';
import SimpleLineChart from "../../../../../Components/Charts/SimpleLineChart";
import './Index.css';

const getMonthYear = (date) => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  return `${year}-${month}`;
};

// Get months format
const getMonthsRange = (numMonths) => {
  const months = [];
  const now = new Date();
  
  for (let i = 0; i < numMonths; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(getMonthYear(date));
  }
  
  return months;
};

const prepareChartData = (blogs, numMonths = 12) => {
  const months = getMonthsRange(numMonths);
  const monthlyData = {};

  // Initialize data for each month to 0
  months.forEach((month) => {
    monthlyData[month] = { likes: 0, comments: 0, visits: 0 }; // `visits` is used for reach
  });

  // Store data for each month to show in line graph
  blogs.forEach((blog) => {
    if (blog.monthlyInteraction) {
      Object.keys(blog.monthlyInteraction).forEach((month) => {
        if (monthlyData[month]) {
          const interactions = blog.monthlyInteraction[month];
          monthlyData[month].likes += interactions.likes || 0;
          monthlyData[month].visits += Array.isArray(interactions.visits) ? interactions.visits.length : 0; // Safely handle visits
          if (interactions.commentedBy) {
            Object.keys(interactions.commentedBy).forEach((user) => {
              monthlyData[month].comments += interactions.commentedBy[user]?.length || 0;
            });
          }
        }
      });
    }
  });

  // Sorting and converting to readable month form
  months.sort((a, b) => a.localeCompare(b));
  return months.map((month) => ({
    name: new Date(`${month}-01`).toLocaleString('default', { month: 'short' }),
    Likes: monthlyData[month].likes,
    Comments: monthlyData[month].comments,
    Visits: monthlyData[month].visits, // `visits` is used for reach
  }));
};

const EngagementGrowth = ({ blogs }) => {
  const chartData = prepareChartData(blogs);

  return (
    <div className="bg-white w-full mt-10 rounded-3xl" id='Audience'>
      <div className="px-5 py-5 flex flex-col">
        <p className="lato-bold text-lg">Audience Growth</p>
        <div className="mt-6 poppins-regular text-[10px] md:text-base">
          <p>Net Average Growth Over Time</p>
          <div className="flex mdm:justify-end gap-x-7">
            <div className="flex justify-center gap-x-2 mdm:block">
              <div className="flex items-center gap-x-2">
                <div className="size-[10px] bg-blue-500 rounded-full"></div>
                <p>Likes</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="size-[10px] bg-green-500 rounded-full"></div>
                <p>Comments</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="size-[10px] bg-orange-500 rounded-full"></div>
                <p>Visits</p>
              </div>
            </div>
          </div>
          <div className="h-[150px] md:w-full mdm:h-[220px] mt-7 scroll-container">
            <div className="w-[900px] h-full md:w-full">
              <SimpleLineChart data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementGrowth;
