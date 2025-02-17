import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCampaign = ({onClose}) => {
  const [dealImage, setDealImage] = useState(null);
  const [campaignDes, setCampaignDes] = useState('');
  const [taskDes, setTaskDes] = useState('');
  const [category, setCategory] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [engagementRate, setEngagementRate] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


  const handleImageDivClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setDealImage(file);
      setError(''); // Clear any previous image-related errors
    } else {
      setError('Please upload a valid image file.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    // Validate that required fields are not empty
    if (!dealImage || !campaignDes || !taskDes || !category || !platform || !engagementRate || !budget) {
      setError('Please fill all the required fields.');
      setLoading(false);
      return;
    }

    // Validate engagement rate (greater than 1.5 and less than 15)
    if (engagementRate < 1.5 || engagementRate > 15) {
      setError('Engagement rate must be greater than 1.5 and less than 15.');
      setLoading(false);
      return;
    }

    // Validate budget (greater than 200 and less than 10,000)
    if (budget < 200 || budget > 10000) {
      setError('Budget must be greater than 200 and less than 10,000.');
      setLoading(false);
      return;
    }

    // Validate task description and campaign description length (greater than 250 and less than 1000)
    if (taskDes.length <= 250 || taskDes.length >= 1000) {
      setError('Task description must be greater than 250 and less than 1000 characters.');
      setLoading(false);
      return;
    }

    if (campaignDes.length <= 250 || campaignDes.length >= 1000) {
      setError('Campaign description must be greater than 250 and less than 1000 characters.');
      setLoading(false);
      return;
    }

    // Prepare form data without followers count
    const formData = new FormData();
    formData.append('blogMainImg', dealImage); // Append image file
    formData.append('campaignDes', campaignDes);
    formData.append('taskDes', taskDes);
    formData.append('category', category);
    formData.append('platform', platform);
    formData.append('engagementRate', engagementRate);
    formData.append('budget', budget);

    try {
      const response = await axios.post('/Brand/addCampaign', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add your token or authorization header here
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(-1); // Go back to the previous page
      }, 1000); // Delay to show success message
    } catch (err) {
      console.error(err);
      setError('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className='bg-[#E3E3E3]    flex items-center justify-center absolute  top-0 w-full h-fit pb-10'>

        <div className="pt-5 w-full max-w-xl mx-auto h-fit px-4   top-0 ">
          <div className="p-6 sm:p-8 rounded-lg border-2 bg-white shadow-lg">
            <div className="flex justify-between">
            <h1 className="text-2xl font-semibold mb-4">Create Campaign</h1>
            <div className="hover:cursor-pointer" onClick={() => { onClose(0) }}>
              <img src="/Svg/Close.svg" alt="Close" />
            </div>
            </div>
            {success && <div className="bg-green-200 text-green-800 p-2 rounded mb-4">Campaign created successfully!</div>}
            {error && <div className="bg-red-200 text-red-800 p-2 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className='flex justify-between  gap-2 items-center'>




                {/* Budget and Engagement Rate */}
                <div className="flex  justify-between flex-col gap-4 mb-6 shrink-0 w-2/3 ">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm mb-2">Engagement Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={engagementRate}
                      onChange={(e) => setEngagementRate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm mb-2">Budget</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>


                {/* Image Area */}
                {/* Image Area */}
                <div
                  className={`flex-none w-24 h-24 border-2 border-dashed rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-100`}
                  onClick={handleImageDivClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {dealImage ? (
                    <img
                      src={URL.createObjectURL(dealImage)}
                      alt="Deal"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <p className="text-gray-500 text-xs text-center">Click to upload</p>
                  )}
                </div>



              </div>
              {/* Category and Platform */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Watches">Watches</option>
                    <option value="Shampoo">Shampoo</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-2">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
              </div>

              {/* Task and Campaign Description */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm mb-2">Task Description</label>
                <textarea
                  value={taskDes}
                  onChange={(e) => setTaskDes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md resize-none"
                  required
                  style={{ height: '100px' }} // Fixed height
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Campaign Description</label>
                <textarea
                  value={campaignDes}
                  onChange={(e) => setCampaignDes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md resize-none"
                  required
                  style={{ height: '100px' }} // Fixed height
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </form>
          </div>
        </div>


      </div>

    </>
  );
};

export default CreateCampaign;