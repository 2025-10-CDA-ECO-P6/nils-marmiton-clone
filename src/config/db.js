import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3'; // Nécessaire pour spécifier le driver
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.db');

let db; // Variable pour stocker l'instance de la DB

export async function openDb() {
    if (db) {
        return db;
    }

    db = await sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    console.log('Connecté à la base de données SQLite (promisifiée)');
    await initDatabase(db);

    return db;
}

// Initialiser les tables
export async function initDatabase(dbConnection) {
    await dbConnection.run(`
        CREATE TABLE IF NOT EXISTS recettes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            temps DECIMAL NOT NULL,
            difficulte INTEGER NOT NULL,
            budget INTEGER NOT NULL,
            description TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await dbConnection.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Tables vérifiées/initialisées.');
}