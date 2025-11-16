import React, { useState, useEffect } from 'react'
import './DashboardPage.css'
import RequestsList from '../components/RequestsList'
import RequestDetail from '../components/RequestDetail'

function DashboardPage({ onLogout }) {
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const WORKER_URL = 'https://calm-band-d150.stefanobigio.workers.dev'

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`${WORKER_URL}/support/all`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer Tucano!5118'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Errore ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Errore nel caricamento delle richieste: ' + err.message)
      console.error(err)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(req => {
    const matchEmail = req.email.toLowerCase().includes(searchEmail.toLowerCase())
    const matchStatus = statusFilter === 'all' || req.status === statusFilter
    return matchEmail && matchStatus
  })

  const handleUpdateRequest = async (requestId, status, response) => {
    try {
      const result = await fetch(`${WORKER_URL}/support/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer Tucano!5118'
        },
        body: JSON.stringify({
          status: status,
          response: response
        })
      })

      if (!result.ok) {
        throw new Error('Errore nell\'aggiornamento')
      }

      // Aggiorna la lista locale
      setRequests(requests.map(r => 
        r.id === requestId 
          ? { ...r, status: status, response: response, lastUpdate: new Date().toISOString() }
          : r
      ))
      
      // Ricarica tutte le richieste per sincronizzare
      await loadRequests()
      
      setSelectedRequest(null)
      alert(response ? 'Richiesta aggiornata e email inviata!' : 'Richiesta aggiornata!')
    } catch (err) {
      alert('Errore: ' + err.message)
    }
  }

  const handleDeleteRequest = async (requestId) => {
    try {
      console.log('Eliminando richiesta:', requestId)
      
      const result = await fetch(`${WORKER_URL}/support/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer Tucano!5118'
        }
      })

      console.log('Response status:', result.status)
      const data = await result.json()
      console.log('Response data:', data)

      if (!result.ok) {
        throw new Error('Errore nell\'eliminazione: ' + (data.error || 'Unknown error'))
      }

      // Rimuovi dalla lista locale
      setRequests(requests.filter(r => r.id !== requestId))
      setSelectedRequest(null)
      alert('Richiesta eliminata!')
    } catch (err) {
      console.error('Errore:', err)
      alert('Errore: ' + err.message)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Conta Colli Support Admin</h1>
          <button onClick={onLogout} className="logout-button">
            Esci
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="filter-section">
            <h3>Filtri</h3>
            
            <div className="filter-group">
              <label>Cerca per email</label>
              <input
                type="text"
                placeholder="es: user@example.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Stato</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tutti</option>
                <option value="submitted">In attesa</option>
                <option value="in_progress">In corso</option>
                <option value="responded">Risposto</option>
                <option value="closed">Chiuso</option>
              </select>
            </div>

            <button onClick={loadRequests} className="refresh-button">
              🔄 Ricarica
            </button>
          </div>

          <div className="requests-list-section">
            <h3>Richieste ({filteredRequests.length})</h3>
            
            {loading && <div className="loading-text">Caricamento...</div>}
            {error && <div className="error-text">{error}</div>}
            
            {!loading && !error && filteredRequests.length === 0 && (
              <div className="empty-text">Nessuna richiesta trovata</div>
            )}

            {!loading && !error && filteredRequests.length > 0 && (
              <RequestsList
                requests={filteredRequests}
                selectedId={selectedRequest?.id}
                onSelect={setSelectedRequest}
              />
            )}
          </div>
        </div>

        <div className="main-content">
          {selectedRequest ? (
            <RequestDetail
              request={selectedRequest}
              onUpdate={handleUpdateRequest}
              onDelete={handleDeleteRequest}
              onClose={() => setSelectedRequest(null)}
            />
          ) : (
            <div className="empty-detail">
              <p>Seleziona una richiesta dalla lista</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
