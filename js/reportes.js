const API_URL = 'http://localhost:5000/api/reportes';

export function initReportes() {
  const form = document.getElementById('reporte-form');
  const tabla = document.querySelector('#reportes-tabla tbody');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apartamento = document.getElementById('apartamento-reporte').value;
    const descripcion = document.getElementById('descripcion-reporte').value;
    const fecha = document.getElementById('fecha-reporte').value;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apartamento, descripcion, fecha })
    });

    form.reset();
    cargarReportes();
  });

  async function cargarReportes() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL);
    const data = await res.json();
    data.forEach(({ apartamento, descripcion, fecha }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${apartamento}</td>
        <td>${descripcion}</td>
        <td>${fecha}</td>
      `;
      tabla.appendChild(tr);
    });
  }

  cargarReportes();
}
