import React from 'react'
import './RequestsList.css'

function RequestsList({ requests, selectedId, onSelect }) {
  const getStatusBadge = (status) => {
    const badges = {
      submitted: { label: 'In attesa', color: '#f59e0b' },
      in_progress: { label: 'In corso', color: '#3b82f6' },
      responded: { label: 'Risposto', color: '#10b981' },
      closed: { label: 'Chiuso', color: '#6b7280' }
    }
    return badges[status] || badges.submitted
  }

  const truncateText = (text, length = 30) => {
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  return (
    <div className="requests-list">
      {requests.map(request => {
        const badge = getStatusBadge(request.status)
        const isSelected = selectedId === request.id

        return (
          <div
            key={request.id}
            className={`request-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(request)}
          >
            <div className="request-header">
              <div className="request-email">
                {truncateText(request.email, 25)}
              </div>
              <span
                className="status-badge"
                style={{ backgroundColor: badge.color }}
              >
                {badge.label}
              </span>
            </div>
            <div className="request-name">{truncateText(request.name, 25)}</div>
            <div className="request-type">{request.problemType}</div>
            <div className="request-date">
              {new Date(request.timestamp).toLocaleDateString('it-IT', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RequestsList
