const API_URL_EVENTOS = 'http://localhost:5000/api/eventos';

export function initEventos() {
  const form = document.getElementById('evento-form');
  const tabla = document.querySelector('#eventos-tabla tbody');
  let editarId = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-evento').value;
    const lugar = document.getElementById('lugar-evento').value;
    const fecha = document.getElementById('fecha-evento').value;
    const hora = document.getElementById('hora-evento').value;
    const descripcion = document.getElementById('descripcion-evento').value; // Nuevo campo

    // Validación para asegurarse de que todos los campos estén completos
    if (!nombre || !lugar || !fecha || !hora || !descripcion) {
      alert("Todos los campos son obligatorios.");
      return; // No continua si falta algún campo
    }

    // Validación de formato de fecha (si es necesario)
    if (!fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      alert("La fecha debe estar en formato YYYY-MM-DD.");
      return; // No continua si la fecha no es válida
    }

    if (editarId) {
      // Editar evento
      await fetch(`${API_URL_EVENTOS}/${editarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, lugar, fecha, hora, descripcion })
      });
      editarId = null; // Reset ID after editing
    } else {
      // Crear nuevo evento
      await fetch(API_URL_EVENTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, lugar, fecha, hora, descripcion })
      });
    }

    form.reset();
    cargarEventos();
  });

  async function cargarEventos() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL_EVENTOS);
    const data = await res.json();
    data.forEach(({ _id, nombre, lugar, fecha, hora, descripcion }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${nombre}</td>
        <td>${lugar}</td>
        <td>${fecha}</td>
        <td>${hora}</td>
        <td>${descripcion}</td>
        <td>
          <button onclick="editarEvento('${_id}')">Editar</button>
          <button onclick="eliminarEvento('${_id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  }

  async function editarEvento(id) {
    const res = await fetch(`${API_URL_EVENTOS}/${id}`);
    const evento = await res.json();
    document.getElementById('nombre-evento').value = evento.nombre;
    document.getElementById('lugar-evento').value = evento.lugar;
    document.getElementById('fecha-evento').value = evento.fecha;
    document.getElementById('hora-evento').value = evento.hora;
    document.getElementById('descripcion-evento').value = evento.descripcion;
    editarId = id;
  }

  async function eliminarEvento(id) {
    await fetch(`${API_URL_EVENTOS}/${id}`, { method: 'DELETE' });
    cargarEventos();
  }

  cargarEventos();
}
