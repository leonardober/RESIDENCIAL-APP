import { initApartamentos } from './apartamentos.js';
import { initParqueaderos } from './parqueaderos.js';
import { initPagos } from './pagos.js';
import { initMensajes } from './mensajes.js';
import { initReportes } from './reportes.js';
import { initSanciones } from './sanciones.js';
import { initEventos } from './eventos.js';


console.log("Módulos cargados correctamente.");

document.addEventListener('DOMContentLoaded', () => {
    initApartamentos();
    initParqueaderos();
    initPagos();
    initMensajes();
    initReportes();
    initSanciones();
    initEventos();
  });