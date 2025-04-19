export function initParqueaderos() {
  const API_URL = 'http://localhost:5000/api/parqueaderos';
  let editandoId = null;

  // 1) Envío del formulario
  document.getElementById('parqueadero-form').addEventListener('submit', async e => {
    e.preventDefault();

    const tipo = document.getElementById('tipo-parqueadero').value;
    const placa = document.getElementById('placa-parqueadero').value;
    const fechaHora = document.getElementById('fecha-hora-parqueadero').value;
    const estado = document.getElementById('estado-parqueadero').value;

    const data = { tipo, placa, fechaHora, estado };

    try {
      if (editandoId) {
        await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        editandoId = null;
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      // Reset y recarga
      e.target.reset();
      mostrarParqueaderos();
    } catch (err) {
      console.error('Error guardando parqueadero:', err);
    }
  });

  // 2) Mostrar lista
  async function mostrarParqueaderos() {
    try {
      const res = await fetch(API_URL);
      const lista = await res.json();
      const tbody = document.getElementById('parqueaderos-tabla').querySelector('tbody');
      tbody.innerHTML = '';

      lista.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${p.tipo}</td>
          <td>${p.placa}</td>
          <td>${new Date(p.fechaHora).toLocaleString()}</td>
          <td>${p.estado}</td>
          <td>
            <button class="editar-btn" data-id="${p._id}">Editar</button>
            <button class="eliminar-btn" data-id="${p._id}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      // Delegación de eventos
      tbody.querySelectorAll('.editar-btn').forEach(btn =>
        btn.addEventListener('click', () => cargarParaEditar(btn.dataset.id))
      );
      tbody.querySelectorAll('.eliminar-btn').forEach(btn =>
        btn.addEventListener('click', () => eliminarParqueadero(btn.dataset.id))
      );
    } catch (err) {
      console.error('Error al cargar parqueaderos:', err);
    }
  }

  // 3) Eliminar
  async function eliminarParqueadero(id) {
    if (!confirm('¿Eliminar este parqueadero?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      mostrarParqueaderos();
    } catch (err) {
      console.error('Error al eliminar parqueadero:', err);
    }
  }

  // 4) Preparar edición
  async function cargarParaEditar(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const p = await res.json();

      document.getElementById('tipo-parqueadero').value = p.tipo || '';
      document.getElementById('placa-parqueadero').value = p.placa || '';
      document.getElementById('fecha-hora-parqueadero').value = p.fechaHora
        ? new Date(p.fechaHora).toISOString().slice(0,16)
        : '';
      document.getElementById('estado-parqueadero').value = p.estado || 'desocupado';

      editandoId = id;
    } catch (err) {
      console.error('Error al cargar para editar:', err);
    }
  }

  // Inicializa la lista
  mostrarParqueaderos();
}

