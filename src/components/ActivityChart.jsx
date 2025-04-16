import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts'
import '../assets/styles/charts.css'

const ActivityChart = ({ data, chartType = 'pie' }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  // For displaying custom legend
  const renderCustomLegend = (data) => (
    <ul className="custom-legend">
      {data.map((entry, index) => (
        <li key={`item-${index}`} style={{ color: COLORS[index % COLORS.length] }}>
          <span className="dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
          {entry.name}: {((entry.value / total) * 100).toFixed(1)}%
        </li>
      ))}
    </ul>
  )

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="chart-container">
      {chartType === 'pie' ? (
        <>
          <PieChart width={280} height={280}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          {renderCustomLegend(data)}
        </>
      ) : (
        <BarChart width={300} height={280} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      )}
    </div>
  )
}

export default ActivityChart
