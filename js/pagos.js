const API_URL = 'http://localhost:5000/api/pagos';

export function initPagos() {
  const form = document.getElementById('pago-form');
  const tabla = document.querySelector('#pagos-tabla tbody');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apartamento = document.getElementById('apto-pago').value;
    const valor = document.getElementById('valor-pago').value;
    const fecha = document.getElementById('fecha-pago').value;
    const estado = document.getElementById('estado-pago').value;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apartamento, valor, fecha, estado })
    });

    form.reset();
    cargarPagos();
  });

  async function cargarPagos() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL);
    const data = await res.json();
    data.forEach(({ _id, apartamento, valor, fecha, estado }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${apartamento}</td>
        <td>${valor}</td>
        <td>${fecha}</td>
        <td>${estado}</td>
        <td><button onclick="eliminarPago('${_id}')">Eliminar</button></td>
      `;
      tabla.appendChild(tr);
    });
  }

  window.eliminarPago = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarPagos();
  };

  cargarPagos();
}
