import { useEffect, useState } from "react";

const Brand = ({ getValue, row, column, table }) => {
    const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;
  const initialValue = getValue();
  console.log('Brand Data:', initialValue);

  const [brandData, setBrandData] = useState(null);

  useEffect(() => {
    async function fetchBrandData(dealID) {
        
        try {
          const response = await fetch(`${url}/support/deal/${dealID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
      
          const brandData = await response.json();
          console.log('Brand Data:', brandData);
          return brandData;
      
        } catch (error) {
          console.error('Failed to fetch brand data:', error);
        }
      }
      
      // Example usage:
      fetchBrandData('yourDealIDHere');
      
    async function getBrandData() {
      const data = await fetchBrandData(initialValue);
      setBrandData(data);
    }
    
    if (initialValue) {
      getBrandData();
    }
  }, [initialValue]);

  if (!brandData) {
    return <div>Loading...</div>;
  }

  return (
    <div className=' flex  my-3 text-[9px] sm:text-[10px] mdm:text-[12px] w-[150px] '>

    <img className=' hidden sm:block size-[35px] Avatar' src={`${brandData.brandImage}`} alt="" />
    <div className=' flex flex-1 flex-col  ml-2'>
      <div className='flex flex-1 justify-between  items-center'>
        <p className='poppins-semibold '>{brandData.brandName}</p>
      </div>
      <div className='flex justify-between  text-black/50  text-[10px]'>
        <p>@{brandData.brandName}</p>
      
      </div>
    </div>
  </div>
  );
};

export default Brand;
