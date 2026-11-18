import initSqlJs, { type Database } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const CLAVE = 'mi-cielito-db';
let db: Database | null = null;
export let dbNueva = false;

function aTexto(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    s += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(s);
}

function aBytes(texto: string): Uint8Array {
  const s = atob(texto);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes;
}

export async function abrirDB(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const guardada = localStorage.getItem(CLAVE);
  dbNueva = !guardada;
  db = guardada ? new SQL.Database(aBytes(guardada)) : new SQL.Database();
  db.run(`CREATE TABLE IF NOT EXISTS constelaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    historia TEXT,
    color TEXT NOT NULL,
    estrellas TEXT NOT NULL,
    fecha TEXT NOT NULL
  )`);
  return db;
}

export function getDB(): Database {
  if (!db) throw new Error('La base de datos no está abierta');
  return db;
}

export function guardarDB(): void {
  if (db) localStorage.setItem(CLAVE, aTexto(db.export()));
}
