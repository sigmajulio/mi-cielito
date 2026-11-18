# Mi Cielito

Página para dibujar tus propias constelaciones. Haces clic en el cielo para poner estrellas, le pones nombre, una historia y un color, y se guarda. Después puedes verlas, buscarlas, editarlas o borrarlas.

Laboratorio #3 de Programación Orientada a Eventos - Julio Ventura

Sitio: https://mi-cielito.vercel.app

## Tecnologías

- Vite + TypeScript
- SQLite en el navegador con sql.js
- La base de datos se guarda en localStorage, así los datos no se pierden al recargar
- Desplegado en Vercel

## Base de datos

Una tabla `constelaciones` con: id, nombre, historia, color, estrellas (JSON con las coordenadas) y fecha.

## Estructura

```
src/
  main.ts
  db/database.ts                  conexión con SQLite
  models/constelacion.ts          crear, listar, editar y eliminar
  views/cieloView.ts              dibujo del cielo y la lista
  controllers/cieloController.ts  eventos
  styles/styles.css
```

## Cómo ejecutarlo

```bash
npm install
npm run dev
```
