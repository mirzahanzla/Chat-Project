import { useState, useEffect } from 'react';
import { DropdownSvg } from '../../../../../Components/Svg/DropDownSvg';
// import axios from 'axios';
import RequestDeal from '../BrandDeals/RequestDeal';

const Deals = () => {
  const [ShowDeal, setShowDeal] = useState(0);
  const [brandData, setBrandData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedbudget, setSelectedbudget] = useState('budget');
  const [showRequestDeal, setShowRequestDeal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(''); // State for verification message

  const navItems = ['Category', 'Watches', 'Crypto', 'Clothing'];
  const budget = ['budget', '0-100$', '100-500$', '500-1000$', '1000$ +'];

  const fetchDeals = () => {
    setLoading(true);
    setVerificationMessage(''); // Reset message before each fetch

    const authToken = localStorage.getItem('authToken');

    fetch('/api/deals', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 403) {
          // Set verification message if 403 status is returned
          setVerificationMessage('Please verify your profile first to view deals');
          return null; // Exit early if forbidden
        }
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setBrandData(data);
          setFilteredData(data); // Initialize filteredData with all deals
        }
      })
      .catch(error => console.error('Error fetching deals:', error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeals();
  }, [success]);

  useEffect(() => {
    const filterData = () => {
      let filtered = brandData;

      if (selectedCategory !== 'Category') {
        filtered = filtered.map(brand => ({
          ...brand,
          deals: brand.deals.filter(deal => deal.category === selectedCategory)
        })).filter(brand => brand.deals.length > 0);
      }

      if (selectedbudget !== 'budget') {
        const budgetRanges = {
          '0-100$': [0, 100],
          '100-500$': [100, 500],
          '500-1000$': [500, 1000],
          '1000$ +': [1000, Infinity]
        };
        const [minbudget, maxbudget] = budgetRanges[selectedbudget] || [0, Infinity];

        filtered = filtered.map(brand => ({
          ...brand,
          deals: brand.deals.filter(deal => deal.budget >= minbudget && deal.budget <= maxbudget)
        })).filter(brand => brand.deals.length > 0);
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [selectedCategory, selectedbudget, brandData]);

  const handleRequestDeal = (dealID) => {
    setSelectedDeal(dealID);
    setShowRequestDeal(true);
  };

  return (
    <>
      {showRequestDeal && selectedDeal && (
        <RequestDeal
          dealID={selectedDeal}
          onClose={() => {
            setShowRequestDeal(false);
            setSuccess(prev => !prev);
          }}
        />
      )}

      {ShowDeal ? (
        <ShowDealPost
          setShowDeal={setShowDeal}
          deal={ShowDeal}
          onRequest={() => handleRequestDeal(ShowDeal._id)}
        />
      ) : (
        <div className="h-screen text-[9px] xs:text-[10px] sm:text-[10px] md:text-[11px]">
          <div className="flex justify-start mt-5 ml-10 gap-x-3 md:text-[11px]">
            <Dropdown
              key={1}
              items={navItems}
              initialValue="Category"
              onChange={setSelectedCategory}
            />
            <Dropdown
              key={2}
              items={budget}
              initialValue="budget"
              onChange={setSelectedbudget}
            />
          </div>

          <div className="mt-5 space-y-10">
            {loading ? (
              <p className="text-center">Loading deals...</p>
            ) : verificationMessage ? (
              <p className="text-center text-red-500">{verificationMessage}</p> // Display verification message
            ) : filteredData.length > 0 ? (
              filteredData.map((brand, index) =>
                brand.deals.map((deal, dealIndex) => (
                  <Deal
                    key={`${index}-${dealIndex}`}
                    deal={{
                      _id: deal._id,
                      brandImage: brand.brandImage,
                      brandName: brand.brandName,
                      dealImage: deal.dealImage,
                      campaignDes: deal.campaignDes,
                      category: deal.category,
                      budget: deal.budget,
                      platform: deal.platform,
                      taskDes: deal.taskDes,
                      followers: deal.followers,
                      userStatuses: deal.userStatuses,
                      engagement_Rate: deal.engagement_Rate,
                    }}
                    onClick={() => setShowDeal(deal)}
                    onRequest={() => handleRequestDeal(deal._id)}
                  />
                ))
              )
            ) : (
              <p className="text-center">No deals available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Dropdown = ({ items, initialValue, onChange }) => {
  const [isOpen, setIsOpen] = useState([0, initialValue]);

  const handleSelect = (item) => {
    setIsOpen([0, item]);
    onChange(item);
  };

  return (
    <div className="flex items-center flex-col poppins-semibold rounded-xl bg-white relative">
      <div
        className="px-2 py-1 sm:p-2 flex justify-between w-[100px] sm:w-[120px] items-center relative"
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}>
        <div>{isOpen[1]}</div>
        <DropdownSvg />
      </div>
      {isOpen[0] ? (
        <ul className="poppins-regular flex gap-y-2 flex-col mt-2 absolute top-10 bg-white w-full p-2 rounded-xl">
          {items.map((item, index) =>
            isOpen[1] !== item ? (
              <li key={index} className="dropdown-item" onClick={() => handleSelect(item)}>
                {item}
              </li>
            ) : null
          )}
        </ul>
      ) : ""}
    </div>
  );
};

const Deal = ({ deal, onClick , onRequest}) => {

  return (
    <div className="flex xs:flex-col mdm:flex-row w-[250px] xs:w-[450px] sm:w-[550px] mdm:w-[600px] md:w-[700px] lg:w-[900px] mx-auto bg-white overflow-hidden rounded-xl">
      <div
  className="hidden  h-full mdm:flex mdm:h-[200px] mdm:w-[500px] md:h-[200px] md:w-[300px] md:items-center justify-center shrink-0"
>
  <div className="flex items-center justify-center h-full w-full">
    <img
      className="Avatar-v1 object-contain"
      // src='https://picsum.photos/300/500'
      src={deal.dealImage}
      alt=""
    />
  </div>
</div>

      <div className="ml-5 pt-2 pr-2">
        <div className="flex gap-x-2 items-center">
          <div className="flex items-center size-[35px] sm:size-[50px]">
            <img className="aspect-square Avatar" src={deal.brandImage} alt="" />
          </div>
          <div className="poppins-regular text-[7px] sm:text-[10px] mdm:text-[12px]">
            <p className="poppins-semibold">{deal.brandName}</p>
          </div>
        </div>
        <div className="text-black/60 poppins-semibold mt-1">
          <p>{deal.campaignDes}</p>
        </div>
        <div className="hidden xs:flex gap-2 mt-2 mb-2 poppins-semibold">
          <p className='SilverButtonWithText-v1 cursor-pointer'>{deal.category}</p>
        </div>
        <div className="flex justify-between mx-2 items-center pb-2 mt-2 text-center poppins-semibold">
          <div>
            <p>Campaign Budget</p>
            <p className='GreenButtonWithText-v1 py-2 cursor-pointer pt-2'>${deal.budget}</p>
          </div>
          <div className="flex space-x-2">
            <div className="OrangeButtonBorder text-primary mt-2 xs:mt-0 flex items-center cursor-pointer" onClick={onClick}><p>View Deal</p></div>
            <div className={`OrangeButtonWithText mt-2 xs:mt-0 flex items-center cursor-pointer`} onClick={onRequest}>
              <p>Request Deal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowDealPost = ({ setShowDeal, deal, onRequest }) => {

  if (!deal) {
    console.log("deal is empty", deal);
    return;
  }
  return (
    <>
      <div className="bg-white mdm:w-[700px] md:w-[800px] lg:w-[900px] rounded-xl mx-auto mt-2 p-2 pr-5 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
        <div className="flex justify-end h-[34px] space-x-3">
          <div className="OrangeButtonWithText-v4 flex items-center cursor-pointer" onClick={onRequest}>
            <p>Request Deal</p>
          </div>
          <img src="/Svg/Close.svg" alt="" className="cursor-pointer" onClick={() => setShowDeal(0)} />
        </div>
        <div className="mt-10 w-[300px] flex mdm:h-[200px] mdm:w-[500px] md:h-[300px] md:w-[500px] mx-auto overflow-hidden md:items-center justify-center">
          <img className="aspect-square Avatar-v1" src={deal.dealImage} alt="" />
        </div>
        <div className="ml-5 xs:ml-10 sm:ml-24 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
          <p className="poppins-semibold mt-5">OverView</p>
          <div className="DealsBorder">
            <p className="text-black/50">Platform</p>
            <p className="font-medium">{deal.platform}</p>
          </div>
          <div className="DealsBorder">
            <p className="text-black/50">Campaign Description</p>
            <p className="font-medium">{deal.campaignDes}</p>
          </div>
          <div className="DealsBorder">
            <p className="text-black/50">Task Description</p>
            <p className="font-medium">{deal.taskDes}</p>
          </div>
          <p className="poppins-semibold mt-5 text-[14px]">Influencer Requirements</p>
          <div className="grid gap-x-11 xs:w-[300px] sm:w-[500px] md:w-[650px]">
            <div className="DealsBorder flex">
              <p className="text-black/50 w-[200px]">Engagement Rate</p>
              <p className="font-medium">{deal.engagement_Rate}%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deals;