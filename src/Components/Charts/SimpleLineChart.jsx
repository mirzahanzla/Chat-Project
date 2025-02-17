import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          padding={{ left: 30, right: 30 }}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tickCount={4}
        />
        <Tooltip />
        <Line type="monotone" dataKey="Likes" stroke="blue" fill="url(#gradient-1)" dot={false} />
        <Line type="monotone" dataKey="Comments" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="Visits" stroke="#ff7300" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimpleLineChart;