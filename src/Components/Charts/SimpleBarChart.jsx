import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SimpleBarChart = ({ data }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          <defs>
            <linearGradient id="gradient-pv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="gradient-uv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            padding={{ left: 30, right: 30 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickCount={5}
            domain={[0, 'auto']} // Ensures that the Y-axis starts from 0
          />
          <Tooltip />
          <Bar 
            dataKey="Likes" 
            stroke="#8884d8" 
            fill="url(#gradient-pv)" 
            minPointSize={1} // Minimum height for bars
          />
          <Bar 
            dataKey="Comments" 
            stroke="#82ca9d" 
            fill="url(#gradient-uv)" 
            minPointSize={1} // Minimum height for bars
          />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', padding: '10px' }}>
        <Legend verticalAlign="top" align="center" iconType="rect" />
      </div>
    </div>
  );
};

export default SimpleBarChart;