import { useState, useEffect } from 'react';
import axios from 'axios';
import SimpleCard from "../../../../../Components/Card/SimpleCard";
import './Index.css';

const Brands = () => {
  const [brandData, setBrandData] = useState([]);
  const [hasData, setHasData] = useState(true); // Track if there's data to show

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('No authToken found in local storage');
          return;
        }
        const response = await axios.get('/api/getDealsByUserID', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data;
        setBrandData(data);
        setHasData(data.length > 0); // Set hasData based on the response
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };
    fetchDeals();
  }, []);

  // Flatten brandData to deals array
  const deals = hasData ? (brandData || []).flatMap(brand => (brand.deals || []).map(deal => ({ ...deal, brandName: brand.brandName }))) : [];

  const totalDeals = deals.length;
  const requested = deals.filter(deal => deal.userStatuses.some(status => status.status === 'Requested')).length;
  const approved = deals.filter(deal => deal.userStatuses.some(status => status.status === 'Approved')).length;
  const invited = deals.filter(deal => deal.userStatuses.some(status => status.status === 'Invited')).length;

  return (
    <>
      <div className="bg-white w-full mt-10 rounded-3xl" id='Influencers'>
        <div className="px-5 py-5 flex flex-col">
          <p className="lato-bold text-lg">Deals</p>
          <div className="mt-6">
            {/* Render a message if there's no data */}
            {!hasData ? (
              <p className="text-center mt-5">No Data to show yet!</p>
            ) : (
              <>
                <div className="mt-2 grid gap-x-5 gap-y-5 xs:grid-cols-2 xs:grid-rows-1 sm:gap-y-5 md:grid-cols-4 md:grid-rows-1 justify-center items-center">
                  <SimpleCard name="Total Deals" price={totalDeals}/>
                  <SimpleCard name="Approved" price={approved}/>
                  <SimpleCard name="Invited" price={invited}/>
                  <SimpleCard name="Requested" price={requested}/>
                </div>
                <p className="lato-regular mt-12 ml-7">My Deals Report</p>
                <div className="rounded-xl lato-regular text-[10px] mdm:text-base pt-3 mt-5 scroll-container">
                  <div className="p-1 rounded-lg">
                    <div className="w-full grid grid-cols-12 gap-x-8 gap-y-4 auto-rows-fr text-center border-b-2 pt-5 pb-3 border-t-2">
                      <div className="col-span-3 text-center">
                        <p className="lato-bold text-lg">Brand</p>
                      </div>
                      <div className="col-span-1">
                        <p className="lato-bold text-lg">%ER</p>
                      </div>
                      <div className="col-span-2">
                        <p className="lato-bold text-lg">Budget</p>
                      </div>
                      <div className="col-span-1">
                        <p className="lato-bold text-lg">Category</p>
                      </div>
                      <div className="col-span-1">
                        <p className="lato-bold text-lg">Status</p>
                      </div>
                    </div>
                    {deals.slice(0, 3).map((deal, index) => (
                      <TableRows
                        key={index}
                        name={deal.brandName}
                        img={deal.dealImage}
                        Er={deal.engagement_Rate}
                        Budget={deal.budget}
                        category={deal.category}
                        Status={deal.userStatuses[0].status} // Assuming the first status is representative
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const TableRows = ({ name, img, Er, Budget, category, Status }) => {
  return (
    <div className="w-full grid grid-cols-12 auto-rows-fr text-center mt-5 gap-x-8 gap-y-4 border-b-2 pb-2 IsBorder">
      <div className="col-span-3 text-center">
        <div className="flex items-center justify-center gap-x-3">
          <img className='size-[35px] Avatar' src={img} alt={name} />
          <p>{name}</p>
        </div>
      </div>
      <div className="col-span-1 text-center">
        <p className="p-1">{Er}%</p>
      </div>
      <div className="col-span-2">
        <p className="p-1">${Budget}</p>
      </div>
      <div className="col-span-1">
        <p className="p-1">{category}</p>
      </div>
      <div className="col-span-1 pr-2">
        <p className="p-1">{Status}</p>
      </div>
    </div>
  );
};

export default Brands;