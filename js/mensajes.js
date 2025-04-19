const API_URL_MENSAJES = 'http://localhost:5000/api/mensajes';

export function initMensajes() {
  const form = document.getElementById('mensaje-form');
  const tabla = document.querySelector('#mensajes-tabla tbody');
  let editarId = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const remitente = document.getElementById('remitente').value;
    const receptor = document.getElementById('receptor').value;
    const mensaje = document.getElementById('mensaje').value;
    const fecha = document.getElementById('fecha').value;

    const mensajeData = { remitente, receptor, mensaje, fecha };

    try {
      if (editarId) {
        await fetch(`${API_URL_MENSAJES}/${editarId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mensajeData)
        });
        editarId = null;
      } else {
        await fetch(API_URL_MENSAJES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mensajeData)
        });
      }

      form.reset();
      cargarMensajes();
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  });

  async function cargarMensajes() {
    tabla.innerHTML = '';
    try {
      const res = await fetch(API_URL_MENSAJES);
      const data = await res.json();

      data.forEach(({ _id, remitente, receptor, mensaje, fecha }) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${remitente}</td>
          <td>${receptor}</td>
          <td>${mensaje}</td>
          <td>${new Date(fecha).toLocaleString()}</td>
          <td>
            <button data-id="${_id}" class="btn-editar">Editar</button>
            <button data-id="${_id}" class="btn-eliminar">Eliminar</button>
          </td>
        `;
        tabla.appendChild(tr);
      });
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  }

  tabla.addEventListener('click', async (e) => {
    const target = e.target;
    const id = target.dataset.id;
    if (target.classList.contains('btn-editar')) {
      try {
        const res = await fetch(`${API_URL_MENSAJES}/${id}`);
        const msg = await res.json();
        document.getElementById('remitente').value = msg.remitente;
        document.getElementById('receptor').value = msg.receptor;
        document.getElementById('mensaje').value = msg.mensaje;
        document.getElementById('fecha').value = msg.fecha.slice(0, 16);
        editarId = id;
      } catch (error) {
        console.error('Error al editar mensaje:', error);
      }
    } else if (target.classList.contains('btn-eliminar')) {
      try {
        await fetch(`${API_URL_MENSAJES}/${id}`, { method: 'DELETE' });
        cargarMensajes();
      } catch (error) {
        console.error('Error al eliminar mensaje:', error);
      }
    }
  });

  cargarMensajes();
}
