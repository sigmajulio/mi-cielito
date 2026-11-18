import { getDB, guardarDB } from '../db/database';

export interface Estrella {
  x: number;
  y: number;
}

export interface Constelacion {
  id: number;
  nombre: string;
  historia: string;
  color: string;
  estrellas: Estrella[];
  fecha: string;
}

export type NuevaConstelacion = Omit<Constelacion, 'id' | 'fecha'>;

export const COLORES: Record<string, string> = {
  rosa: '#ff8fb8',
  lila: '#b69cff',
  celeste: '#7cc8ff',
  menta: '#6fd6b0',
  vainilla: '#ffc861',
};

export function listar(busqueda = ''): Constelacion[] {
  const stmt = getDB().prepare(
    'SELECT id, nombre, historia, color, estrellas, fecha FROM constelaciones WHERE nombre LIKE ? ORDER BY id DESC'
  );
  stmt.bind([`%${busqueda}%`]);
  const lista: Constelacion[] = [];
  while (stmt.step()) {
    const f = stmt.getAsObject();
    lista.push({
      id: Number(f.id),
      nombre: String(f.nombre),
      historia: String(f.historia ?? ''),
      color: String(f.color),
      estrellas: JSON.parse(String(f.estrellas)),
      fecha: String(f.fecha),
    });
  }
  stmt.free();
  return lista;
}

export function crear(c: NuevaConstelacion): void {
  getDB().run(
    'INSERT INTO constelaciones (nombre, historia, color, estrellas, fecha) VALUES (?, ?, ?, ?, ?)',
    [c.nombre, c.historia, c.color, JSON.stringify(c.estrellas), new Date().toISOString()]
  );
  guardarDB();
}

export function actualizar(id: number, c: NuevaConstelacion): void {
  getDB().run('UPDATE constelaciones SET nombre = ?, historia = ?, color = ?, estrellas = ? WHERE id = ?', [
    c.nombre,
    c.historia,
    c.color,
    JSON.stringify(c.estrellas),
    id,
  ]);
  guardarDB();
}

export function eliminar(id: number): void {
  getDB().run('DELETE FROM constelaciones WHERE id = ?', [id]);
  guardarDB();
}

export function crearEjemplos(): void {
  crear({
    nombre: 'El Gatito Dormido',
    historia: 'Sale cuando hace frío y se acurruca cerca de la luna.',
    color: 'lila',
    estrellas: [{ x: 0.2, y: 0.7 }, { x: 0.3, y: 0.35 }, { x: 0.42, y: 0.55 }, { x: 0.58, y: 0.55 }, { x: 0.7, y: 0.35 }, { x: 0.8, y: 0.7 }],
  });
  crear({
    nombre: 'La Pupusa Celeste',
    historia: 'Redondita y dorada. Aparece los sábados a la hora de la cena.',
    color: 'vainilla',
    estrellas: [{ x: 0.5, y: 0.2 }, { x: 0.75, y: 0.35 }, { x: 0.75, y: 0.65 }, { x: 0.5, y: 0.8 }, { x: 0.25, y: 0.65 }, { x: 0.25, y: 0.35 }, { x: 0.5, y: 0.2 }],
  });
  crear({
    nombre: 'Corazón de Algodón',
    historia: 'Se ve mejor desde el techo de mi casa.',
    color: 'rosa',
    estrellas: [{ x: 0.5, y: 0.8 }, { x: 0.25, y: 0.5 }, { x: 0.32, y: 0.25 }, { x: 0.5, y: 0.38 }, { x: 0.68, y: 0.25 }, { x: 0.75, y: 0.5 }, { x: 0.5, y: 0.8 }],
  });
}
