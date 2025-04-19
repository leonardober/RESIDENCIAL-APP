const API_URL_SANCIONES = 'http://localhost:5000/api/sanciones';

export function initSanciones() {
  const form = document.getElementById('sancion-form');
  const tabla = document.querySelector('#sanciones-tabla tbody');
  let editarId = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apartamento = document.getElementById('apartamento-sancion').value;
    const motivo = document.getElementById('motivo-sancion').value;
    const valor = parseFloat(document.getElementById('valor-sancion').value);
    const fecha = document.getElementById('fecha-sancion').value;
    const estado = document.getElementById('estado-sancion').value;

    const data = { apartamento, motivo, valor, fecha, estado };

    if (editarId) {
      await fetch(`${API_URL_SANCIONES}/${editarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      editarId = null;
    } else {
      await fetch(API_URL_SANCIONES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    form.reset();
    cargarSanciones();
  });

  async function cargarSanciones() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL_SANCIONES);
    const data = await res.json();
    data.forEach(({ _id, apartamento, motivo, valor, fecha, estado }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${apartamento?.numero || apartamento}</td>
        <td>${motivo}</td>
        <td>$${valor.toFixed(2)}</td>
        <td>${new Date(fecha).toLocaleDateString()}</td>
        <td>${estado}</td>
        <td>
          <button onclick="editarSancion('${_id}')">Editar</button>
          <button onclick="eliminarSancion('${_id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  }

  async function editarSancion(id) {
    const res = await fetch(`${API_URL_SANCIONES}/${id}`);
    const sancion = await res.json();
    document.getElementById('apartamento-sancion').value = sancion.apartamento;
    document.getElementById('motivo-sancion').value = sancion.motivo;
    document.getElementById('valor-sancion').value = sancion.valor;
    document.getElementById('fecha-sancion').value = sancion.fecha.split('T')[0];
    document.getElementById('estado-sancion').value = sancion.estado;
    editarId = id;
  }

  async function eliminarSancion(id) {
    await fetch(`${API_URL_SANCIONES}/${id}`, { method: 'DELETE' });
    cargarSanciones();
  }

  cargarSanciones();
}
