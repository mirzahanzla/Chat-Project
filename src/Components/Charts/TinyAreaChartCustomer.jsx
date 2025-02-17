import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import  './Index.css';


const TinyAreaChartCustomer = ({width,height,strokeColor,StopColor,Status,data}) => {

  return (
   <div 
    className="rounded-chart"
    >
     <ResponsiveContainer className="rounded-full" width={width} height={height}>
    <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="gradient-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
          <stop offset="95%" stopColor={StopColor} stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="gradient-0" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="rgba(190, 6, 6, 0.9)" stopOpacity={0.8} />
        <stop offset="95%" stopColor="rgba(190, 6, 6, 0)" stopOpacity={0} />  </linearGradient>
      </defs>
      
      <Tooltip />
      <Area type="monotone" dataKey="month" stroke={strokeColor} fill={`url(#gradient-${Status})`} />
      <Area type="monotone" dataKey="pending" stroke={strokeColor} fill={`url(#gradient-${Status})`} />
    </AreaChart>
  </ResponsiveContainer>
   </div>
  );
};

export default TinyAreaChartCustomer;
