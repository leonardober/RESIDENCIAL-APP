export function initPagos() {
  const API_URL = 'http://localhost:5000/api/pagos';
  let editId = null;

  // Envío del formulario
  document.getElementById('pago-form').addEventListener('submit', async e => {
    e.preventDefault();
    const apartamento = document.getElementById('apto-pago').value.trim();
    const monto = parseFloat(document.getElementById('monto').value);
    const fecha = document.getElementById('fecha-pago').value;
    const estado = document.getElementById('estado-pago').value;

    if (isNaN(monto) || monto <= 0) {
      alert('Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    const data = { apartamento, monto, fecha, estado };

    try {
      if (editId) {
        await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        editId = null;
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      e.target.reset();
      mostrarPagos();
    } catch (err) {
      console.error('Error guardando pago:', err);
    }
  });

  // Mostrar pagos
  async function mostrarPagos() {
    try {
      const res = await fetch(API_URL);
      const lista = await res.json();
      const tbody = document.getElementById('pagos-tabla').querySelector('tbody');
      tbody.innerHTML = '';

      lista.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.apartamento}</td>
          <td>${p.monto}</td>
          <td>${new Date(p.fecha).toLocaleDateString()}</td>
          <td>${p.estado}</td>
          <td>
            <button class="editar-pago" data-id="${p._id}">Editar</button>
            <button class="eliminar-pago" data-id="${p._id}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll('.editar-pago').forEach(btn =>
        btn.addEventListener('click', () => cargarPagoParaEditar(btn.dataset.id))
      );
      tbody.querySelectorAll('.eliminar-pago').forEach(btn =>
        btn.addEventListener('click', () => eliminarPago(btn.dataset.id))
      );
    } catch (err) {
      console.error('Error al mostrar pagos:', err);
    }
  }

  // Cargar pago en formulario para editar
  async function cargarPagoParaEditar(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const pago = await res.json();
      document.getElementById('apto-pago').value = pago.apartamento || '';
      document.getElementById('monto').value = pago.monto || '';
      document.getElementById('fecha-pago').value = pago.fecha.slice(0, 10);
      document.getElementById('estado-pago').value = pago.estado;
      editId = id;
    } catch (err) {
      console.error('Error al cargar pago:', err);
    }
  }

  // Eliminar pago
  async function eliminarPago(id) {
    if (!confirm('¿Eliminar este pago?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      mostrarPagos();
    } catch (err) {
      console.error('Error al eliminar pago:', err);
    }
  }

  mostrarPagos();
}
