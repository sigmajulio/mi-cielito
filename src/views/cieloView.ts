import { COLORES, type Constelacion, type Estrella } from '../models/constelacion';

export const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

function estrellita(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radio = i % 2 === 0 ? r : r / 2.2;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(x + Math.cos(ang) * radio, y + Math.sin(ang) * radio);
  }
  ctx.closePath();
  ctx.fill();
}

export function dibujar(canvas: HTMLCanvasElement, estrellas: Estrella[], color: string): void {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  const tam = w / 40;
  ctx.fillStyle = '#4b4785';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  const azar = (n: number) => Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
  for (let i = 1; i <= 30; i++) ctx.fillRect(azar(i) * w, azar(i + 100) * h, 2, 2);

  ctx.strokeStyle = COLORES[color];
  ctx.lineWidth = tam / 4;
  ctx.setLineDash([tam / 2, tam / 2]);
  ctx.beginPath();
  estrellas.forEach((e, i) => (i === 0 ? ctx.moveTo(e.x * w, e.y * h) : ctx.lineTo(e.x * w, e.y * h)));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = COLORES[color];
  estrellas.forEach((e) => estrellita(ctx, e.x * w, e.y * h, tam));
}

export function pintarColores(): void {
  el('colores').innerHTML = Object.keys(COLORES)
    .map(
      (c, i) =>
        `<label class="color" style="--c:${COLORES[c]}"><input type="radio" name="color" value="${c}" ${i === 0 ? 'checked' : ''}><span>${c}</span></label>`
    )
    .join('');
}

export function colorElegido(): string {
  return document.querySelector<HTMLInputElement>('input[name="color"]:checked')!.value;
}

export function mensaje(texto: string, error = false): void {
  const m = el('mensaje');
  m.textContent = texto;
  m.className = error ? 'mensaje error' : 'mensaje';
}

export function pintarLista(
  lista: Constelacion[],
  onEditar: (c: Constelacion) => void,
  onEliminar: (c: Constelacion) => void
): void {
  const ul = el('lista');
  ul.innerHTML = '';
  if (lista.length === 0) {
    ul.innerHTML = '<li class="vacio">Todavía no hay constelaciones por aquí</li>';
    return;
  }
  for (const c of lista) {
    const li = document.createElement('li');
    li.className = 'tarjeta';
    li.innerHTML = `
      <canvas width="300" height="200"></canvas>
      <div>
        <h3></h3>
        <p></p>
        <small>${c.estrellas.length} estrellas · ${new Date(c.fecha).toLocaleDateString('es-SV')}</small>
        <div class="botones">
          <button type="button" class="btn editar">Editar</button>
          <button type="button" class="btn borrar">Eliminar</button>
        </div>
      </div>`;
    li.querySelector('h3')!.textContent = c.nombre;
    li.querySelector('p')!.textContent = c.historia || 'Sin historia';
    li.querySelector('.editar')!.addEventListener('click', () => onEditar(c));
    li.querySelector('.borrar')!.addEventListener('click', () => onEliminar(c));
    dibujar(li.querySelector('canvas')!, c.estrellas, c.color);
    ul.appendChild(li);
  }
}
