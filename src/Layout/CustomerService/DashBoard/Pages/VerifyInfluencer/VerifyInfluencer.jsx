
import { useNavigate } from 'react-router-dom';
import TaskTable from '../../../../../Components/Table/TaskTable';
import useFetch from '../../../../../Hooks/useFetch';
import FetchData from '../../../../../Components/Table/FetchData';
import FetchPaymentData from '../../../../../Components/Table/FetchPaymentData';
import FetchInfluencerData from '../../../../../Components/Table/FetchInfluencerData';

const VerifyInfluencer = () => {
  const navigate = useNavigate();

  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;
  const { data, loading, error } = useFetch(`${url}/Support/Statistics`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;



  const data1 = [
    { name: 'Contract', value: parseInt(data.Contract) },
    { name: 'Payment', value: parseInt(data.Payment)},
    { name: 'Account', value:parseInt(data.Account )},
    { name: 'Others', value: parseInt(data.Others)},
  ];



  const totalUsers = data1.reduce((acc, item) => acc + item.value, 0);


 
  return (
    <>
      {/* Top bar total posted ,active comapign */}
      <div className="py-5 mx-5  mdm:mx-auto mdm:w-[800px]     ">

        {/* Information bar of whole campaign */}

        <div className="px-2 py-3 sm:py-7 rounded-2xl border-2 bg-white  flex justify-around items-center ">

          <div className="mr-1" >
            <p className="text-black/50 poppins-regula text-[7px] sm:text-[10px] mdm:text-[12px]">Total Verified</p>
            <div className="flex justify-between">
              <p className="poppins-semibold text-[7px] sm:text-[10px] mdm:text-[12px]"><span className="text-primary">{totalUsers}</span> </p>
            </div>
          </div>

          {/* Left border */}
          <div className=" border-l-2  h-[30px]"></div>

          <div className="pl-1 mdm:pl-10  flex flex-col items-center ">
            <p className="text-black/50 poppins-regular text-[7px] sm:text-[10px] mdm:text-[12px] ">Progress</p>
            <p className="poppins-semibold text-[7px] sm:text-[10px] mdm:text-[12px]">{data.Progress}</p>
          </div>

           {/* Left border */}
          <div className=" border-l-2  h-[30px]"></div>

          <div className=" pl-1 mdm:pl-10 flex flex-col items-center text-[7px] sm:text-[10px] ">
            <p className="text-black/50 poppins-regular  mdm:text-[12px]">Pending</p>
            <p className="poppins-semibold mdm:text-[12px]">{data.Pending}</p>
          </div>

         

        </div>

        <p className="lato-bold  mt-5">Verify Influencer </p>
      
       
       {/* <FetchPaymentData/> */}

<FetchInfluencerData/>

       
      </div>

      

    </>
  )
}

export default VerifyInfluencer