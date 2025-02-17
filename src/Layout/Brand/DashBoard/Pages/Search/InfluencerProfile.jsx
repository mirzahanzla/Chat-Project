import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import './Index.css';
import Card from '../../../../../Components/Card/Card';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
// import React from 'react';
Chart.register(...registerables);

const InfluencerProfile = ({ setShowInfluencerProfile, userName }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Utility function to format numbers
    const formatNumber = (num) => {
        if (num >= 1e6) {
            return (num / 1e6).toFixed(3) + ' M'; // Convert to millions
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(3) + ' K'; // Convert to thousands
        } else {
            return num.toFixed(3); // Retain up to 3 decimal places if float
        }
    };

    useEffect(() => {
        // Fetch report data from the API
        const fetchReportData = async () => {
            try {
                const response = await fetch(`/Brand/getReport/${userName}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch report data');
                }
                const data = await response.json();
    
                // Check for the specific message
                if (data.message === "Report not found for this user") {
                    setReportData(null); // or set it to an empty array if preferred
                    setError("No reports for this user yet");
                } else {
                    setReportData(data); // Set the report data if found
                    setError(null); // Clear any previous errors
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
    
        fetchReportData();
    }, [userName]);    

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!reportData) {
        return <p>No report data available for this user.</p>;
    }

    return (
        <>
            <div className="flex justify-end w-[300px] xs:w-[500px] gap-x sm:w-[640px] md:w-[740px] lg:w-[800px] mx-auto pt-3 pb-3 cursor-pointer" onClick={() => setShowInfluencerProfile(0)}>
                <img src="Svg/Close.svg" alt="Close" />
            </div>

            {/* OverView */}
            <div className="w-[300px] xs:w-[550px] sm:w-[700px] mdm:w-[820px] lg:w-[900px] mx-auto">
                <div className="bg-white w-full mt-10 rounded-3xl mx-auto">
                    <div className="px-5 py-3 flex flex-col">
                        <p className="lato-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px]">Overview</p>
                        <div className="mt-6">
                            <div className="mt-2 grid xs:grid-cols-2  gap-y-5 md:grid-cols-3  gap-y-5">
                                <Card Heading="Instagram Followers" totalNumbers={formatNumber(reportData.FollowerCount)} Percentage="" time="Life-time" Status={1} />
                                <Card Heading="Total Engagements" totalNumbers={formatNumber(reportData.SumOfEngagements)} Percentage="" time={`Last ${reportData.NoOfPosts} Posts`} Status={1} />
                                <Card Heading="Posts Count" totalNumbers={reportData.NoOfPosts} Percentage="" time="" Status={1} />
                            </div>
                        </div>
                    </div>
                </div>
                <Engagement reportData={reportData} formatNumber={formatNumber} />
            </div>
        </>
    );
};

const Engagement = ({ reportData, formatNumber }) => {
    const chartData = {
        labels: ['Total Followers', 'Total Likes', 'Total Comments'],
        datasets: [
            {
                label: 'Engagement Metrics',
                data: [
                    reportData.FollowerCount,
                    reportData.SumOfLikes,
                    reportData.SumOfComments
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)', // Total Followers
                    'rgba(54, 162, 235, 0.7)', // Total Likes
                    'rgba(255, 206, 86, 0.7)'   // Total Comments
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', // Total Followers
                    'rgba(54, 162, 235, 1)', // Total Likes
                    'rgba(255, 206, 86, 1)'   // Total Comments
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="bg-white mx-auto mt-10 rounded-3xl">
            <div className="px-5 py-5 flex flex-col">
                <p className="lato-bold text-lg">Engagement</p>
                <div className="mt-6">
                    <div className="mt-2 grid xs:grid-cols-2 xs:grid-rows-1 gap-y-5 md:grid-cols-3 md:grid-rows-1 gap-y-5">
                        <Card Heading="Total Likes" totalNumbers={formatNumber(reportData.SumOfLikes)} Percentage="" time={`Last ${reportData.NoOfPosts} Posts`} Status={1} />
                        <Card Heading="Total Comments" totalNumbers={formatNumber(reportData.SumOfComments)} Percentage="" time={`Last ${reportData.NoOfPosts} Posts`} Status={1} />
                        <Card Heading="Average ER" totalNumbers={`${formatNumber(reportData.AvgEngagementRate * 100)}%`} Percentage="" time={`Last ${reportData.NoOfPosts} Posts`} Status={1} />
                    </div>
                    <p className="lato-regular mt-12 ml-7">Engagement Metrics Overview</p>
                    <div className="border-2 rounded-xl lato-regular text-[10px] mdm:text-base" style={{ width: '100%', height: '400px' }}>
                        <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfluencerProfile;