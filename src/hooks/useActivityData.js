import { useState, useEffect } from 'react'
import { formatDomainData } from '../utils/chartUtils'

const useActivityData = () => {
  const [activityData, setActivityData] = useState([])
  const [totalTime, setTotalTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await chrome.storage.local.get('websiteActivity')
        if (data.websiteActivity) {
          const formattedData = formatDomainData(data.websiteActivity)
          setActivityData(formattedData)
          
          const total = formattedData.reduce((sum, item) => sum + item.value, 0)
          setTotalTime(total)
        }
      } catch (error) {
        console.error('Error fetching activity data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    const listener = () => fetchData()
    chrome.storage.onChanged.addListener(listener)
    
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [])

  return { activityData, totalTime, isLoading }
}

export default useActivityData