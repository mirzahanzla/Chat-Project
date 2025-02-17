import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleAreaChart = ({ budgets }) => {
  // Get a reversed copy of the budgets array
  const reversedBudgets = [...budgets].reverse();

  // Get the current date
  const currentDate = new Date();
  console.log("Reversed Budgets: ", reversedBudgets);

  // Prepare month names for the last 6 months in chronological order
  const monthNames = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    const monthStr = date.toLocaleString('default', { month: 'short' });
    monthNames.push(monthStr);
  }

  // Prepare data for the chart
  const data = monthNames.map((month, index) => ({
    name: month,  // Month name for the x-axis
    Budget: reversedBudgets[index] || 0,  // Budget for the y-axis
  }));
  console.log("Data prepared: ", data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 10,
        }}
      >
        <defs>
          <linearGradient id="gradient-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#87CEFA" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} padding={{ left: 30, right: 30 }} />
        <YAxis axisLine={false} tickLine={false} tickCount={5} />
        <Tooltip />
        <Area type="monotone" dataKey="Budget" stroke="#0A9B21" fill="url(#gradient-1)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaChart;