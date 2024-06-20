import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

// Funzione per aggiornare il nome nel file JSON
function updatePackageName(filePath, newName) {
    // Leggi il contenuto del file
    const packageData = JSON.parse(readFileSync(filePath, 'utf-8'));

    // Modifica il nome
    packageData.name = newName;

    // Salva il file aggiornato
    writeFileSync(filePath, JSON.stringify(packageData, null, 2), 'utf-8');
    console.log(`Updated ${filePath} with new name: ${newName}`);
}

// Funzione per trasformare il nome in un formato valido
function formatPackageName(name) {
    // Converti in minuscolo
    let formattedName = name.toLowerCase();

    // Sostituisci spazi con trattini
    formattedName = formattedName.replace(/\s+/g, '-');

    // Rimuovi caratteri non ammessi (lascia solo lettere, numeri, trattini e punti)
    formattedName = formattedName.replace(/[^a-z0-9-]/g, '');

    return formattedName;
}

// Ottieni il nome della directory corrente
const currentDirName = basename(process.cwd());

// Format il nome della directory
const formattedName = formatPackageName(currentDirName);

// Aggiorna package.json e package-lock.json con il nome della directory formattato
updatePackageName('package.json', formattedName);
updatePackageName('package-lock.json', formattedName);
