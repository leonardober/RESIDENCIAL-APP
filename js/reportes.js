const API_URL_REPORTES = 'http://localhost:5000/api/reportes';

export function initReportes() {
  const form = document.getElementById('reporte-form');
  const tabla = document.querySelector('#reportes-tabla tbody');
  let editarId = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById('descripcion-reporte').value;
    const fecha = document.getElementById('fecha-reporte').value;
    const estado = document.getElementById('estado-reporte').value;
    const responsable = document.getElementById('responsable-reporte').value;

    const reporteData = { descripcion, fecha, estado, responsable };

    if (editarId) {
      await fetch(`${API_URL_REPORTES}/${editarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reporteData)
      });
      editarId = null;
    } else {
      await fetch(API_URL_REPORTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reporteData)
      });
    }

    form.reset();
    cargarReportes();
  });

  async function cargarReportes() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL_REPORTES);
    const data = await res.json();
    data.forEach(({ _id, descripcion, fecha, estado, responsable }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${descripcion}</td>
        <td>${fecha ? new Date(fecha).toLocaleDateString() : ''}</td>
        <td>${estado}</td>
        <td>${responsable || ''}</td>
        <td>
          <button onclick="editarReporte('${_id}')">Editar</button>
          <button onclick="eliminarReporte('${_id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  }

  async function editarReporte(id) {
    const res = await fetch(`${API_URL_REPORTES}/${id}`);
    const reporte = await res.json();
    document.getElementById('descripcion-reporte').value = reporte.descripcion;
    document.getElementById('fecha-reporte').value = reporte.fecha?.substring(0, 10); // formato yyyy-mm-dd
    document.getElementById('estado-reporte').value = reporte.estado;
    document.getElementById('responsable-reporte').value = reporte.responsable || '';
    editarId = id;
  }

  async function eliminarReporte(id) {
    await fetch(`${API_URL_REPORTES}/${id}`, { method: 'DELETE' });
    cargarReportes();
  }

  cargarReportes();
}
