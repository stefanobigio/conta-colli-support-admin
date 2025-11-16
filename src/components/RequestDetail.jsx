import React, { useState } from 'react'
import './RequestDetail.css'

function RequestDetail({ request, onUpdate, onClose, onDelete }) {
  const [status, setStatus] = useState(request.status)
  const [response, setResponse] = useState(request.response || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onUpdate(request.id, status, response)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questa richiesta? Non sarà possibile recuperarla.')) {
      setLoading(true)
      try {
        await onDelete(request.id)
      } finally {
        setLoading(false)
      }
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      submitted: '#f59e0b',
      in_progress: '#3b82f6',
      responded: '#10b981',
      closed: '#6b7280'
    }
    return colors[status] || colors.submitted
  }

  const getStatusLabel = (status) => {
    const labels = {
      submitted: 'In attesa',
      in_progress: 'In corso',
      responded: 'Risposto',
      closed: 'Chiuso'
    }
    return labels[status] || status
  }

  return (
    <div className="request-detail">
      <div className="detail-header">
        <div>
          <h2>{request.name}</h2>
          <p className="detail-email">{request.email}</p>
        </div>
        <button onClick={onClose} className="close-button">✕</button>
      </div>

      <div className="detail-body">
        <div className="detail-section">
          <h3>Informazioni</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>ID Richiesta</label>
              <code>{request.id.substring(0, 8)}</code>
            </div>
            <div className="info-item">
              <label>Tipo</label>
              <span>{request.problemType}</span>
            </div>
            <div className="info-item">
              <label>Data</label>
              <span>{new Date(request.timestamp).toLocaleDateString('it-IT')}</span>
            </div>
            <div className="info-item">
              <label>Stato Attuale</label>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(request.status) }}
              >
                {getStatusLabel(request.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Messaggio</h3>
          <div className="message-box">
            {request.message}
          </div>
        </div>

        {request.attachmentsCount > 0 && (
          <div className="detail-section">
            <h3>Allegati</h3>
            <div className="attachments-info">
              {request.attachmentsLinks && request.attachmentsLinks.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  {request.attachmentsLinks.map((attachment, idx) => (
                    <li key={idx} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        📎 <strong>{attachment.filename}</strong>
                      </div>
                      <a 
                        href={`https://calm-band-d150.stefanobigio.workers.dev/download/${request.id}/${attachment.filename}`}
                        download={attachment.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          marginLeft: '16px', 
                          color: '#3b82f6', 
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '6px 12px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '4px',
                          border: '1px solid #93c5fd',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#bfdbfe';
                          e.target.style.borderColor = '#60a5fa';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#dbeafe';
                          e.target.style.borderColor = '#93c5fd';
                        }}
                      >
                        ⬇️ Scarica
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span>📎 {request.attachmentsCount} file allegato{request.attachmentsCount > 1 ? 'i' : ''}</span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="detail-section response-form">
          <h3>Gestisci Richiesta</h3>

          <div className="form-group">
            <label htmlFor="status">Nuovo Stato</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="submitted">In attesa</option>
              <option value="in_progress">In corso</option>
              <option value="responded">Risposto</option>
              <option value="closed">Chiuso</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="response">Risposta</label>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Scrivi la tua risposta qui..."
              rows="6"
              disabled={loading}
            />
            <small>Lascia vuoto se non vuoi inviare risposta (solo cambio stato)</small>
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Aggiornamento in corso...' : '✉️ Aggiorna'}
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
              disabled={loading}
            >
              🗑️ Elimina
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestDetail
