const API_URL = 'http://localhost:5000/api/apartamentos';

// Funcionalidad para agregar nuevos residentes al formulario
document.getElementById('add-residente').addEventListener('click', function () {
  const container = document.getElementById('residentes-container');
  const newResidentForm = document.createElement('div');
  newResidentForm.classList.add('resident-form');
  newResidentForm.innerHTML = `
    <label for="residente-nombre">Nombre del Residente:</label>
    <input type="text" name="residente-nombre[]" required>
    <label for="residente-tipoDocumento">Tipo de Documento:</label>
    <input type="text" name="residente-tipoDocumento[]" required>
    <label for="residente-documento">Documento:</label>
    <input type="text" name="residente-documento[]" required>
    <label for="residente-telefono">Teléfono:</label>
    <input type="text" name="residente-telefono[]" required>
  `;
  container.appendChild(newResidentForm);
});

// Función para enviar los datos del formulario al backend
document.getElementById('apartamento-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    numero: formData.get('numero'),
    piso: formData.get('piso'),
    propietario: {
      nombre: formData.get('propietario-nombre'),
      tipoDocumento: formData.get('propietario-tipoDocumento'),
      documento: formData.get('propietario-documento'),
      telefono: formData.get('propietario-telefono')
    },
    residentes: []
  };

  const nombres = formData.getAll('residente-nombre[]');
  const tipos = formData.getAll('residente-tipoDocumento[]');
  const documentos = formData.getAll('residente-documento[]');
  const telefonos = formData.getAll('residente-telefono[]');

  for (let i = 0; i < nombres.length; i++) {
    data.residentes.push({
      nombre: nombres[i],
      tipoDocumento: tipos[i],
      documento: documentos[i],
      telefono: telefonos[i]
    });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Apartamento registrado exitosamente');
      this.reset();
      document.getElementById('residentes-container').innerHTML = '';
      cargarApartamentos(); // recargar la tabla al registrar
    } else {
      alert(`Error: ${result.mensaje}`);
    }
  } catch (error) {
    console.error('Error al enviar datos:', error);
    alert('Ocurrió un error al registrar el apartamento');
  }
});

// Función para cargar y mostrar todos los apartamentos
async function cargarApartamentos() {
  try {
    const res = await fetch(API_URL);
    const apartamentos = await res.json();
    const tabla = document.querySelector('#tablaApartamentos tbody');
    tabla.innerHTML = '';

    apartamentos.forEach(apto => {
      const fila = document.createElement('tr');

      // Propietario
      const propietario = `${apto.propietario?.nombre || ''} (${apto.propietario?.tipoDocumento || ''} ${apto.propietario?.documento || ''})`;

      // Residentes
      const residentes = apto.residentes.map(r =>
        `${r.nombre} (${r.tipoDocumento} ${r.documento})`
      ).join('<br>');

      fila.innerHTML = `
        <td>${apto.numero}</td>
        <td>${apto.piso}</td>
        <td>${propietario}</td>
        <td>${residentes}</td>
      `;

      tabla.appendChild(fila);
    });

  } catch (error) {
    console.error('Error al cargar apartamentos:', error);
  }
}

// Cargar apartamentos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  cargarApartamentos();
});
