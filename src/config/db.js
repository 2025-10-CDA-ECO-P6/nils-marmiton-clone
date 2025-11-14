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
    await dbConnection.run(`PRAGMA foreign_keys = ON`);

    await dbConnection.run(`
        CREATE TABLE IF NOT EXISTS recettes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            documentId TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            time DECIMAL NOT NULL,
            difficulty INTEGER NOT NULL,
            price INTEGER NOT NULL,
            steps TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await dbConnection.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            mail TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await dbConnection.run(`
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    `);

    await dbConnection.run(`
        CREATE TABLE IF NOT EXISTS Recettes_Ingredients (
            RecetteID INTEGER NOT NULL,
            IngredientID INTEGER NOT NULL,
            Quantite Text,
            
            -- definition clé primaire composite
            PRIMARY KEY (RecetteID, IngredientID),
            
            -- clé etranger vers recettes
            FOREIGN KEY (RecetteID)
                REFERENCES recettes(id)
                ON DELETE CASCADE,
            
            -- Clé Etragère vers ingrédients
            FOREIGN KEY(IngredientID)
                REFERENCES ingredients(id)
                ON DELETE CASCADE
        )
    `);


    console.log('Tables vérifiées/initialisées.');
}