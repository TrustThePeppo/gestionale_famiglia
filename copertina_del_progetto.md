# 🏠 Gestionale Famiglia Cloud

Un applicativo web leggero, portatile e sicuro per la gestione delle scadenze familiari, dei veicoli, della casa e delle finanze.

## 🌟 Funzionalità Principali
- **Quadro Generale:** Visione d'insieme di tutte le attività.
- **Gestione Casa:** Controllo bollette, spese condominiali, TARI e manutenzioni (es. caldaia).
- **Gestione Veicoli:** Anagrafica dei mezzi (auto e moto) e storico di tagliandi, bolli, assicurazioni e revisioni.
- **Finanze e Prestiti:** Calcolo avanzamento mutui e rate pagate.
- **Scadenzario:** Motore di ricerca per trovare scadenze da una data specifica o per anno solare.
- **Esportazione:** Generazione di report in formato Word (.docx) e PDF tabellare.
- **Cloud Sicuro:** Salvataggio dei dati e dei documenti (PDF/Immagini) in tempo reale tramite Google Firebase.

## 🚀 Come si usa
Questo gestionale è "Serverless". È sufficiente aprire il file `gestionale_famiglia.html` in qualsiasi browser web moderno (Chrome, Edge, Safari, Firefox). 
L'autenticazione è protetta e i dati vengono sincronizzati istantaneamente sul cloud.

## 🛠 Tecnologie Utilizzate
* HTML5 / CSS3 / JavaScript (ES6)
* [Tailwind CSS](https://tailwindcss.com/) per l'interfaccia grafica.
* [Lucide Icons](https://lucide.dev/) per la libreria di icone.
* [Firebase Firestore](https://firebase.google.com/) per il database in tempo reale.
* `docx.js` e `jsPDF` per la generazione dei documenti offline.