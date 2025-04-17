const API_URL = 'http://localhost:5000/api/apartamentos';

export function initApartamentos() {
  const form = document.getElementById('apartamento-form');
  const tabla = document.querySelector('#apartamentos-tabla tbody');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const numero = document.getElementById('numero-apto').value;
    const torre = document.getElementById('torre-apto').value;
    const residentes = document.getElementById('residentes-apto').value.split(',').map(r => r.trim());
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero, torre, residentes })
    });
    form.reset();
    cargarApartamentos();
  });

  async function cargarApartamentos() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL);
    const data = await res.json();
    data.forEach(({ _id, numero, torre, residentes }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${numero}</td>
        <td>${torre}</td>
        <td>${residentes.join(', ')}</td>
        <td>
          <button onclick="eliminarApartamento('${_id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  }

  window.eliminarApartamento = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarApartamentos();
  };

  cargarApartamentos();
}
