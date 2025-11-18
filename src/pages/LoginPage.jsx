import React, { useState } from 'react'
import './LoginPage.css'

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = 'Tucano!5118'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simuliamo un piccolo delay per dare feedback visivo
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onLogin(password)  // ✅ CORRETTO: usa la password inserita, non genera token casuale
      } else {
        setError('Password non corretta')
        setPassword('')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Conta Colli</h1>
          <p>Support Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la password"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={loading || !password}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="login-footer">
          <p>Portale di gestione richieste di supporto</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
