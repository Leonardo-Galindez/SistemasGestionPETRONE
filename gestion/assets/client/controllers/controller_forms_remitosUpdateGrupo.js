import { updateGrupoRemitos } from './controller_table_remitos';

document.addEventListener('DOMContentLoaded', () => {
    const btnSeleccionar = document.getElementById('btnActualizarGrupoRemito');
    const modalSeleccionar = document.getElementById('modalRemitoUpdateGrupo');
    const modalBackground = modalSeleccionar?.querySelector('.modal-background');
    const cancelarSeleccionarBtn = document.getElementById('cancelarRemitoUpdateGrupo');
    const cerrarUpdateGrupo = document.getElementById('cerrarUpdateGrupo');
    const actualizarRemitoGrupo = document.getElementById('actualizarRemitoGrupo');
    
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
    if (cerrarUpdateGrupo) {
        cerrarUpdateGrupo.addEventListener('click', () => {
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
    if (actualizarRemitoGrupo) {
        actualizarRemitoGrupo.addEventListener('click', async () => {
            const confirmar = confirm("¿Estás seguro de que querés actualizar los remitos?");
            if (confirmar) {
                await updateGrupoRemitos();  
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

