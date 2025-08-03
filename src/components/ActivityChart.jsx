import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts'
import '../assets/styles/charts.css'

// A more modern and accessible color palette
const CHART_COLORS = ['#007aff', '#ff9500', '#34c759', '#ff3b30', '#5856d6', '#ff2d55'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const total = payload[0].payload.total; // Assuming total is passed in data
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`${name}`}</p>
        <p className="tooltip-value">{`${percent}% (${value} mins)`}</p>
      </div>
    );
  }
  return null;
};

const ActivityChart = ({ data }) => {
  const totalTime = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map(item => ({ ...item, total: totalTime }));

  if (data.length === 0) {
    return <div className="chart-empty">No activity data yet.</div>;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60} // Donut chart
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            formatter={(value, entry) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ActivityChart
