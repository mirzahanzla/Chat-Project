import Card from "../../../../../Components/Card/Card";
import SimpleBarChart from "../../../../../Components/Charts/SimpleBarChart";
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

const prepareChartData = (blogs, numMonths = 6) => {
  const months = getMonthsRange(numMonths);
  const monthlyData = {};

  //initialize data for each month to 0
  months.forEach(month => {
    monthlyData[month] = { likes: 0, comments: 0, visits: 0 }; // `visits` is used for reach
  });

  // Store data for each month to show in bar chart
  blogs.forEach(blog => {
    if (blog.monthlyInteraction) {
      Object.keys(blog.monthlyInteraction).forEach(month => {
        if (monthlyData[month]) {
          const interactions = blog.monthlyInteraction[month];
          monthlyData[month].likes += interactions.likes || 0;
          monthlyData[month].visits += interactions.visits || 0; // `visits` is used for reach
          if (interactions.commentedBy) {
            Object.keys(interactions.commentedBy).forEach(user => {
              monthlyData[month].comments += interactions.commentedBy[user].length || 0;
            });
          }
        }
      });
    }
  });

  //sorting and converting to readable month form
  months.sort((a, b) => a.localeCompare(b));
  return months.map(month => ({
    name: new Date(`${month}-01`).toLocaleString('default', { month: 'short' }),
    Likes: monthlyData[month].likes,
    Comments: monthlyData[month].comments,
    Visits: monthlyData[month].visits, // `visits` is used for reach
  }));
};

const Engagement = ( { curSixMonLikes, curSixMonShares, curSixMonComments, prevSixMonLikes, prevSixMonShares, prevSixMonComments, blogs } ) => {

  console.log("Blogs [] in Engagement: ", blogs);
  const chartData = prepareChartData(blogs);

  const getStatus = (percent) => {
    return percent >= 0 ? 1 : 0;
  };

  const safeNumber = (value) => {
    return typeof value === 'number' ? value : 0;
  };

  // Calculate percentage changes
  const calculateChange = (prevValue, currentValue) => {

    prevValue = safeNumber(prevValue);
    currentValue = safeNumber(currentValue);

    if (typeof prevValue !== 'number' || typeof currentValue !== 'number') {
      throw new Error("Both must be numbers.");
    }

    if (prevValue === 0) {
      if (currentValue === 0) {
        return 0;
      }
      return currentValue;
    }

    return ((currentValue - prevValue) / prevValue) * 100;
  };

  const likesChange = calculateChange(prevSixMonLikes, curSixMonLikes);
  const sharesChange = calculateChange(prevSixMonShares, curSixMonShares);
  const CommentsChange = calculateChange(prevSixMonComments, curSixMonComments);

  return (
    <>
      <div className="bg-white w-full mt-10 rounded-3xl" id="Engagement">
        <div className="px-5 py-5 flex flex-col">
          <p className="lato-bold text-lg">Engagement</p>
          <div className="mt-6">
            <div className="mt-2 grid xs:grid-cols-2 xs:grid-rows-1 gap-y-5 md:grid-cols-3 md:grid-rows-1 gap-y-5">
              <Card Heading="Total Likes" totalNumbers={curSixMonLikes} Percentage={likesChange} time="Last 6 Months" Status={getStatus(likesChange)} />
              <Card Heading="Total Comments" totalNumbers={curSixMonComments} Percentage={CommentsChange} time="Last 6 Months" Status={getStatus(CommentsChange)} />
              <Card Heading="Total Reach" totalNumbers={curSixMonShares} Percentage={sharesChange} time="Last 6 Months" Status={getStatus(sharesChange)} />
            </div>
            <p className="lato-regular mt-12 ml-7">Total Likes and Comments</p>
            {/* 2px border and Bar chart */}
            <div className="border-2 rounded-xl lato-regular text-[10px] mdm:text-base">
              <div className="flex justify-between mx-10 w-[200px] mx-auto mb-5 mt-5">
                <div className="flex items-center gap-x-2">
                  <div className="size-[10px] bg-blue-500 rounded-full"></div>
                  <p>Likes</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="size-[10px] bg-green-500 rounded-full"></div>
                  <p>Comments</p>
                </div>
              </div>
              <div className="w-full h-[200px] overflow-scroll scroll-container">
                <div className="w-[900px] h-full md:w-full">
                  <SimpleBarChart data = {chartData}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Engagement;