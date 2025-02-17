
import { useNavigate } from 'react-router-dom';
import TaskTable from '../../../../../Components/Table/TaskTable';
import useFetch from '../../../../../Hooks/useFetch';
import FetchData from '../../../../../Components/Table/FetchData';
import FetchWithDraw from '../../../../../Components/Table/FetchWithDraw';
import FetchContactUs from '../../../../../Components/Table/FetchContactUs';

// import FetchPaymentData from '../../../../../Components/Table/FetchPaymentData';
// import FetchInfluencerData from '../../../../../Components/Table/FetchInfluencerData';



const ContactUs = () => {
 

  return (
    <>
      {/* Top bar total posted ,active comapign */}
      <div className="py-5 mx-5  mdm:mx-auto mdm:w-[800px]     ">


        <p className="lato-bold  mt-5">Contact Us </p>



        <FetchContactUs />

      </div>



    </>
  )
}

export default ContactUs