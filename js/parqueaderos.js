const API_URL = 'http://localhost:5000/api/parqueaderos';

export function initParqueaderos() {
  const form = document.getElementById('parqueadero-form');
  const tabla = document.querySelector('#parqueaderos-tabla tbody');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipo = document.getElementById('tipo-parqueadero').value;
    const placa = document.getElementById('placa-parqueadero').value;
    const fechaHora = document.getElementById('fecha-hora-parqueadero').value;
    const estado = document.getElementById('estado-parqueadero').value;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, placa, fechaHora, estado })
    });

    form.reset();
    cargarParqueaderos();
  });

  async function cargarParqueaderos() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL);
    const data = await res.json();
    data.forEach(({ _id, tipo, placa, fechaHora, estado }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${tipo}</td>
        <td>${placa}</td>
        <td>${new Date(fechaHora).toLocaleString()}</td>
        <td>${estado}</td>
        <td>
          <button onclick="eliminarParqueadero('${_id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  }

  window.eliminarParqueadero = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarParqueaderos();
  };

  cargarParqueaderos();
}
