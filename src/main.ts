import './styles/styles.css';
import { abrirDB, dbNueva } from './db/database';
import { iniciar } from './controllers/cieloController';

abrirDB()
  .then(() => iniciar(dbNueva))
  .catch(() => {
    document.getElementById('lista')!.innerHTML = '<li class="vacio">No se pudo cargar la base de datos :(</li>';
  });
