import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import  './Index.css';
const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const TinyAreaChart = ({width,height,strokeColor,StopColor,Status}) => {
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
      <Area type="monotone" dataKey="uv" stroke={strokeColor} fill={`url(#gradient-${Status})`} />
    </AreaChart>
  </ResponsiveContainer>
   </div>
  );
};

export default TinyAreaChart;
