import { formatTime } from '../utils/timeUtils'
import '../assets/styles/domainList.css'

const DomainList = ({ data }) => {
  return (
    <div className="domain-list">
      <h3>Website Details</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <span className="domain-name">{item.name}</span>
            <span className="domain-time">{formatTime(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DomainList