import TinyAreaChart from '../Charts/TinyAreaChart';

const Card = ({ Heading, totalNumbers, Status, Percentage, time }) => {
  // Determine the chart color based on the status
  const chartColor = Status ? ['#0A9B21', '#8884d8'] : ['#FF5E5E', '#FF5E5E'];

  return (
    <div className="text-[10px] w-[160px] h-[120px] mdm:w-[250px] mdm:h-[170px] bg-white rounded-2xl flex flex-col OverViewBox1 justify-self-center">
      <div className="px-3 py-1 mdm:px-4 mdm:py-2 lato-regular">
        <p className="lato-regular text-sm mdm:text-xl">{Heading}</p>
        <p className={`text-sm mdm:text-xl ${Status ? "text-green-500" : "text-red-500"}`}>
          {totalNumbers}
        </p>
        <div className="mdm:ml-5 lato-regular mdm:mt-2">
          <p>
            {/* Display up or down arrow based on status */}
            <span className={`${Status ? 'text-green-500' : 'text-red-500'} text-sm`}>
              {Status ? '↑' : '↓'}
            </span>
            <span className={`${Status ? 'text-green-500' : 'text-red-500'} text-sm`}>
              {Percentage} %
            </span>
            <span className="text-gray-400 text-sm"> vs {time}</span>
          </p>
        </div>
      </div>
      <TinyAreaChart 
        Status={Status} 
        width="100%" 
        height="100%" 
        strokeColor={chartColor[0]} 
        stopColor={chartColor[1]} 
      />
    </div>
  );
};

export default Card;