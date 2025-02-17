import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';


const Predict = ({ onCloseIssue, User }) => {
    const [isSupportOpen, setIsSupportOpen] = useState(true);
 
    const slideIn = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '100%', opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isSupportOpen && (
                <div className='bg-neutral-300/65 z-20 absolute right-0'>
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
                                    <div className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]" >
                                        <p>Withdrawal</p>
                                    </div>
                                </div>
                                {/*add start  */}
<PredictNew/>
                                {/* add finish */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

        </AnimatePresence>
    );
};


const PredictNew = () => {
    const [inputData, setInputData] = useState({
      follower_count: '',
      Engagement_Rate: '',
      minReach: 500, 
      maxReach: 50000,
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showInfluencerProfile, setShowInfluencerProfile] = useState(false);
  
    const minLimit = 500;
    const maxLimit = 250000;
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setInputData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
    
      // Reset previous prediction and profile data
      setPrediction(null);
      setShowInfluencerProfile(false);
    
      // Validate inputs before submitting
      const { follower_count, Engagement_Rate, minReach, maxReach } = inputData;
    
      // Follower count validation (between 200K and 20M)
      if (follower_count < 150000 || follower_count > 20000000 || !Number.isInteger(Number(follower_count))) {
        setError('Follower count must be between 150K and 20M and must be an integer.');
        setLoading(false);
        return;
      }
    
      // Engagement rate validation (between 1.5 and 10.0)
      if (Engagement_Rate < 1.5 || Engagement_Rate > 10.0 || isNaN(Engagement_Rate)) {
        setError('Engagement rate must be between 1.5 and 10.0.');
        setLoading(false);
        return;
      }
    
      // Min reach validation (between 500 and 20K)
      if (minReach < 500 || minReach > 20000) {
        setError('Min reach must be between 500 and 20K.');
        setLoading(false);
        return;
      }
    
      // Max reach validation (between 1K and 250K, and min reach < max reach)
      if (maxReach < 1000 || maxReach > 250000) {
        setError('Max reach must be between 1K and 250K.');
        setLoading(false);
        return;
      }
    
      if (minReach >= maxReach) {
        setError('Min reach must be less than max reach.');
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', inputData);
        setPrediction(response.data.prediction);
      } catch (err) {
        setError('Error fetching prediction data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };  
  
    const handleRangeChange = (e, type) => {
      const value = Number(e.target.value);
    
      // If changing minReach, make sure it doesn't exceed 20,000 or surpass maxReach
      if (type === 'min') {
        if (value > 20000) {
          setInputData((prevData) => ({ ...prevData, minReach: 20000 }));
        } else if (value >= inputData.maxReach) {
          setInputData((prevData) => ({ ...prevData, minReach: inputData.maxReach - 1 }));
        } else {
          setInputData((prevData) => ({ ...prevData, minReach: value }));
        }
      } else if (type === 'max' && value > inputData.minReach) {
        setInputData((prevData) => ({ ...prevData, maxReach: value }));
      }
    
      // Add the check to ensure minReach is always below maxReach
      if (inputData.minReach >= inputData.maxReach) {
        setInputData((prevData) => ({ ...prevData, minReach: inputData.maxReach - 1 }));
      }
    };  
  
    const formatNumberForDisplay = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      } else {
        return num;
      }
    };
  
    return (
      <>
        {showInfluencerProfile ? (
          <InfluencerProfile setShowInfluencerProfile={setShowInfluencerProfile}
          userName={prediction[0]} />
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-gray-50">
            <h1 className="text-4xl font-bold mb-5 text-center">Predict Engagement Rates</h1>
  
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="follower_count">
                  Followers
                </label>
                <input
                  type="number"
                  name="follower_count"
                  id="follower_count"
                  value={inputData.follower_count}
                  onChange={handleChange}
                  className="shadow-md appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter followers count"
                  required
                />
              </div>
  
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Reach (Min - Max)</label>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formatNumberForDisplay(inputData.minReach)}</span>
                  <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={inputData.minReach}
                    onChange={(e) => handleRangeChange(e, 'min')}
                    className="w-full mx-2"
                  />
                  <span className="font-medium">{formatNumberForDisplay(inputData.maxReach)}</span>
                  <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={inputData.maxReach}
                    onChange={(e) => handleRangeChange(e, 'max')}
                    className="w-full mx-2"
                  />
                </div>
              </div>
  
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Engagement_Rate">
                  Engagement Rate
                </label>
                <input
                  type="number"
                  name="Engagement_Rate"
                  id="Engagement_Rate"
                  value={inputData.Engagement_Rate}
                  onChange={handleChange}
                  className="shadow-md appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter engagement rate"
                  required
                />
              </div>
  
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                >
                  Predict
                </button>
              </div>
            </form>
  
            {loading && <p className="text-blue-600">Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {prediction && prediction.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xl font-semibold">Prediction Result:</h2>
                <p className="text-gray-800">{JSON.stringify(prediction)}</p>
                <ProfileReport 
                  userName={prediction[0]}
                  setShowInfluencerProfile={setShowInfluencerProfile} 
                />
              </div>
            )}
          </div>
        )}
      </>
    );
  };
  
  const ProfileReport = ({ userName, setShowInfluencerProfile }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (userName) {
        const fetchReport = async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await axios.get(`/Brand/getPredicitedReport/${userName}`);
            setReportData(response.data);
          } catch (err) {
            setError('Error fetching report data');
          } finally {
            setLoading(false);
          }
        };
  
        fetchReport();
      }
    }, [userName]);
  
    const formatFollowerCount = (count) => {
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
      } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
      }
      return count;
    };
  
    if (loading) return <p className="text-blue-600">Loading report...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
  
    return (
      <div className="mt-5">
        <h2 className="text-xl font-semibold">Profile Report:</h2>
        {reportData ? (
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
            <p><strong>Full Name:</strong> {reportData.fullName}</p>
            <p><strong>Username:</strong> @{reportData.Name}</p>
            <p><strong>Followers:</strong> {formatFollowerCount(reportData.FollowerCount)}</p>
            <p><strong>Avg. Engagement Rate:</strong> {(reportData.AvgEngagementRate * 100).toFixed(2)}%</p>
            <button 
              onClick={() => setShowInfluencerProfile(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              View Detailed Report
            </button>
          </div>
        ) : (
          <p>No report data available.</p>
        )}
      </div>
    );
  };
  

export default Predict;
