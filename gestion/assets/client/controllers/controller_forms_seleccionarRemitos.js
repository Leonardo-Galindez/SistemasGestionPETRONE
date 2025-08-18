

document.addEventListener('DOMContentLoaded', () => {
    const btnSeleccionar = document.getElementById('btnAbrirFormSeleccionar');
    const modalSeleccionar = document.getElementById('modalSeleccionar');
    const cerrarSeleccionarBtn = document.getElementById('cerrarSeleccionarBtn');
    const modalBackground = modalSeleccionar?.querySelector('.modal-background');
    const enviarSeleccionarBtn = document.getElementById('enviarCorreoSeleccionarBtn');
    const facturarSeleccionarBtn = document.getElementById('facturarSeleccionarBtn');
    const pagadoSeleccionarBtn = document.getElementById('pagarSeleccionarBtn');
    const cancelarSeleccionarBtn = document.getElementById('cancelarSeleccionarBtn');

    // Verifica si los elementos existen en el DOM
    if (!btnSeleccionar || !modalSeleccionar) {
        console.error('No se encontraron los elementos necesarios para abrir el modal de filtros.');
        return;
    }

    // Abrir el modal al hacer clic en el botón
    btnSeleccionar.addEventListener('click', () => {
        modalSeleccionar.classList.add('is-active');
    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    if (cerrarSeleccionarBtn) {
        cerrarSeleccionarBtn.addEventListener('click', () => {
            modalSeleccionar.classList.remove('is-active');
        });
    }

    // Cerrar el modal al hacer clic en el fondo
    if (modalBackground) {
        modalBackground.addEventListener('click', () => {
            modalSeleccionar.classList.remove('is-active');
        });
    }

    // Cancelar filtros
    if (enviarSeleccionarBtn) {
        enviarSeleccionarBtn.addEventListener('click', async () => {
            const confirmar = confirm("¿Estás seguro de que querés enviar los remitos?");
            if (confirmar) {
                await enviarRemitosSeleccionadorGrupos();
            }

        });
    }

    // Cancelar filtros
    if (facturarSeleccionarBtn) {
        facturarSeleccionarBtn.addEventListener('click', async () => {
            const confirmar = confirm("¿Estás seguro de que querés facturar los remitos?");
            if (confirmar) {
                await facturarSeleccionadorGrupos();
            }
        });
    }

    // Cancelar filtros
    if (pagadoSeleccionarBtn) {
        pagadoSeleccionarBtn.addEventListener('click', async () => {
            const confirmar = confirm("¿Estás seguro de que querés indicar como pagado los remitos?");
            if (confirmar) {
                await pagadoSeleccionadorGrupos();
            }
        });
    }

    // Cancelar filtros
    if (cancelarSeleccionarBtn) {
        cancelarSeleccionarBtn.addEventListener('click', () => {
            modalSeleccionar.classList.remove('is-active');
        });
    }
});

async function pagadoSeleccionadorGrupos() {

    const form = document.getElementById('seleccionarForm');

    const formData = new FormData(form);

    try {
        // Enviar solicitud al backend
        const response = await fetch('../../server/backend/modules/update-remitos-grupos-pagado.php', {
            method: 'POST',
            body: formData,
        });

        // Revisar respuesta del servidor
        const data = await response.json();

        if (data.success) {
            alert('Remitos pagados exitosamente.');
            location.reload();
        } else {
            console.error('Error desde el servidor:', data.error || 'Error desconocido.');
            alert('Hubo un problema al procesar los remitos.');
        }
    } catch (error) {
        // Manejo de errores en la solicitud
        console.error('Error al cambiar a pagado los remitos:', error);
        //alert('Ocurrió un error al intentar enviar los remitos.');
    }
}

async function facturarSeleccionadorGrupos() {

    const form = document.getElementById('seleccionarForm');

    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    console.log(formObject);
    try {
        // Enviar solicitud al backend
        const response = await fetch('../../server/backend/modules/update-remitos-grupos-facturados.php', {
            method: 'POST',
            body: formData,
        });

        // Revisar respuesta del servidor
        const data = await response.json();

        if (data.success) {
            alert('Remitos facturados exitosamente.');
            location.reload();
        } else {
            console.error('Error desde el servidor:', data.error || 'Error desconocido.');
            alert('Hubo un problema al procesar los remitos.');
        }
    } catch (error) {
        // Manejo de errores en la solicitud
        console.error('Error al facturar los remitos:', error);
        //alert('Ocurrió un error al intentar enviar los remitos.');
    }
}


async function enviarRemitosSeleccionadorGrupos() {

    const form = document.getElementById('seleccionarForm');

    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    console.log(formObject);

    try {
        // Enviar solicitud al backend
        const response = await fetch('../../server/backend/modules/send-email-seleccionarGrupos.php', {
            method: 'POST',
            body: formData,
        });

        // Revisar respuesta del servidor
        const data = await response.json();

        if (data.success) {
            alert('Remitos enviados exitosamente.');
            location.reload();
        } else {
            console.error('Error desde el servidor:', data.error || 'Error desconocido.');
            alert('Hubo un problema al procesar los remitos.');
        }
    } catch (error) {
        // Manejo de errores en la solicitud
        console.error('Error al enviar los remitos:', error);
        //alert('Ocurrió un error al intentar enviar los remitos.');
    }
}