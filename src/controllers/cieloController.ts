import * as modelo from '../models/constelacion';
import type { Constelacion, Estrella } from '../models/constelacion';
import * as vista from '../views/cieloView';

let estrellas: Estrella[] = [];
let editandoId: number | null = null;

const lienzo = () => vista.el<HTMLCanvasElement>('lienzo');
const nombre = () => vista.el<HTMLInputElement>('nombre');
const historia = () => vista.el<HTMLTextAreaElement>('historia');
const buscar = () => vista.el<HTMLInputElement>('buscar');

function redibujar(): void {
  vista.dibujar(lienzo(), estrellas, vista.colorElegido());
  vista.el('contador').textContent = `${estrellas.length} estrellas`;
}

function refrescar(): void {
  vista.pintarLista(modelo.listar(buscar().value.trim()), editar, eliminar);
}

function limpiarFormulario(): void {
  editandoId = null;
  estrellas = [];
  vista.el<HTMLFormElement>('formulario').reset();
  vista.el('guardar').textContent = 'Guardar';
  vista.el('cancelar').hidden = true;
  redibujar();
}

function guardar(ev: Event): void {
  ev.preventDefault();
  const datos = {
    nombre: nombre().value.trim(),
    historia: historia().value.trim(),
    color: vista.colorElegido(),
    estrellas,
  };
  if (!datos.nombre) return vista.mensaje('Ponle un nombre a tu constelación', true);
  if (estrellas.length < 2) return vista.mensaje('Necesitas al menos 2 estrellas', true);

  if (editandoId === null) {
    modelo.crear(datos);
    vista.mensaje('Constelación guardada');
  } else {
    modelo.actualizar(editandoId, datos);
    vista.mensaje('Cambios guardados');
  }
  limpiarFormulario();
  refrescar();
}

function editar(c: Constelacion): void {
  editandoId = c.id;
  estrellas = [...c.estrellas];
  nombre().value = c.nombre;
  historia().value = c.historia;
  document.querySelector<HTMLInputElement>(`input[value="${c.color}"]`)!.checked = true;
  vista.el('guardar').textContent = 'Guardar cambios';
  vista.el('cancelar').hidden = false;
  vista.mensaje(`Editando "${c.nombre}"`);
  redibujar();
  lienzo().scrollIntoView({ block: 'center' });
}

function eliminar(c: Constelacion): void {
  if (!confirm(`¿Eliminar "${c.nombre}"?`)) return;
  modelo.eliminar(c.id);
  if (editandoId === c.id) limpiarFormulario();
  vista.mensaje('Constelación eliminada');
  refrescar();
}

export function iniciar(primeraVez: boolean): void {
  if (primeraVez) modelo.crearEjemplos();
  vista.pintarColores();

  lienzo().addEventListener('click', (ev) => {
    const r = lienzo().getBoundingClientRect();
    estrellas.push({ x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height });
    redibujar();
  });
  vista.el('deshacer').addEventListener('click', () => {
    estrellas.pop();
    redibujar();
  });
  vista.el('colores').addEventListener('change', redibujar);
  vista.el('formulario').addEventListener('submit', guardar);
  vista.el('cancelar').addEventListener('click', limpiarFormulario);
  buscar().addEventListener('input', refrescar);

  redibujar();
  refrescar();
}
