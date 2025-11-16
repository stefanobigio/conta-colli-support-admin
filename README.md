# Conta Colli Support Admin Portal

Portale di gestione delle richieste di supporto per Conta Colli.

## Features

- 🔐 Login sicuro con password
- 📋 Dashboard con lista richieste
- 🔍 Filtri per email e stato
- ✉️ Gestione risposte con invio email automatico
- 📱 Design responsive

## Setup Locale

### Requisiti
- Node.js 16+
- npm o yarn

### Installazione

```bash
# Clona il repository
git clone https://github.com/stefanobigio/conta-colli-support-admin.git
cd conta-colli-support-admin

# Installa dipendenze
npm install

# Avvia il dev server
npm run dev
```

Il portale sarà disponibile su `http://localhost:3000`

### Build per Produzione

```bash
npm run build
```

I file compilati saranno in `/dist`

## Configurazione Cloudflare Pages

1. Vai su https://dash.cloudflare.com/pages
2. Clicca "Create a project"
3. Connetti il repository GitHub `conta-colli-support-admin`
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deployment

## Configurazione Dominio

1. Nel dashboard Cloudflare, vai su "DNS"
2. Aggiungi un record CNAME:
   - Name: `admin`
   - Content: `conta-colli-support-admin.pages.dev`

Il portale sarà disponibile su `https://admin.contacolli.app`

## Credenziali

- **Password:** `Tucano!5118`

## API Connessione

Il portale si connette al Worker tramite:
- `GET /support/status?email=...` - Recupera richieste
- `PUT /support/:id` - Aggiorna richiesta

## Struttura Cartelle

```
├── src/
│   ├── components/
│   │   ├── RequestsList.jsx
│   │   ├── RequestDetail.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── DashboardPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## Note

- Le credenziali di login sono salvate in localStorage
- La password è hardcoded nel componente LoginPage (modificare in produzione)
- Il Worker deve avere le variabili d'ambiente configurate correttamente
