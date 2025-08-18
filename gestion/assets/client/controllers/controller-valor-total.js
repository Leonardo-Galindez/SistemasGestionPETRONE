export async function obtenerTotalDeuda() {
    try {
        // Llamada al backend para obtener el total
        const response = await fetch('../../server/backend/modules/fetch-valor-total-deudas.php');
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            // Actualizar el contenido del span con el id 'total-deuda'
            const totalDeudaElement = document.getElementById('total');
            totalDeudaElement.textContent = `$${data.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
        } else {
            console.error(data.error || 'No se pudo obtener el total.');
            alert('No se pudo obtener el total. Por favor, intente nuevamente.');
        }
    } catch (error) {
        console.error('Error al obtener el total:', error);
        alert('Ocurrió un error al obtener el total. Intente más tarde.');
    }
}

export async function obtenerTotalPendientes() {
    try {
        // Llamada al backend para obtener el total
        const response = await fetch('../../server/backend/modules/fetch-valor-total-pendientes.php');
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            // Actualizar el contenido del span con el id 'total-deuda'
            const totalDeudaElement = document.getElementById('total');
            totalDeudaElement.textContent = `$${data.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
        } else {
            console.error(data.error || 'No se pudo obtener el total.');
            alert('No se pudo obtener el total. Por favor, intente nuevamente.');
        }
    } catch (error) {
        console.error('Error al obtener el total:', error);
        alert('Ocurrió un error al obtener el total. Intente más tarde.');
    }
}


