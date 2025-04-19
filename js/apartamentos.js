export function initApartamentos() {
  const API_URL = 'http://localhost:5000/api/apartamentos';
  let editandoId = null;

  // Evento para agregar nuevos residentes
  document.getElementById('add-residente').addEventListener('click', () => {
    agregarCampoResidente();
  });

  // Manejo del formulario de apartamentos
  document.getElementById('apartamento-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const numero = document.getElementById('numero').value;
    const piso = document.getElementById('piso').value;
    const propietarioNombre = document.getElementById('propietario-nombre').value;
    const propietarioTipoDocumento = document.getElementById('propietario-tipoDocumento').value;
    const propietarioDocumento = document.getElementById('propietario-documento').value;
    const propietarioTelefono = document.getElementById('propietario-telefono').value;

    const residentes = Array.from(document.querySelectorAll('.resident-form')).map(form => ({
      nombre: form.querySelector('input[name="residente-nombre[]"]').value,
      tipoDocumento: form.querySelector('input[name="residente-tipoDocumento[]"]').value,
      documento: form.querySelector('input[name="residente-documento[]"]').value,
      telefono: form.querySelector('input[name="residente-telefono[]"]').value,
    }));

    const apartamentoData = {
      numero,
      piso,
      propietario: {
        nombre: propietarioNombre,
        tipoDocumento: propietarioTipoDocumento,
        documento: propietarioDocumento,
        telefono: propietarioTelefono
      },
      residentes
    };

    try {
      if (editandoId) {
        await actualizarApartamento(editandoId, apartamentoData);
        editandoId = null;
      } else {
        await crearApartamento(apartamentoData);
      }

      // Reset form y campo de residentes
      document.getElementById('apartamento-form').reset();
      document.getElementById('residentes-container').innerHTML = '';
      agregarCampoResidente(); // Un campo vacío
      mostrarApartamentos();
    } catch (error) {
      console.error('Error al guardar apartamento:', error);
    }
  });

  // Carga y muestra los apartamentos en la tabla
  async function mostrarApartamentos() {
    try {
      const response = await fetch(API_URL);
      const apartamentos = await response.json();
      const tablaBody = document.getElementById('tablaApartamentos').querySelector('tbody');
      tablaBody.innerHTML = '';

      apartamentos.forEach(apto => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${apto.numero}</td>
          <td>${apto.piso}</td>
          <td>${apto.propietario?.nombre || 'Sin propietario'}</td>
          <td>${apto.propietario?.tipoDocumento || '-'}</td>
          <td>${apto.propietario?.documento || '-'}</td>
          <td>${apto.propietario?.telefono || '-'}</td>
          <td>${Array.isArray(apto.residentes) ? apto.residentes.map(r => r.nombre).join(', ') : ''}</td>
          <td>
            <button class="editar-btn" data-id="${apto._id}">Editar</button>
            <button class="eliminar-btn" data-id="${apto._id}">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(row);
      });

      // Delegar eventos
      tablaBody.querySelectorAll('.editar-btn').forEach(btn =>
        btn.addEventListener('click', () => editarApartamento(btn.dataset.id))
      );
      tablaBody.querySelectorAll('.eliminar-btn').forEach(btn =>
        btn.addEventListener('click', () => eliminarApartamento(btn.dataset.id))
      );

    } catch (error) {
      console.error('Error al mostrar apartamentos:', error);
    }
  }

  // Funciones CRUD
  async function crearApartamento(data) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async function actualizarApartamento(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async function eliminarApartamento(id) {
    if (!confirm('¿Eliminar este apartamento?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await res.json();
      mostrarApartamentos();
    } catch (error) {
      console.error('Error al eliminar apartamento:', error);
    }
  }

  // Edición
  async function editarApartamento(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const apto = await res.json();

      // Uso de fallback si no existe propietario
      const prop = apto.propietario || {};
      document.getElementById('numero').value = apto.numero || '';
      document.getElementById('piso').value = apto.piso || '';
      document.getElementById('propietario-nombre').value = prop.nombre || '';
      document.getElementById('propietario-tipoDocumento').value = prop.tipoDocumento || '';
      document.getElementById('propietario-documento').value = prop.documento || '';
      document.getElementById('propietario-telefono').value = prop.telefono || '';

      // Rellenar residentes
      const cont = document.getElementById('residentes-container');
      cont.innerHTML = '';
      (Array.isArray(apto.residentes) ? apto.residentes : []).forEach(r =>
        agregarCampoResidente(r)
      );

      editandoId = id;
    } catch (error) {
      console.error('Error al cargar apartamento para editar:', error);
    }
  }

  // Crea un campo de residente (vacío o con datos)
  function agregarCampoResidente(res = {}) {
    const cont = document.getElementById('residentes-container');
    const div = document.createElement('div');
    div.classList.add('resident-form');
    div.innerHTML = `
      <label>Nombre:</label>
      <input type="text" name="residente-nombre[]" value="${res.nombre || ''}" required>
      <label>Tipo Doc:</label>
      <input type="text" name="residente-tipoDocumento[]" value="${res.tipoDocumento || ''}" required>
      <label>Documento:</label>
      <input type="text" name="residente-documento[]" value="${res.documento || ''}" required>
      <label>Teléfono:</label>
      <input type="text" name="residente-telefono[]" value="${res.telefono || ''}" required>
    `;
    cont.appendChild(div);
  }

  // Inicialización
  agregarCampoResidente();
  mostrarApartamentos();
}
