import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TinyAreaChart from "../../../../../Components/Charts/TinyAreaChart";
import EngagementGrowth from "./EngagementGrowth";
import Engagement from "./Engagement";
import './Index.css';
import Card from "../../../../../Components/Card/Card";
import CardWithImage from "../../../../../Components/Card/CardWithImage";
import Brands from "./Brands";
import Media from "./Media";

const OverView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState(1000);
  const [totalEarnings, setTotalEarnings] = useState({
    currentMonth: 0,
    previousMonth: 0,
    change: 0
  });

  const [blogData, setBlogData] = useState({
    shares: 0,
    likes: 0,
    comments: 0,
    engagement_Rate: 0,
    reach: 0,
    sharesPercent: 0,
    likesPercent: 0,
    commentsPercent: 0,
    engagementChange: 0,
    visistsChange: 0
  });

  const [totals, setTotals] = useState({
    curSixMonComments: 0,
    curSixMonShares: 0,
    curSixMonLikes: 0,
    prevSixMonComments: 0,
    prevSixMonLikes: 0,
    prevSixMonShares: 0
  });
  const [ blogsInfo, setBlogsInfo ] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const monthsBack = 12;

        // API call to get 12 months data for this user
        const response = await axios.get(`/influencer/blogs?monthsBack=${monthsBack}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });

        const result = response.data;

        if (result.length > 0) {

          const currentMonth = new Date().toISOString().slice(0, 7); //Current month format

          //Previius month format
          const previousMonth = new Date();
          previousMonth.setMonth(previousMonth.getMonth() - 1);
          const previousMonthStr = previousMonth.toISOString().slice(0, 7);

          // Last Six month date format
          const sixMonthsAgoDate = new Date();
          sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);
          const sixMonthsAgoStr = sixMonthsAgoDate.toISOString().slice(0, 7);

          // Sixth month to 12th month date format backwards
          const twelveMonthsAgoDate = new Date();
          twelveMonthsAgoDate.setMonth(twelveMonthsAgoDate.getMonth() - 12);
          const twelveMonthsAgoStr = twelveMonthsAgoDate.toISOString().slice(0, 7);

          const blogs = result.flatMap(item => item.blogs); // Flatten the array of blogs
          setBlogsInfo(blogs);

          // Initialize date
          let currentMonthBlogs = { likes: 0, shares: 0, comments: 0, visits: 0 };
          let previousMonthBlogs = { likes: 0, shares: 0, comments: 0, visits: 0};
          let allTimeTotals = { curSixMonLikes: 0, curSixMonShares: 0, curSixMonComments: 0, prevSixMonLikes: 0, prevSixMonShares: 0, prevSixMonComments: 0 };
          blogs.forEach(blog => {
            if (blog.monthlyInteraction) {
              Object.keys(blog.monthlyInteraction).forEach(month => {
                const interactions = blog.monthlyInteraction[month];
          
                if (month >= sixMonthsAgoStr && month <= currentMonth) {
                  allTimeTotals.curSixMonLikes += interactions.likes || 0;
                  allTimeTotals.curSixMonShares += (interactions.reach?.length || 0);
                  allTimeTotals.curSixMonVisits += (interactions.visits?.length || 0);
                  if (interactions.commentedBy) {
                    Object.keys(interactions.commentedBy).forEach(user => {
                      allTimeTotals.curSixMonComments += (interactions.commentedBy[user]?.length || 0);
                    });
                  }
                }
          
                if (month >= twelveMonthsAgoStr && month < sixMonthsAgoStr) {
                  allTimeTotals.prevSixMonLikes += interactions.likes || 0;
                  allTimeTotals.prevSixMonShares += (interactions.reach?.length || 0);
                  allTimeTotals.prevSixMonVisits += (interactions.visits?.length || 0);
                  if (interactions.commentedBy) {
                    Object.keys(interactions.commentedBy).forEach(user => {
                      allTimeTotals.prevSixMonComments += (interactions.commentedBy[user]?.length || 0);
                    });
                  }
                }
          
                if (month === currentMonth) {
                  currentMonthBlogs.likes += interactions.likes || 0;
                  currentMonthBlogs.shares += (interactions.reach?.length || 0);
                  currentMonthBlogs.visits += (interactions.visits?.length || 0);
                  if (interactions.commentedBy) {
                    Object.keys(interactions.commentedBy).forEach(user => {
                      currentMonthBlogs.comments += (interactions.commentedBy[user]?.length || 0);
                    });
                  }
                }
          
                if (month === previousMonthStr) {
                  previousMonthBlogs.likes += interactions.likes || 0;
                  previousMonthBlogs.shares += (interactions.reach?.length || 0);
                  previousMonthBlogs.visits += (interactions.visits?.length || 0);
                  if (interactions.commentedBy) {
                    Object.keys(interactions.commentedBy).forEach(user => {
                      previousMonthBlogs.comments += (interactions.commentedBy[user]?.length || 0);
                    });
                  }
                }
              });
            }
          });
          

          const prevShares = previousMonthBlogs.shares;
          const prevLikes = previousMonthBlogs.likes;
          const prevComments = previousMonthBlogs.comments;
          const prevVisits = previousMonthBlogs.visits;

          const currentShares = currentMonthBlogs.shares;
          const currentLikes = currentMonthBlogs.likes;
          const currentComments = currentMonthBlogs.comments;
          const currentVisits = currentMonthBlogs.visits;

          // Processing for Egagement Rate calculations
          let totalEngagements =  currentLikes + currentComments;
          const currentEngagementRate = currentShares > 0 ? (totalEngagements / currentShares) : 0;

          totalEngagements = prevComments + prevLikes;
          const prevEngagementRate = prevShares > 0 ? (totalEngagements / prevShares) : 0;

          // Percentage changes compared to previous month
          const sharesChange = calculateChange(prevShares, currentShares);
          const likesChange = calculateChange(prevLikes, currentLikes);
          const commentsChange = calculateChange(prevComments, currentComments);
          const engagementChange = calculateChange(prevEngagementRate, currentEngagementRate);
          const visistsChange = calculateChange(prevVisits, currentVisits);

          setBlogData({
            shares: currentShares,
            likes: currentLikes,
            comments: currentComments,
            engagement_Rate: currentEngagementRate.toFixed(2),
            reach: currentVisits,
            sharesPercent: sharesChange.toFixed(2),
            likesPercent: likesChange.toFixed(2),
            commentsPercent: commentsChange.toFixed(2),
            engagementChange: engagementChange.toFixed(2),
            visistsChange: visistsChange.toFixed(2)
          });

          setTotals({
            curSixMonShares: allTimeTotals.curSixMonShares,
            curSixMonLikes: allTimeTotals.curSixMonLikes,
            curSixMonComments: allTimeTotals.curSixMonComments,
            prevSixMonComments: allTimeTotals.prevSixMonComments,
            prevSixMonLikes: allTimeTotals.prevSixMonLikes,
            prevSixMonShares: allTimeTotals.prevSixMonShares
          });
        }
      } catch (err) {
        setError('Error fetching blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchContracts = async () => {
        try {
            const response = await axios.get('/api/getUserContracts', {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });

            const contracts = Array.isArray(response.data.data) ? response.data.data : [];
            let currentMonthEarnings = 0;
            let previousMonthEarnings = 0;

            const currentMonth = new Date().toISOString().slice(0, 7);
            const previousMonth = new Date();
            previousMonth.setMonth(previousMonth.getMonth() - 1);
            const previousMonthStr = previousMonth.toISOString().slice(0, 7);

            contracts.forEach(contract => {
                if (contract.milestones && Array.isArray(contract.milestones)) {
                    contract.milestones.forEach(milestone => {

                        if (milestone.status === 'Approved') {
                            const milestoneMonthYear = milestone.deadline.slice(0, 7);

                            // Check for current month earnings
                            if (milestoneMonthYear === currentMonth) {
                                currentMonthEarnings += milestone.budget || 0;
                            }

                            // Check for previous month earnings
                            if (milestoneMonthYear === previousMonthStr) {
                                previousMonthEarnings += milestone.budget || 0;
                            }
                        }
                    });
                }
            });

            const changePercentage = calculateChange(previousMonthEarnings, currentMonthEarnings);

            // Debugging final earnings values
            console.log('Final Earnings:', {
                currentMonth: currentMonthEarnings,
                previousMonth: previousMonthEarnings,
                change: changePercentage
            });

            setTotalEarnings({
                currentMonth: currentMonthEarnings,
                previousMonth: previousMonthEarnings,
                change: changePercentage
            });
        } catch (err) {
            setError('Error fetching contracts');
            console.error('Error fetching contracts:', err);
        }
    };

    fetchContracts();
  }, []);

  // Function to calculate the percentage change
  const calculateChange = (prevValue, currentValue) => {
    if (typeof prevValue !== 'number' || typeof currentValue !== 'number') {
      throw new Error("Both prevValue and currentValue must be numbers.");
    }

    if (prevValue === 0) {
      if (currentValue === 0) {
        return 0;
      }
      return currentValue;
    }

    return ((currentValue - prevValue) / prevValue) * 100;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <OverViewLayout {...blogData } totalEarnings ={totalEarnings} />
      <EngagementGrowth blogs = { blogsInfo } />
      <Engagement {...totals} blogs={blogsInfo} />
      <Brands />
      <Media />
    </>
  );
};

const OverViewLayout = ({ shares, likes, comments, engagement_Rate, reach, totalEarnings, sharesPercent, likesPercent, commentsPercent, engagementChange, visistsChange }) => {
  const getStatus = (percent) => {
    return percent >= 0 ? 1 : 0;
  };
  const earnings = totalEarnings.currentMonth * .90;

  return (
    <div className="bg-white w-full mt-10 rounded-3xl">
      <div className="px-5 py-3 flex flex-col">
        <p className="lato-bold">OverView</p>
        <div className="mt-6">
          <div className="mt-2 grid xs:grid-cols-2 xs:grid-rows-3 gap-y-5 md:grid-cols-3 md:grid-rows-2 gap-y-5">
            <Card
              Heading="Reach"
              totalNumbers={shares}
              Percentage={sharesPercent}
              time="LastMonth"
              Status={getStatus(sharesPercent)}
            />
            <Card
              Heading="Likes"
              totalNumbers={likes}
              Percentage={likesPercent}
              time="LastMonth"
              Status={getStatus(likesPercent)}
            />
            <Card
              Heading="Comments"
              totalNumbers={comments}
              Percentage={commentsPercent}
              time="LastMonth"
              Status={getStatus(commentsPercent)}
            />
            <CardWithImage
              Heading="visits"
              totalNumbers={reach}
              Percentage={visistsChange}
              time="LastMonth"
              ImageSource="card1.png"
            />
            <Card
              Heading="Engagement Rate"
              totalNumbers={engagement_Rate}
              Percentage={engagementChange}
              time="LastMonth"
              Status={getStatus(engagementChange)}
            />
            <CardWithImage
              Heading="Earnings"
              totalNumbers={earnings}
              Percentage={totalEarnings.change}
              time="LastMonth"
              ImageSource="card2.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;