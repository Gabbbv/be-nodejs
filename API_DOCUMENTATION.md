# Documentazione API - Backend Node.js

Tutti gli endpoint dell'API hanno il prefisso `/api/v1`.
La maggior parte degli endpoint richiede l'autenticazione tramite un token valido inserito negli headers.

---

## 🔒 Autenticazione (`/api/v1/auth`)

### 1. Dati Utente Autenticato
- **Metodo**: `GET`
- **Endpoint**: `/api/v1/auth/`
- **Autenticazione Richiesta**: Sì
- **Descrizione**: Restituisce i dati pubblici (senza password) dell'utente attualmente autenticato.
- **Risposta 200**: Oggetto Utente (senza password).

### 2. Login
- **Metodo**: `POST`
- **Endpoint**: `/api/v1/auth/login`
- **Autenticazione Richiesta**: No
- **Descrizione**: Effettua il login e restituisce il token di sessione.
- **Payload Richiesto** (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "mypassword"
  }
  ```
- **Risposta 200**:
  ```json
  {
    "token": "stringa-token",
    "id_utente": 1
  }
  ```
- **Risposte Errore**: `404` (Utente non trovato), `401` (Password errata).

### 3. Registrazione (Signup)
- **Metodo**: `POST`
- **Endpoint**: `/api/v1/auth/signup`
- **Autenticazione Richiesta**: No
- **Descrizione**: Registra un nuovo utente (nel sistema come tipo Cliente).
- **Payload Richiesto** (JSON):
  ```json
  {
    "username": "jdoe",
    "email": "jdoe@example.com",
    "password": "mypassword",
    "nome": "John",
    "cognome": "Doe",
    "classe": "5A" // Opzionale
  }
  ```
- **Risposta 200**: Oggetto Utente creato (senza password, include i dettagli base).

### 4. Aggiorna Profilo
- **Metodo**: `PATCH`
- **Endpoint**: `/api/v1/auth/profilo`
- **Autenticazione Richiesta**: Sì (Utente loggato)
- **Descrizione**: Aggiorna i dati del profilo cliente corrente.
- **Payload Richiesto** (JSON - Tutti i campi sono opzionali):
  ```json
  {
    "username": "newusername",
    "email": "newemail@example.com",
    "password": "newpassword",
    "nome": "John",
    "cognome": "Doe",
    "classe": "5B"
  }
  ```
- **Risposta 200**: Oggetto Utente aggiornato.

---

## 🛍️ Prodotti (`/api/v1/prodotti`)

### 1. Lista Prodotti
- **Metodo**: `GET`
- **Endpoint**: `/api/v1/prodotti/`
- **Autenticazione Richiesta**: Sì
- **Descrizione**: Restituisce la lista di tutti i prodotti.

### 2. Dettaglio Prodotto
- **Metodo**: `GET`
- **Endpoint**: `/api/v1/prodotti/:id`
- **Autenticazione Richiesta**: Sì
- **Descrizione**: Restituisce i dettagli di un singolo prodotto comprensivo di `categoria` e `allergeni`.
- **Risposta Errore**: `404` (Prodotto non trovato).

### 3. Crea Prodotto
- **Metodo**: `POST`
- **Endpoint**: `/api/v1/prodotti/`
- **Autenticazione Richiesta**: Sì (Solo `gestore`)
- **Descrizione**: Crea un nuovo prodotto nel database.
- **Payload Richiesto** (JSON):
  ```json
  {
    "nome": "Panino al Prosciutto",
    "descrizione": "Panino fresco",  // Opzionale
    "specifiche": "Senza glutine",   // Opzionale
    "prezzo": 4.5,
    "sconto": 0,                     // Opzionale (default: 0)
    "quantita": 10,                  // Opzionale (default: 0)
    "immagine_url": "http://...",    // Opzionale
    "is_bundle": false,              // Opzionale (default: false)
    "id_categoria": 1                // Opzionale
  }
  ```

### 4. Aggiorna Prodotto
- **Metodo**: `PATCH`
- **Endpoint**: `/api/v1/prodotti/:id`
- **Autenticazione Richiesta**: Sì (Solo `gestore`)
- **Descrizione**: Aggiorna un prodotto esistente.
- **Payload Richiesto** (JSON): Oggetto con almeno un campo di creazione prodotto (campi parziali e opzionali).

---

## 📦 Ordini (`/api/v1/ordini`)

### 1. Crea Ordine
- **Metodo**: `POST`
- **Endpoint**: `/api/v1/ordini/`
- **Autenticazione Richiesta**: Sì (Solo `cliente`)
- **Descrizione**: Crea un nuovo ordine ed è associato automaticamente al cliente autenticato.
- **Payload Richiesto** (JSON):
  ```json
  {
    "timestamp_ordine": "2023-10-01T12:00:00Z", // Formato ISO 8601 (Richiesto)
    "stato": "in_attesa",                       // Opzionale (default: in_attesa)
    "pin_ritiro": "1234",                       // Opzionale
    "note": "Senza formaggio",                  // Opzionale
    "orario_ritiro": "2023-10-01T13:00:00Z"     // Opzionale
  }
  ```

### 2. Lista Ordini Personali
- **Metodo**: `GET`
- **Endpoint**: `/api/v1/ordini/`
- **Autenticazione Richiesta**: Sì (Cliente)
- **Descrizione**: Restituisce tutti gli ordini appartenenti al cliente attualmente loggato.

### 3. Dettaglio Ordine
- **Metodo**: `GET`
- **Endpoint**: `/api/v1/ordini/:id`
- **Autenticazione Richiesta**: Sì
- **Descrizione**: Restituisce un singolo ordine. Il cliente può vedere solo i propri ordini collegati al proprio account.
- **Risposta Errore**: `403` o `404` (Se inaccessibile o inesistente).

### 4. Aggiorna Stato Ordine
- **Metodo**: `PATCH`
- **Endpoint**: `/api/v1/ordini/:id/stato`
- **Autenticazione Richiesta**: Sì (Solo `gestore`)
- **Descrizione**: Permette ad un utente gestore di aggiornare le fasi e lo stato di un ordine.
- **Payload Richiesto** (JSON):
  ```json
  {
    "stato": "pronto",                          // Opzionale
    "note": "Nuova nota",                       // Opzionale
    "orario_ritiro": "2023-10-01T13:30:00Z",    // Opzionale
    "pin_ritiro": "4321"                        // Opzionale
  }
  ```
