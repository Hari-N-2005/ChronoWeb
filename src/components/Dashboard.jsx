import ActivityChart from './ActivityChart'
import DomainList from './DomainList'
import StatsCard from './StatsCard'
import useActivityData from '../hooks/useActivityData'
import '../assets/styles/dashboard.css'

const Dashboard = () => {
  const { activityData, totalTime, isLoading } = useActivityData()

  if (isLoading) {
    return <div className="loading">Loading data...</div>
  }

  // Calculate stats
  const totalHours = Math.floor(totalTime / 3600);
  const totalMinutes = Math.floor((totalTime % 3600) / 60);
  const formattedTime = `${totalHours}h ${totalMinutes}m`;

  return (
    <main className="dashboard-content">
      <div className="stats-grid">
        <StatsCard 
          title="Total Time Tracked"
          value={formattedTime}
        />
        <StatsCard 
          title="Websites Tracked" 
          value={activityData.length} 
        />
      </div>
      
      <ActivityChart data={activityData} />
      
      <DomainList data={activityData} />
    </main>
  )
}

export default Dashboard;