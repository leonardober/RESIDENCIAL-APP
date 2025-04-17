const API_URL = 'http://localhost:5000/api/mensajes';

export function initMensajes() {
  const form = document.getElementById('mensaje-form');
  const tabla = document.querySelector('#mensajes-tabla tbody');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const de = document.getElementById('de-mensaje').value;
    const para = document.getElementById('para-mensaje').value;
    const contenido = document.getElementById('contenido-mensaje').value;
    const fecha = document.getElementById('fecha-mensaje').value;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ de, para, contenido, fecha })
    });

    form.reset();
    cargarMensajes();
  });

  async function cargarMensajes() {
    tabla.innerHTML = '';
    const res = await fetch(API_URL);
    const data = await res.json();
    data.forEach(({ de, para, contenido, fecha }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${de}</td>
        <td>${para}</td>
        <td>${contenido}</td>
        <td>${fecha}</td>
      `;
      tabla.appendChild(tr);
    });
  }

  cargarMensajes();
}
