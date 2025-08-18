document.addEventListener('DOMContentLoaded', () => {
    const btnFiltros = document.getElementById('btnFiltrosDeudas');
    const modalFiltros = document.getElementById('modalFiltrosDeudas');
    const cerrarFiltrosBtn = document.getElementById('cerrarFiltrosBtnDeudas');
    const modalBackground = modalFiltros?.querySelector('.modal-background');
    const aplicarFiltrosBtn = document.getElementById('aplicarFiltrosBtnDeudas');
    const cancelarFiltrosBtn = document.getElementById('cancelarFiltrosBtnDeudas');

    // Verifica si los elementos existen en el DOM
    if (!btnFiltros || !modalFiltros) {
        console.error('No se encontraron los elementos necesarios para abrir el modal de filtros.');
        return;
    }

    // Abrir el modal al hacer clic en el botón
    btnFiltros.addEventListener('click', () => {
        console.log('Abrir modal de filtros');
        modalFiltros.classList.add('is-active');
    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    if (cerrarFiltrosBtn) {
        cerrarFiltrosBtn.addEventListener('click', () => {
            console.log('Cerrar modal de filtros');
            modalFiltros.classList.remove('is-active');
        });
    }

    // Cerrar el modal al hacer clic en el fondo
    if (modalBackground) {
        modalBackground.addEventListener('click', () => {
            console.log('Cerrar modal al hacer clic en el fondo');
            modalFiltros.classList.remove('is-active');
        });
    }

    // Aplicar filtros
    if (aplicarFiltrosBtn) {
        aplicarFiltrosBtn.addEventListener('click', () => {
            console.log('Aplicar filtros');
            // Aquí puedes llamar a la función de filtros
            aplicarFiltrosDeudas();
            modalFiltros.classList.remove('is-active');
        });
    }

    // Cancelar filtros
    if (cancelarFiltrosBtn) {
        cancelarFiltrosBtn.addEventListener('click', () => {
            console.log('Cancelar filtros');
            modalFiltros.classList.remove('is-active');
        });
    }
});

export async function aplicarFiltrosDeudas() {
    const empresa = document.getElementById('empresaFiltroDeudas')?.value.toLowerCase() || '';
    const empresaDestino = document.getElementById('empresa_destinoFiltroDeudas')?.value.toLowerCase() || '';
    const fechaInicio = document.getElementById('fechaInicioFiltroDeudas')?.value || '';
    const fechaFin = document.getElementById('fechaFinFiltroDeudas')?.value || '';

    // Crear el FormData para enviar los filtros
    const formData = new FormData();
    formData.append('empresa', empresa);
    formData.append('empresaDestino', empresaDestino);
    formData.append('fechaInicio', fechaInicio);
    formData.append('fechaFin', fechaFin);

    try {
        const response = await fetch('../../server/backend/modules/fetch-remitos-deudas-filtros.php', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data); // <-- Agregar log para ver la respuesta

        if (data.success) {
            const tbody = document.querySelector('#remitoDeudas');
            if (tbody) {
                tbody.innerHTML = ''; // Limpiar la tabla
                if (data.data.length > 0) {
                    console.log('Datos de remitos recibidos:', data.data); // <-- Log para ver los datos
                    renderRemitosTableDeudas(data, tbody); // Renderizar los resultados
                } else {
                    console.warn('No hay datos que mostrar, aplicando mensaje de "sin resultados"');
                    renderNoResultsRow(tbody); // Renderizar un mensaje de "sin resultados"
                }
            } else {
                console.error('No se encontró el tbody dentro de #remitosTablePendientes');
            }
        } else {
            console.error(`Error en el backend: ${data.message}`);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }

}

export function renderRemitosTableDeudas(data, tbody) {
    tbody.innerHTML = ''; // Limpiar contenido previo

    data.data.forEach(remito => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${remito.empresa_destino}</td>
            <td>${remito.total_valor}</td>
        `;

        tbody.appendChild(row);
    });
    if (typeof data.totalValor !== 'undefined') {
        actualizarTotalValor(data.totalValor);
    } else {
        console.error('⚠️ totalValor no está definido en la respuesta del backend:', data);
    }
}

export function actualizarTotalValor(totalValor) {
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${parseFloat(totalValor).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    } else {
        console.error('⚠️ No se encontró el elemento con ID "total".');
    }
}
