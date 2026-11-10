# 🏠 Gestionale Famiglia Cloud (PWA)

Un applicativo web progressivo (PWA) leggero, portatile, utilizzabile anche offline e sicuro per la gestione completa della vita familiare: scadenze, casa, veicoli, finanze, spesa, carte fedeltà, note e agenda condivisa.

## 🌟 Funzionalità Principali
- **Quadro Generale & Alert (40 giorni):** Visione d'insieme con banner automatico per le scadenze imminenti o scadute.
- **Notifiche Email Automatiche (Serverless Cronjob):** Riepilogo mattutino automatico tramite Google Apps Script sincronizzato con le regole del Quadro Generale.
- **Gestione Casa:** Controllo rate condominiali, verbali, rendiconti, caldaia e spese varie con archivio allegati.
- **Gestione Veicoli:** Anagrafica dei mezzi (auto e moto), scadenze legali (Bollo, Assicurazione, Revisione), storico manutenzioni e calcolo automatico del prossimo tagliando (+1 anno) e inversione pneumatici.
- **Finanze e Prestiti:** Calcolo automatico rate pagate, residuo capitale/interessi e piano di ammortamento alla francese allineato al centesimo.
- **Alimenti e Detersivi:** Lista della spesa e detersivi interattiva (Dispensa / Carrello con supporto drag & drop e vista mobile), Menu Settimanale esportabile in PDF e Ricettario con integrazione automatica degli ingredienti nella spesa.
- **Carte e Tessere (Stocard Clone):** Portafoglio digitale con scanner fotocamera e generazione codici a barre (EAN-13, EAN-8, UPC, CODE128).
- **Blocco Note & Agenda Condivisa:** Note rapide con ricerca ed evidenziazione, più calendario mensile condiviso per tutta la famiglia.
- **Scadenzario & Esportazione:** Motore di ricerca scadenze per data o anno solare con esportazione in Word (`.docx`) e PDF tabellare.
- **Amministrazione & Sicurezza:** Gestione utenti, permessi granulari (visualizzazione/modifica per singola sezione), sessioni attive e Audit Log.

## 🚀 Architettura e Utilizzo
L'applicazione è ospitata su **GitHub Pages** ed è installabile su smartphone (iOS e Android) e PC tramite il file `index.html`.
- **Modalità Offline (Cold Start):** Grazie al Service Worker (`sw.js`) e alla cache persistente di IndexedDB, l'app si avvia e permette di consultare e modificare i dati anche in assenza di rete (es. in ascensore o in aereo), sincronizzandosi automaticamente al ritorno della connessione.
- **Sicurezza:** Autenticazione gestita da **Firebase Auth**, verifica Super Admin tramite hash crittografico **SHA-256** e regole di sicurezza **Firestore** con accesso riservato.

## 🛠 Stack Tecnologico
* **Frontend:** HTML5, Vanilla JavaScript (ES6+), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/).
* **Backend & Database:** [Google Firebase](https://firebase.google.com/) (Authentication & Cloud Firestore con `persistentLocalCache`).
* **Automazione:** Google Apps Script (chiamate REST API autenticate verso Firestore e invio tramite `MailApp`).
* **Librerie Client:** `CryptoJS` (SHA-256), `JsBarcode` & `html5-qrcode` (Tessere), `docx.js` & `jsPDF` (Esportazione Word/PDF).
