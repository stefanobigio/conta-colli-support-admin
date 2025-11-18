 import React, { useState, useEffect, useRef } from 'react'
import './RequestDetail.css'

function RequestDetail({ request, onUpdate, onClose, onDelete }) {
  const [status, setStatus] = useState(request.status)
  const [response, setResponse] = useState(request.response || '')
  const [loading, setLoading] = useState(false)
  
  // ✅ State per chat
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef(null)

  // ✅ Carica messaggi all'apertura
  useEffect(() => {
    loadMessages()
  }, [request.id])

  // ✅ Auto-scroll quando arrivano nuovi messaggi
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setLoadingMessages(true)
    try {
      const token = localStorage.getItem('adminToken')
      console.log('🔑 Token recuperato:', token ? 'OK' : 'MANCANTE')
      
      if (!token) {
        console.error('❌ Token admin non trovato!')
        return
      }
      
      const response = await fetch(
        `https://calm-band-d150.stefanobigio.workers.dev/support/${request.id}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log('📡 Risposta loadMessages:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Messaggi caricati:', data.length)
        setMessages(data)
      } else {
        console.error('❌ Errore caricamento messaggi:', response.status)
      }
    } catch (error) {
      console.error('❌ Errore caricamento messaggi:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      console.log('⚠️ Messaggio vuoto, non invio')
      return
    }
    
    console.log('📤 Invio messaggio:', newMessage.trim())
    setSendingMessage(true)
    
    try {
      const token = localStorage.getItem('adminToken')
      console.log('🔑 Token per invio:', token ? 'OK' : 'MANCANTE')
      
      if (!token) {
        console.error('❌ Token admin non trovato!')
        alert('Errore: token admin non trovato. Prova a fare logout e login.')
        return
      }
      
      const response = await fetch(
        `https://calm-band-d150.stefanobigio.workers.dev/support/${request.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            senderType: 'admin',
            senderName: 'Supporto Conta Colli',
            message: newMessage.trim()
          })
        }
      )

      console.log('📡 Risposta sendMessage:', response.status)

      if (response.ok) {
        console.log('✅ Messaggio inviato con successo')
        setNewMessage('')
        await loadMessages()
      } else {
        const errorData = await response.text()
        console.error('❌ Errore invio messaggio:', response.status, errorData)
        alert(`Errore nell'invio del messaggio: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Errore invio messaggio:', error)
      alert('Errore nell\'invio del messaggio')
    } finally {
      setSendingMessage(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ora'
    if (diffMins < 60) return `${diffMins}m fa`
    if (diffHours < 24) return `${diffHours}h fa`
    if (diffDays < 7) return `${diffDays}g fa`
    
    return date.toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
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

        {/* ✅ Sezione Chat */}
        <div className="detail-section chat-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>💬 Conversazione</h3>
            {request.unreadCount > 0 && (
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {request.unreadCount} nuov{request.unreadCount === 1 ? 'o' : 'i'}
              </span>
            )}
          </div>

          <div className="chat-container">
            {loadingMessages ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '12px' }}>Caricamento messaggi...</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                <p>Nessun messaggio nella conversazione</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-bubble ${msg.senderType === 'admin' ? 'message-admin' : 'message-user'}`}
                  >
                    <div className="message-header">
                      <span className="message-sender">{msg.senderName}</span>
                      <span className="message-time">{formatMessageTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Scrivi un messaggio..."
              rows="3"
              disabled={sendingMessage}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: '14px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              style={{
                marginLeft: '12px',
                padding: '12px 24px',
                backgroundColor: newMessage.trim() ? '#3b82f6' : '#e5e7eb',
                color: newMessage.trim() ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '8px',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-end'
              }}
            >
              {sendingMessage ? '⏳ Invio...' : '📤 Invia'}
            </button>
          </div>
          <small style={{ display: 'block', marginTop: '8px', color: '#9ca3af', fontSize: '12px' }}>
            💡 Premi Enter per inviare, Shift+Enter per andare a capo
          </small>
        </div>

        <div className="detail-section">
          <h3>Messaggio Iniziale</h3>
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
            <label htmlFor="response">Risposta via Email (opzionale)</label>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Scrivi una risposta da inviare via email..."
              rows="6"
              disabled={loading}
            />
            <small>⚠️ Usa la chat sopra per le conversazioni. Questo campo invia solo un'email singola.</small>
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
