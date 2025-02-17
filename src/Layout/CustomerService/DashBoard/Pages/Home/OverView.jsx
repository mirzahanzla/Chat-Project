import './Index.css';
import Card from "../../../../../Components/Card/Card";
import CardWithImage from "../../../../../Components/Card/CardWithImage";
import CustomPieChart from "../../../../../Components/Charts/CustomPieCharts";
import useFetch from '../../../../../Hooks/useFetch';
import CardCustomer from '../../../../../Components/Card/CardCustomer';

const OverView = () => {

  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;
  const { data, loading, error } = useFetch(`${url}/Support/Statistics/OverView`);



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("darta is")
  // console.log(data)
  return (
    <>
      <>

        <OverViewLayout data={data} />
        <div className="my-10 flex " >
          <ActivePercentage />
        </div>
      </>
    </>
  )
}


const OverViewLayout = ({ data }) => {
  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;

  const { data:data2, loading, error } = useFetch(`${url}/Support/api/months`);
  console.log("data is ")
  console.log(data2)

  console.log('data2is ')
  console.log(data2)

  return <>
    <div className="bg-white w-full   mt-10 rounded-3xl">

      <div className="px-5 py-3 flex flex-col">

        <p className="lato-bold ">OverView</p>
        {/* <div className="mt-6  bg-red-500 xs:bg-green-500 mdm:bg-red-500 md:bg-blue-500 lg:bg-red-500"> */}
        <div className="mt-6 ">

          <div className="mt-2 grid xs:grid-cols-2 xs:grid-rows-3 gap-y-5  md:grid-cols-3 md:grid-rows-1  gap-y-5 ">
            <CardCustomer Heading="Total Queries" totalNumbers={data.totalQueries} Percentage={data.totalQueriesPercentage} time="LastMonth" Status={data.totalQueriesStatus?1:0} data2={data2} />
            <CardCustomer Heading="Pending" totalNumbers={data.pendingQueries} Percentage={data.pendingPercentage} time="LastMonth" Status={data.pendingStatus?1:0}data2={data2} />
            <CardWithImage Heading="Resolve" totalNumbers={data.resolvedQueries} Percentage={data.resolvedPercentage} time="LastMonth" ImageSource="card2.png" />          </div>
        </div>

      </div>
    </div>
  </>

}



const ActivePercentage = () => {
  const url = `${import.meta.env.VITE_SERVER_BASE_URL}`;
  const { data, loading, error } = useFetch(`${url}/Support/Statistics`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  const data1 = [
    { name: 'Pending', value: data.Pending },
    { name: 'Progress', value: data.Progress },

  ];

  const COLORS = {
    Pending: '#7459D9', // Indigo
    Progress: '#927EDF',  // Green

  };
  
  console.log("data is")
  console.log(data)
  return (<>
    <CustomPieChart data1={data} />
    <div className="poppins-regular ml-20 w-full ">



      <div className="poppins-semibold">
        Active Percentage
      </div>


      <div className="flex mt-10  items-center gap-x-2">
        <p className="text-xl poppins-semibold">  {data.Pending||0 + data.Progress||0}</p>
        <p className="text-[14px]  text-gray-400">Total</p>
      </div>

      <div className="mx-10 mt-4">
        <div className="bg-[#C5BBEC] w-full h-[20px] rounded-full">
          <div className="bg-[#7459D9] w-[100px] h-[20px] rounded-full">

          </div>
        </div>
      </div>



      <div className="mt-5 flex justify-center gap-x-4">
        {data1.map((entry, index) => (
          <div key={index} className="flex items-start text-gray-700 ">
            <span
              className="inline-block w-10 rounded-full h-1 mr-2 mt-2"
              style={{ backgroundColor: COLORS[entry.name] }}
            ></span>
            <div className='flex text-start  flex-col'>
              <span className="capitalize text-startb">{entry.name}</span>
              <span className="text-[12px] font-bold ">{entry.value ||0}  </span>
            </div>
          </div>
        ))}
      </div>


    </div>
  </>)
}




export default OverView