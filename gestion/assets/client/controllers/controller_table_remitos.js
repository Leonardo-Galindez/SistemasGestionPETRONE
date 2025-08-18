let selectedFiles = [];

let selectedFilesFact = [];

let remitosSeleccionados = [];

let selectedFilesFactGrupo = [];

let currentPage = 1;

const remitosPorPagina = 250;



export async function fetchAndRenderRemitos(page = 1) {

    try {

        // Realizar el fetch al archivo PHP

        const response = await fetch(`../../server/backend/modules/fetch_remitos.php?page=${page}&limit=${remitosPorPagina}`);

        const data = await response.json();



        if (!data.success) {

            console.error(data.error || 'Error desconocido al obtener remitos');

            return;

        }



        // Obtener el cuerpo de la tabla

        const tableBody = document.getElementById('remitosTable');



        if (!tableBody) {

            console.error('No se encontró el elemento con ID "remitosTable"');

            return;

        }



        // Limpiar el contenido actual de la tabla

        tableBody.innerHTML = '';



        // Recorrer los remitos y generar las filas

        data.data.forEach(remito => {

            const row = document.createElement('tr');

            let tieneArchivos = false;

            let tieneFacturas = false;

            let arc = false;

            let fac = false;

            let user = data.user;//administrador



            try {

                // Si son strings, parsearlos. Si ya son arrays, se mantendrán.

                const archivosArray = Array.isArray(remito.archivos)

                    ? remito.archivos

                    : JSON.parse(remito.archivos || "[]");



                const facturasArray = Array.isArray(remito.facturas)

                    ? remito.facturas

                    : JSON.parse(remito.facturas || "[]");



                tieneArchivos = archivosArray.length > 0;

                tieneFacturas = facturasArray.length > 0;



                arc = tieneArchivos;

                fac = tieneFacturas;

            } catch (error) {

                console.error('Error al procesar archivos o facturas:', error);

            }





            // Crear columnas (td) para cada dato

            row.innerHTML = `

                <td>${remito.id}</td>

                <td class="nroRemito-column">${remito.nroRemito}</td>

                <td>${remito.nroFactura}</td>

                <td>${remito.empresa}</td>

                <td>${remito.empresa_destino}</td>

                <td>${remito.valor_total}</td>

                <td class="email-column">${remito.email}</td>

                <td>${remito.estado}</td>

                <td>${remito.debe}</td>

                <td>${remito.fechaEnvio}</td>

                <td>${remito.fechaFacturado}</td>

                <td>

                    <button class="button is-warning is-small actualizarRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-edit"></i></span>

                    </button>

                    <button class="button is-danger is-small eliminarRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-trash"></i></span>

                    </button>

                    <button class="button is-info is-small mostrarArchivosRemitoBtn" data-id="${remito.id}" style="position: relative;">

                        <span class="icon"><i class="fas fa-folder-open"></i></span>

                        ${arc ? `<span class="archivo-indicador"></span>` : ''}

                        ${fac ? `<span class="archivo-factura"></span>` : ''}

                    </button>

                    <button class="button is-success is-small enviarCorreoRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-envelope"></i></span>

                    </button>

                </td>

            `;

            // Agregar la fila a la tabla

            tableBody.appendChild(row);

            if (user === 'administrador' && !tieneArchivos && !tieneFacturas) {

                row.style.backgroundColor = '#fe6464'; // Rojo claro

            }

        });

        // Si el usuario es administrador y no tiene archivos, poner fondo rojo



        currentPage = page;

        actualizarPaginacion(currentPage, data.totalPages);

        agregarEventosPaginacion();



        // Agregar eventos a los botones de eliminar

        document.querySelectorAll('.eliminarRemitoBtn').forEach(button => {

            button.addEventListener('click', async () => {

                const remitoId = button.getAttribute('data-id');

                await eliminarRemito(remitoId);

                location.reload();

            });

        });



        document.querySelectorAll('.actualizarRemitoBtn').forEach(button => {

            button.addEventListener('click', () => {

                const remitoId = button.getAttribute('data-id');

                abrirFormRemitoUpdate(remitoId);

            });

        });



        // Agregar eventos a los botones de mostrar archivos

        document.querySelectorAll('.mostrarArchivosRemitoBtn').forEach(button => {

            button.addEventListener('click', () => {

                const remitoId = button.getAttribute('data-id');

                mostrarArchivos(remitoId);

            });

        });



        // Agregar eventos a los botones de mostrar archivos

        document.querySelectorAll('.enviarCorreoRemitoBtn').forEach(button => {

            button.addEventListener('click', async () => { // Hacer la función async

                const remitoId = button.getAttribute('data-id'); // Obtener el ID del remito

                if (remitoId) {

                    const confirmarEnvio = confirm('¿Deseás enviar el correo del remito?');



                    if (!confirmarEnvio) {

                        return; // Cancelar si el usuario responde "No"

                    }

                    try {



                        await enviarCorreo(remitoId);

                        location.reload(); // Recargar la página después de completar la operación

                    } catch (error) {

                        console.error('Error al enviar el correo:', error);

                        alert('Hubo un error al enviar el correo.');

                    }

                } else {

                    alert('El ID del remito no está definido.');

                }

            });

        });



        if (typeof data.totalValor !== 'undefined') {

            actualizarTotalValor(data.totalValor);

        } else {

            console.error('⚠️ totalValor no está definido en la respuesta del backend:', data);

        }



        const toggleCheckboxesButton = document.getElementById('btnMostrarChecklists');

        if (toggleCheckboxesButton) {



            toggleCheckboxesButton.addEventListener('click', toggleCheckboxes);

        }



        const enviarCorreosButton = document.getElementById('btnEnviarCorreos');

        const facturarButton = document.getElementById('btnFacturar');

        const pagadoButton = document.getElementById('btnPagado');

        const btnUpdateGrupo = document.getElementById('btnActualizarGrupoRemito');



        if (btnUpdateGrupo) {

            btnUpdateGrupo.addEventListener('click', async () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para actualizar.');

                    return;

                }

                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas Actualizar?`

                );



                if (confirmarEnvio) {

                    await abrirFormRemitoUpdateGrupo();

                }

            });

        }





        if (pagadoButton) {

            pagadoButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para indicar que esta Pagado.');

                    return;



                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas indicar Pagado?`

                );

                if (confirmarEnvio) {

                    pagadoRemitosSeleccionados();

                }





            });

        }



        if (facturarButton) {

            facturarButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para facturar.');

                    return;

                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas facturarlos?`

                );

                if (confirmarEnvio) {

                    facturarRemitosSeleccionados();

                }





            });

        }



        if (enviarCorreosButton) {

            enviarCorreosButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para enviar.');

                    return;

                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas enviarlos?`

                );

                if (confirmarEnvio) {

                    enviarRemitosSeleccionados();

                }

            });

        }



    } catch (error) {

        console.error('Error al obtener los remitos:', error);

    }

}

async function abrirFormRemitoUpdateGrupo() {

    modalRemitoUpdateGrupo.classList.add('is-active');



    const select = document.getElementById('nro_remitoAdjuntoGrupo');

    const inputRemitos = document.getElementById('nro_remitoUpdateGrupo');

    select.innerHTML = ''; // Limpiar opciones previas



    const modalBackground = modalRemitoUpdateGrupo?.querySelector('.modal-background');

    const cancelarSeleccionarBtn = document.getElementById('cancelarRemitoUpdateGrupo');

    const cerrarUpdateGrupo = document.getElementById('cerrarUpdateGrupo');

    const actualizarRemitoGrupo = document.getElementById('actualizarRemitoGrupo');



    // Cerrar el modal

    cerrarUpdateGrupo?.addEventListener('click', () => {

        modalRemitoUpdateGrupo.classList.remove('is-active');

    });



    modalBackground?.addEventListener('click', () => {

        modalRemitoUpdateGrupo.classList.remove('is-active');

    });



    cancelarSeleccionarBtn?.addEventListener('click', () => {

        modalRemitoUpdateGrupo.classList.remove('is-active');

    });



    actualizarRemitoGrupo?.addEventListener('click', async () => {

        const confirmar = confirm("¿Estás seguro de que querés actualizar los remitos?");

        if (confirmar) {

            const form = document.getElementById('remitoFormUpdateGrupo');

            const formData = new FormData(form);

            await updateGrupoRemitos(formData);

        }

    });



    // Agregar opciones al select

    remitosSeleccionados.forEach(remito => {

        const option = document.createElement('option');

        option.value = remito;

        option.textContent = remito;

        select.appendChild(option);

    });



    const formData = new FormData();

    formData.append('ids', JSON.stringify(remitosSeleccionados));



    try {

        const response = await fetch('../../server/backend/modules/fetch_nroRemito.php', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({ ids: remitosSeleccionados })

        });





        if (!response.ok) {

            const errorText = await response.text();

            console.error('Error del servidor:', errorText);

            alert(`Error ${response.status}: ${errorText}`);

            return;

        }



        const data = await response.json();



        if (data.success) {

            const remitosString = data.nroRemitos.join(';');

            inputRemitos.value = remitosString;

        } else {

            console.error('Error al obtener nroRemitos:', data.message);

            inputRemitos.value = '';

        }



    } catch (error) {

        console.error('Error en la solicitud:', error);

        inputRemitos.value = '';

    }



    renderFacturasListGrupo();

}





/*async function abrirFormRemitoUpdateGrupo() {

    modalRemitoUpdateGrupo.classList.add('is-active');

    const remitosString = remitosSeleccionados.join(';');

    document.getElementById('nro_remitoUpdateGrupo').value = remitosString;

    const select = document.getElementById('nro_remitoAdjuntoGrupo');

    select.innerHTML = ''; // Limpiar opciones previas

    const modalBackground = modalRemitoUpdateGrupo?.querySelector('.modal-background');

    const cancelarSeleccionarBtn = document.getElementById('cancelarRemitoUpdateGrupo');

    const cerrarUpdateGrupo = document.getElementById('cerrarUpdateGrupo');

    const actualizarRemitoGrupo = document.getElementById('actualizarRemitoGrupo');



    // Cerrar el modal al hacer clic en el botón de cerrar

    if (cerrarUpdateGrupo) {

        cerrarUpdateGrupo.addEventListener('click', () => {

            modalRemitoUpdateGrupo.classList.remove('is-active');

        });

    }



    // Cerrar el modal al hacer clic en el fondo

    if (modalBackground) {

        modalBackground.addEventListener('click', () => {

            modalRemitoUpdateGrupo.classList.remove('is-active');

        });

    }



    // Cancelar filtros

    if (actualizarRemitoGrupo) {

        actualizarRemitoGrupo.addEventListener('click', async () => {

            const confirmar = confirm("¿Estás seguro de que querés actualizar los remitos?");

            if (confirmar) {

                const form = document.getElementById('remitoFormUpdateGrupo');

                const formData = new FormData(form);

                await updateGrupoRemitos(formData);

            }

        });

    }



    // Cancelar filtros

    if (cancelarSeleccionarBtn) {

        cancelarSeleccionarBtn.addEventListener('click', () => {

            modalRemitoUpdateGrupo.classList.remove('is-active');

        });

    }



    remitosSeleccionados.forEach(remito => {

        const option = document.createElement('option');

        option.value = remito;

        option.textContent = remito;

        select.appendChild(option);

    });



    renderFacturasListGrupo();

}*/



export async function fetchAndRenderRemitosFacturados(page = 1) {

    try {

        // Realizar el fetch al archivo PHP

        const response = await fetch(`../../server/backend/modules/fetch-facturados-nemer.php?page=${page}&limit=${remitosPorPagina}`);

        const data = await response.json();



        if (!data.success) {

            console.error(data.error || 'Error desconocido al obtener remitos');

            return;

        }



        // Obtener el cuerpo de la tabla

        const tableBody = document.getElementById('remitosTable');



        if (!tableBody) {

            console.error('No se encontró el elemento con ID "remitosTable"');

            return;

        }



        // Limpiar el contenido actual de la tabla

        tableBody.innerHTML = '';



        // Recorrer los remitos y generar las filas

        data.data.forEach(remito => {

            const row = document.createElement('tr');

            let tieneArchivos = false;

            let tieneFacturas = false;

            let arc = false;

            let fac = false;



            try {

                // Si son strings, parsearlos. Si ya son arrays, se mantendrán.

                const archivosArray = Array.isArray(remito.archivos)

                    ? remito.archivos

                    : JSON.parse(remito.archivos || "[]");



                const facturasArray = Array.isArray(remito.facturas)

                    ? remito.facturas

                    : JSON.parse(remito.facturas || "[]");





                tieneArchivos = archivosArray.length > 0;

                tieneFacturas = facturasArray.length > 0;



                arc = tieneArchivos;

                fac = tieneFacturas;



            } catch (error) {

                console.error('Error al procesar archivos o facturas:', error);

            }



            // Crear columnas (td) para cada dato

            row.innerHTML = `

                <td>${remito.id}</td>

                <td>${remito.nroRemito}</td>

                <td>${remito.nroFactura}</td>

                <td>${remito.empresa}</td>

                <td>${remito.empresa_destino}</td>

                <td>${remito.valor_total}</td>

                <td class="email-column">${remito.email}</td>

                <td>${remito.estado}</td>

                <td>${remito.debe}</td>

                <td>${remito.fechaEnvio}</td>

                <td>${remito.fechaFacturado}</td>

                <td>

                    <button class="button is-warning is-small actualizarRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-edit"></i></span>

                    </button>

                    <button class="button is-danger is-small eliminarRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-trash"></i></span>

                    </button>

                    <button class="button is-info is-small mostrarArchivosRemitoBtn" data-id="${remito.id}" style="position: relative;">

                        <span class="icon"><i class="fas fa-folder-open"></i></span>

                        ${arc ? `<span class="archivo-indicador"></span>` : ''}

                        ${fac ? `<span class="archivo-factura"></span>` : ''}

                    </button>

                    <button class="button is-success is-small enviarCorreoRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-envelope"></i></span>

                    </button>

                </td>

            `;

            // Agregar la fila a la tabla

            tableBody.appendChild(row);

        });

        currentPage = page;

        actualizarPaginacion(currentPage, data.totalPages);

        agregarEventosPaginacion();



        // Agregar eventos a los botones de eliminar

        document.querySelectorAll('.eliminarRemitoBtn').forEach(button => {

            button.addEventListener('click', async () => {

                const remitoId = button.getAttribute('data-id');

                await eliminarRemito(remitoId);

                location.reload();

            });

        });



        document.querySelectorAll('.actualizarRemitoBtn').forEach(button => {

            button.addEventListener('click', () => {

                const remitoId = button.getAttribute('data-id');

                abrirFormRemitoUpdate(remitoId);

            });

        });



        // Agregar eventos a los botones de mostrar archivos

        document.querySelectorAll('.mostrarArchivosRemitoBtn').forEach(button => {

            button.addEventListener('click', () => {

                const remitoId = button.getAttribute('data-id');

                mostrarArchivos(remitoId);

            });

        });



        // Agregar eventos a los botones de mostrar archivos

        document.querySelectorAll('.enviarCorreoRemitoBtn').forEach(button => {

            button.addEventListener('click', async () => { // Hacer la función async

                const remitoId = button.getAttribute('data-id'); // Obtener el ID del remito

                if (remitoId) {

                    const confirmarEnvio = confirm('¿Deseás enviar el correo del remito?');



                    if (!confirmarEnvio) {

                        return; // Cancelar si el usuario responde "No"

                    }

                    try {



                        await enviarCorreo(remitoId);

                        location.reload(); // Recargar la página después de completar la operación

                    } catch (error) {

                        console.error('Error al enviar el correo:', error);

                        alert('Hubo un error al enviar el correo.');

                    }

                } else {

                    alert('El ID del remito no está definido.');

                }

            });

        });



        if (typeof data.totalValor !== 'undefined') {

            actualizarTotalValor(data.totalValor);

        } else {

            console.error('⚠️ totalValor no está definido en la respuesta del backend:', data);

        }



        const toggleCheckboxesButton = document.getElementById('btnMostrarChecklists');

        if (toggleCheckboxesButton) {



            toggleCheckboxesButton.addEventListener('click', toggleCheckboxes);

        }



        const enviarCorreosButton = document.getElementById('btnEnviarCorreos');

        const facturarButton = document.getElementById('btnFacturar');

        const pagadoButton = document.getElementById('btnPagado');



        if (pagadoButton) {

            pagadoButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para indicar que esta Pagado.');

                    return;



                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas indicar Pagado?`

                );

                if (confirmarEnvio) {

                    pagadoRemitosSeleccionados();

                }





            });

        }



        if (facturarButton) {

            facturarButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para facturar.');

                    return;

                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas facturarlos?`

                );

                if (confirmarEnvio) {

                    facturarRemitosSeleccionados();

                }





            });

        }



        if (enviarCorreosButton) {

            enviarCorreosButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para enviar.');

                    return;

                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas enviarlos?`

                );

                if (confirmarEnvio) {

                    enviarRemitosSeleccionados();

                }

            });

        }



    } catch (error) {

        console.error('Error al obtener los remitos:', error);

    }

}







export async function fetchAndRenderRemitosNemer(page = 1) {

    try {

        // Realizar el fetch al archivo PHP

        const response = await fetch(`../../server/backend/modules/fetch-listo-nemer.php?page=${page}&limit=${remitosPorPagina}`);

        const data = await response.json();



        if (!data.success) {

            console.error(data.error || 'Error desconocido al obtener remitos');

            return;

        }



        // Obtener el cuerpo de la tabla

        const tableBody = document.getElementById('remitosTable');



        if (!tableBody) {

            console.error('No se encontró el elemento con ID "remitosTable"');

            return;

        }



        // Limpiar el contenido actual de la tabla

        tableBody.innerHTML = '';



        // Recorrer los remitos y generar las filas

        data.data.forEach(remito => {

            const row = document.createElement('tr');

            let tieneArchivos = false;

            let tieneFacturas = false;

            let arc = false;



            try {

                // Si son strings, parsearlos. Si ya son arrays, se mantendrán.

                const archivosArray = Array.isArray(remito.archivos)

                    ? remito.archivos

                    : JSON.parse(remito.archivos || "[]");



                const facturasArray = Array.isArray(remito.facturas)

                    ? remito.facturas

                    : JSON.parse(remito.facturas || "[]");







                tieneArchivos = archivosArray.length > 0;

                tieneFacturas = facturasArray.length > 0;



                arc = tieneArchivos || tieneFacturas;



            } catch (error) {

                console.error('Error al procesar archivos o facturas:', error);

            }

            // Crear columnas (td) para cada dato

            row.innerHTML = `

                <td>${remito.id}</td>

                <td>${remito.nroRemito}</td>

                <td>${remito.nroFactura}</td>

                <td>${remito.empresa}</td>

                <td>${remito.empresa_destino}</td>

                <td>${remito.valor_total}</td>

                <td class="email-column">${remito.email}</td>

                <td>${remito.estado}</td>

                <td>${remito.debe}</td>

                <td>${remito.fechaEnvio}</td>

                <td>${remito.fechaFacturado}</td>

                <td>

                    <button class="button is-warning is-small actualizarRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-edit"></i></span>

                    </button>

                    <button class="button is-danger is-small eliminarRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-trash"></i></span>

                    </button>

                    <button class="button is-info is-small mostrarArchivosRemitoBtn" data-id="${remito.id}" style="position: relative;">

                        <span class="icon"><i class="fas fa-folder-open"></i></span>

                        ${arc ? `<span class="archivo-indicador"></span>` : ''}

                    </button>

                    <button class="button is-success is-small enviarCorreoRemitoBtn" data-id="${remito.id}">

                        <span class="icon"><i class="fas fa-envelope"></i></span>

                    </button>

                </td>

            `;

            // Agregar la fila a la tabla

            tableBody.appendChild(row);

        });

        currentPage = page;

        actualizarPaginacion(currentPage, data.totalPages);

        agregarEventosPaginacion();



        // Agregar eventos a los botones de eliminar

        document.querySelectorAll('.eliminarRemitoBtn').forEach(button => {

            button.addEventListener('click', async () => {

                const remitoId = button.getAttribute('data-id');

                await eliminarRemito(remitoId);

                location.reload();

            });

        });



        document.querySelectorAll('.actualizarRemitoBtn').forEach(button => {

            button.addEventListener('click', () => {

                const remitoId = button.getAttribute('data-id');

                abrirFormRemitoUpdate(remitoId);

            });

        });



        // Agregar eventos a los botones de mostrar archivos

        document.querySelectorAll('.mostrarArchivosRemitoBtn').forEach(button => {

            button.addEventListener('click', () => {

                const remitoId = button.getAttribute('data-id');

                mostrarArchivos(remitoId);

            });

        });



        // Agregar eventos a los botones de mostrar archivos

        document.querySelectorAll('.enviarCorreoRemitoBtn').forEach(button => {

            button.addEventListener('click', async () => { // Hacer la función async

                const remitoId = button.getAttribute('data-id'); // Obtener el ID del remito

                if (remitoId) {

                    const confirmarEnvio = confirm('¿Deseás enviar el correo del remito?');



                    if (!confirmarEnvio) {

                        return; // Cancelar si el usuario responde "No"

                    }

                    try {



                        await enviarCorreo(remitoId);

                        location.reload(); // Recargar la página después de completar la operación

                    } catch (error) {

                        console.error('Error al enviar el correo:', error);

                        alert('Hubo un error al enviar el correo.');

                    }

                } else {

                    alert('El ID del remito no está definido.');

                }

            });

        });



        if (typeof data.totalValor !== 'undefined') {

            actualizarTotalValor(data.totalValor);

        } else {

            console.error('⚠️ totalValor no está definido en la respuesta del backend:', data);

        }



        const toggleCheckboxesButton = document.getElementById('btnMostrarChecklists');

        if (toggleCheckboxesButton) {



            toggleCheckboxesButton.addEventListener('click', toggleCheckboxes);

        }



        const enviarCorreosButton = document.getElementById('btnEnviarCorreos');

        const facturarButton = document.getElementById('btnFacturar');

        const pagadoButton = document.getElementById('btnPagado');



        if (pagadoButton) {

            pagadoButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para indicar que esta Pagado.');

                    return;



                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas indicar Pagado?`

                );

                if (confirmarEnvio) {

                    pagadoRemitosSeleccionados();

                }





            });

        }



        if (facturarButton) {

            facturarButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para facturar.');

                    return;

                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas facturarlos?`

                );

                if (confirmarEnvio) {

                    facturarRemitosSeleccionados();

                }





            });

        }



        if (enviarCorreosButton) {

            enviarCorreosButton.addEventListener('click', () => {

                if (remitosSeleccionados.length === 0) {

                    // Alerta si no hay remitos seleccionados

                    alert('No seleccionaste ningún remito para enviar.');

                    return;

                }



                // Confirmación antes de enviar

                const confirmarEnvio = confirm(

                    `Tienes ${remitosSeleccionados.length} remito(s) seleccionado(s). ¿Deseas enviarlos?`

                );

                if (confirmarEnvio) {

                    enviarRemitosSeleccionados();

                }

            });

        }



    } catch (error) {

        console.error('Error al obtener los remitos:', error);

    }

}



// 🔹 Función para actualizar el total en el componente

export function actualizarTotalValor(totalValor) {

    const totalElement = document.getElementById('total');

    if (totalElement) {

        totalElement.textContent = `$${parseFloat(totalValor).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    } else {

        console.error('⚠️ No se encontró el elemento con ID "total".');

    }

}



export function actualizarPaginacion(currentPage, totalPages) {

    const paginationNumbers = document.getElementById("paginationNumbers");

    const prevPageBtn = document.getElementById("prevPage");

    const nextPageBtn = document.getElementById("nextPage");



    paginationNumbers.innerHTML = "";



    // Botón de página 1

    if (currentPage > 2) {

        paginationNumbers.innerHTML += `<button class="pagination-btn" data-page="1">1</button>`;

    }



    // Botón de puntos suspensivos si la página actual está lejos del inicio

    if (currentPage > 3) {

        paginationNumbers.innerHTML += `<span class="pagination-ellipsis">...</span>`;

    }



    // Números de página dinámicos

    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {

        paginationNumbers.innerHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;

    }



    // Puntos suspensivos si la página actual está lejos del final

    if (currentPage < totalPages - 2) {

        paginationNumbers.innerHTML += `<span class="pagination-ellipsis">...</span>`;

    }



    // Última página

    if (currentPage < totalPages - 1) {

        paginationNumbers.innerHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;

    }



    // Deshabilitar botones según la página actual

    prevPageBtn.disabled = currentPage <= 1;

    nextPageBtn.disabled = currentPage >= totalPages;



    // Agregar eventos a los botones de paginación

    document.querySelectorAll(".pagination-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const selectedPage = parseInt(btn.getAttribute("data-page"));

            fetchAndRenderRemitos(selectedPage);

        });

    });



    prevPageBtn.addEventListener("click", () => {

        if (currentPage > 1) fetchAndRenderRemitos(currentPage - 1);

    });



    nextPageBtn.addEventListener("click", () => {

        if (currentPage < totalPages) fetchAndRenderRemitos(currentPage + 1);

    });

}





export function agregarEventosPaginacion() {

    const prevPageBtn = document.getElementById('prevPage');

    const nextPageBtn = document.getElementById('nextPage');



    if (prevPageBtn) {

        prevPageBtn.onclick = () => {

            if (currentPage > 1) {

                fetchAndRenderRemitos(currentPage - 1);

            }

        };

    }



    if (nextPageBtn) {

        nextPageBtn.onclick = () => {

            if (currentPage < totalPages) {

                fetchAndRenderRemitos(currentPage + 1);

            }

        };

    }

}





function toggleCheckboxes() {

    //alert('Por favor, refresca la página antes de seleccionar los remitos.');

    const filas = document.querySelectorAll('#remitosTable tr');

    const checkboxHeaderExists = document.getElementById('checkboxHeader');



    if (!checkboxHeaderExists) {

        // Agregar encabezado de checkbox (sin afectar columnas)

        const header = document.querySelector('table thead tr');

        const primeraCeldaHeader = header.children[0];

        const checkboxHeader = document.createElement('input');

        checkboxHeader.type = 'checkbox';

        checkboxHeader.id = 'checkboxHeader';

        checkboxHeader.style.marginRight = '5px';

        checkboxHeader.style.display = 'none';

        primeraCeldaHeader.prepend(checkboxHeader);



        // Agregar checkbox dentro de la primera celda de cada fila

        filas.forEach((fila, index) => {



            const primeraCelda = fila.children[0];

            const checkbox = document.createElement('input');

            checkbox.type = 'checkbox';

            checkbox.className = 'remitoCheckbox';

            checkbox.style.marginRight = '5px';

            const remitoId = fila.children[0].textContent; // ID en la segunda columna



            // Insertar checkbox al inicio de la celda

            primeraCelda.prepend(checkbox);



            // Escuchar cambios en el checkbox

            checkbox.addEventListener('change', (e) => actualizarSeleccionados(e, remitoId));

        });

    } else {

        // Remover encabezado de checkbox

        const header = document.querySelector('table thead tr');

        const checkboxHeader = header.querySelector('#checkboxHeader');

        if (checkboxHeader) checkboxHeader.remove();



        // Remover checkbox de cada fila

        filas.forEach((fila, index) => {

            const primeraCelda = fila.children[0];

            const checkbox = primeraCelda.querySelector('.remitoCheckbox');

            if (checkbox) checkbox.remove();

        });



        // Limpiar el arreglo de seleccionados

        remitosSeleccionados = [];

    }

}





function actualizarSeleccionados(event, remitoId) {

    if (event.target.checked) {

        // Agregar al arreglo si está seleccionado

        if (!remitosSeleccionados.includes(remitoId)) {

            remitosSeleccionados.push(remitoId);

        }

    } else {

        // Remover del arreglo si se deselecciona

        remitosSeleccionados = remitosSeleccionados.filter(id => id !== remitoId);

    }

    console.log('Remitos seleccionados:', remitosSeleccionados);

}



export async function updateGrupoRemitos(formData) {

    if (remitosSeleccionados.length === 0) {

        alert('No has seleccionado ningún remito para actualizar.');

        return;

    }



    // Agregar los remitos seleccionados al formData

    formData.append('remitosSeleccionador', JSON.stringify(remitosSeleccionados));

    console.log("Archivos seleccionados:", selectedFilesFactGrupo);





    for (let i = 0; i < selectedFilesFactGrupo.length; i++) {

        formData.append('facturasUpdateGrupo[]', selectedFilesFactGrupo[i]);

    }



    // Validación extra opcional

    const nroRemitoAdjunto = formData.get('nro_remitoAdjuntoGrupo');

    if (!remitosSeleccionados.includes(nroRemitoAdjunto)) {

        const confirmar = confirm(`El remito seleccionado para adjuntar (${nroRemitoAdjunto}) no está en la lista de seleccionados. ¿Deseás continuar?`);

        if (!confirmar) return;

    }



    try {

        const response = await fetch('../../server/backend/modules/update_grupoRemitos.php', {

            method: 'POST',

            body: formData

        });



        if (!response.ok) {

            const errorText = await response.text();

            console.error('Error del servidor:', errorText);

            alert(`Error ${response.status}: ${errorText}`);

            return;

        }



        const data = await response.json();

        console.log('Respuesta del servidor:', data);



        if (data.success) {

            alert('Remitos actualizados correctamente.');

            remitosSeleccionados = [];

            document.querySelectorAll('.remitoCheckbox:checked').forEach(cb => cb.checked = false);

            location.reload();

        } else {

            console.error('Error del servidor:', data.error);

            alert('Error al facturar los remitos: ' + data.error);

        }

    } catch (error) {

        console.error('Error en la solicitud:', error);

        alert('Ocurrió un error al intentar facturar los remitos.');

    }



}





async function facturarRemitosSeleccionados() {

    if (remitosSeleccionados.length === 0) {

        alert('No has seleccionado ningún remito para facturar.');

        return;

    }



    console.log('Remitos a facturar:', remitosSeleccionados);



    try {

        const response = await fetch('../../server/backend/modules/update-remitos-facturados.php', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ remitos: remitosSeleccionados }),

        });



        const data = await response.json();



        if (data.success) {

            alert('Remitos facturados correctamente.');

            remitosSeleccionados = [];

            document.querySelectorAll('.remitoCheckbox:checked').forEach(cb => cb.checked = false);

            fetchAndRenderRemitos(); // Recargar lista

            location.reload();

        } else {

            console.error('Error del servidor:', data.error);

            alert('Error al facturar los remitos.');

        }

    } catch (error) {

        console.error('Error en la solicitud:', error);

        alert('Ocurrió un error al intentar facturar los remitos.');

    }

}



async function pagadoRemitosSeleccionados() {

    // Verifica si hay remitos seleccionados

    if (remitosSeleccionados.length === 0) {

        alert('No se han seleccionado remitos.');

        return;

    }



    // Mostrar los remitos seleccionados en la consola antes de enviar

    console.log('Remitos seleccionados para indicar Pagado:', remitosSeleccionados);



    try {

        // Enviar solicitud al backend

        const response = await fetch('../../server/backend/modules/update-remitos-pagado.php', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

            },

            body: JSON.stringify({ remitos: remitosSeleccionados }), // Enviar el array de IDs en formato JSON

        });



        // Revisar respuesta del servidor

        const data = await response.json();





        if (data.success) {

            alert('Remitos indicados como pagados.');

            // Limpieza después de enviar



            remitosSeleccionados = [];

            document.querySelectorAll('.remitoCheckbox:checked').forEach(checkbox => {

                checkbox.checked = false; // Desmarcar los checkboxes

            });

            fetchAndRenderRemitos();

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



async function enviarRemitosSeleccionados() {

    // Verifica si hay remitos seleccionados

    if (remitosSeleccionados.length === 0) {

        alert('No se han seleccionado remitos.');

        return;

    }



    // Mostrar los remitos seleccionados en la consola antes de enviar

    console.log('Remitos seleccionados para enviar:', remitosSeleccionados);



    try {

        // Enviar solicitud al backend

        const response = await fetch('../../server/backend/modules/send-email-grupos.php', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

            },

            body: JSON.stringify({ remitos: remitosSeleccionados }), // Enviar el array de IDs en formato JSON

        });



        // Revisar respuesta del servidor

        const data = await response.json();





        if (data.success) {

            alert('Remitos enviados exitosamente.');

            // Limpieza después de enviar



            remitosSeleccionados = [];

            document.querySelectorAll('.remitoCheckbox:checked').forEach(checkbox => {

                checkbox.checked = false; // Desmarcar los checkboxes

            });

            fetchAndRenderRemitos();

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

let actualizacionPendiente = false;

document.addEventListener('DOMContentLoaded', () => {



    // Asigna eventos a los botones del modal después de renderizarlo

    document.addEventListener('click', (event) => {

        if (event.target.id === 'cancelarRemitoUpdate' || event.target.classList.contains('delete')) {

            cerrarModalUpdate();

        }

    });



    const guardarRemito = document.getElementById('actualizarRemito');

    if (guardarRemito) {

        guardarRemito.addEventListener('click', async (event) => {

            event.preventDefault(); // Prevenir comportamiento por defecto



            const remitoId = document.getElementById('remitoIdUpdate').value;

            const estadoActual = document.getElementById('estadoUpdate').value;



            // Crear y mostrar loader

            const loader = document.createElement('div');

            loader.id = 'loader';

            loader.innerHTML = '<div class="spinner"></div>';

            document.body.appendChild(loader);



            try {

                await enviarRemitoUpdate(); // Asegurarse de que los datos se actualicen antes de continuar

                actualizacionPendiente = true;

                // Verifica si el estado se cambió a "Facturado" y envía el correo

                /*if (estadoActual === 'Facturado') {

                    await enviarCorreo(remitoId);

                }*/

                //location.reload();

            } catch (error) {

                console.error('Error al actualizar el remito:', error);

            } finally {

                // Eliminar loader

                if (loader) {

                    loader.remove();

                }

            }

        });

    }



    // Agregar estilos para el loader

    const style = document.createElement('style');

    style.innerHTML = `

        #loader {

            position: fixed;

            top: 50%;

            left: 50%;

            transform: translate(-50%, -50%);

            z-index: 1000;

            display: flex;

            align-items: center;

            justify-content: center;

            width: 100vw;

            height: 100vh;

            background: rgba(0, 0, 0, 0.5);

        }

        .spinner {

            width: 50px;

            height: 50px;

            border: 5px solid rgba(255, 255, 255, 0.3);

            border-top: 5px solid white;

            border-radius: 50%;

            animation: spin 1s linear infinite;

        }

        @keyframes spin {

            0% { transform: rotate(0deg); }

            100% { transform: rotate(360deg); }

        }

    `;

    document.head.appendChild(style);





});









export async function enviarCorreo(remitoId) {

    try {

        const response = await fetch('../../server/backend/modules/send-email-remito.php', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/x-www-form-urlencoded',

            },

            body: new URLSearchParams({ id: remitoId }),

        });

        const data = await response.json();



        if (data.success) {



            await fetch('../../server/backend/modules/send-email-notification.php', {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded',

                },

                body: new URLSearchParams({ id: remitoId }),

            });



            alert('Correo enviado correctamente.');

            fetchAndRenderRemitos();

        } else {

            alert(`Error: ${data.message}`);

        }

    } catch (error) {

        console.error('Error al enviar el correo:', error);

        //alert('Ocurrió un error al enviar el correo.');

    }

}



function renderFacturasListGrupo() {

    const fileList = document.getElementById('lista-facturas-UpdateGrupo');

    fileList.innerHTML = ''; // Limpiar la lista visible



    // Mostrar todos los archivos en selectedFiles

    selectedFilesFactGrupo.forEach((file, index) => {

        const listItem = document.createElement('li');

        listItem.textContent = file.name;



        const removeButton = document.createElement('button');

        removeButton.textContent = 'Eliminar';

        removeButton.style.marginLeft = '10px';



        // Agregar evento para eliminar el archivo de la lista

        removeButton.addEventListener('click', () => {

            selectedFilesFactGrupo.splice(index, 1); // Eliminar archivo del arreglo

            renderFacturasListGrupo(); // Volver a renderizar la lista visible

        });



        listItem.appendChild(removeButton);

        fileList.appendChild(listItem);

    });

}



function renderFileList() {

    const fileList = document.getElementById('lista-archivos-update');

    fileList.innerHTML = ''; // Limpiar la lista visible



    // Mostrar todos los archivos en selectedFiles

    selectedFiles.forEach((file, index) => {

        const listItem = document.createElement('li');

        listItem.textContent = file.name;



        const removeButton = document.createElement('button');

        removeButton.textContent = 'Eliminar';

        removeButton.style.marginLeft = '10px';



        // Agregar evento para eliminar el archivo de la lista

        removeButton.addEventListener('click', () => {

            selectedFiles.splice(index, 1); // Eliminar archivo del arreglo

            renderFileList(); // Volver a renderizar la lista visible

        });



        listItem.appendChild(removeButton);

        fileList.appendChild(listItem);

    });

}



function renderFileListFacturados() {

    const fileList = document.getElementById('lista-facturas-Update');

    fileList.innerHTML = ''; // Limpiar la lista visible



    // Mostrar todos los archivos en selectedFiles

    selectedFilesFact.forEach((file, index) => {

        const listItem = document.createElement('li');

        listItem.textContent = file.name;



        const removeButton = document.createElement('button');

        removeButton.textContent = 'Eliminar';

        removeButton.style.marginLeft = '10px';



        // Agregar evento para eliminar el archivo de la lista

        removeButton.addEventListener('click', () => {

            selectedFilesFact.splice(index, 1); // Eliminar archivo del arreglo

            renderFileListFacturados(); // Volver a renderizar la lista visible

        });



        listItem.appendChild(removeButton);

        fileList.appendChild(listItem);

    });

}



document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('facturasUpdateGrupo').addEventListener('change', function (event) {

        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Verificar si el archivo ya está en la lista para evitar duplicados

            if (!selectedFilesFactGrupo.some((f) => f.name === file.name && f.size === file.size)) {

                selectedFilesFactGrupo.push(file); // Agregar archivo a selectedFiles

            }

        });



        renderFacturasListGrupo(); // Renderizar la lista actualizada



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });

});



document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('archivosUpdate').addEventListener('change', function (event) {

        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Verificar si el archivo ya está en la lista para evitar duplicados

            if (!selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {

                selectedFiles.push(file); // Agregar archivo a selectedFiles

            }

        });



        renderFileList(); // Renderizar la lista actualizada



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });

});



document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('facturasUpdate').addEventListener('change', function (event) {

        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Verificar si el archivo ya está en la lista para evitar duplicados

            if (!selectedFilesFact.some((f) => f.name === file.name && f.size === file.size)) {

                selectedFilesFact.push(file); // Agregar archivo a selectedFiles

            }

        });



        renderFileListFacturados(); // Renderizar la lista actualizada



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });

});



export async function abrirFormRemitoUpdate(remitoId) {

    const modal = document.getElementById('modalRemitoUpdate');



    if (modal) {

        modal.classList.add('is-active');

    } else {

        console.error('No se encontró el modal en el DOM.');

        return;

    }



    // Crear y mostrar loader

    const loader = document.createElement('div');

    loader.id = 'loader';

    loader.innerHTML = '<div class="spinner"></div>';

    document.body.appendChild(loader);



    try {

        const response = await fetch(`../../server/backend/modules/get-remito.php?id=${remitoId}`);

        const data = await response.json();

        if (data.success) {

            console.log('Datos del remito:', data.remito);

            // Llenar el formulario con los datos del remito



            document.getElementById('remitoIdUpdate').value = data.remito.id;

            document.getElementById('nro_remitoUpdate').value = data.remito.nroRemito;

            document.getElementById('nro_facturaUpdate').value = data.remito.nroFactura;

            document.getElementById('fechaFacturadoUpdate').value = data.remito.fechaFacturado; // Hacer el campo de solo lectura

            document.getElementById('empresaUpdate').value = data.remito.empresa;

            document.getElementById('empresa_destinoUpdate').value = data.remito.empresa_destino;

            if (data.remito.empresa_destino === 'GO LOGISTISCA' || data.remito.empresa_destino === 'TETRA') {

                fechaFieldUpdate.classList.remove('is-hidden');

                if (data.remito.empresa_destino === 'GO LOGISTISCA') {

                    dominioFieldUpdate.classList.remove('is-hidden');
                    divisionFieldUpdate.classList.remove('is-hidden');

                }

            }


            document.getElementById('fechaUpdate').value = data.remito.fecha;

            document.getElementById('dominioUpdate').value = data.remito.dominio;

            document.getElementById('valor_totalUpdate').value = data.remito.valor_total;

            document.getElementById('valor_IvaUpdate').value = data.remito.valor_total * 1.21;// Hacer el campo de solo lectura

            document.getElementById('emailUpdate').value = data.remito.email;

            document.getElementById('fechaEnvioUpdate').value = data.remito.fechaEnvio;

            document.getElementById('descripcionUpdate').value = data.remito.descripcion;

            document.getElementById('estadoUpdate').value = data.remito.estado;

            document.getElementById('debeUpdate').value = data.remito.debe;

            document.getElementById('detalleUpdate').value = data.remito.detalle;

            document.getElementById('fechaPagoUpdate').value = data.remito.fechaPagado;

            document.getElementById('fechaVencimientoUpdate').value = data.remito.fechaVencimiento;

            document.getElementById('incluirFacturaupdate').checked = data.remito.incluirFacturas == 1;

            document.getElementById('incluirFacturaupdate').value = data.remito.incluirFacturas == 1;

            document.getElementById('incluirArchivosupdate').checked = data.remito.incluirArchivos == 1;

            document.getElementById('incluirArchivosupdate').value = data.remito.incluirArchivos == 1;

            document.getElementById('fechaRemitoUpdate').value = data.remito.fechaRemito;

            document.getElementById('divisionUpdate').value = data.remito.division;



            // Manejar los archivos

            const archivos = data.remito.archivos || [];

            const facturas = data.remito.facturas || [];



            selectedFiles = await Promise.all(

                archivos.map(async (archivo) => {

                    const fileName = archivo.split('/').pop();

                    const fileUrl = `${window.location.origin}/administracion/server/backend/modules/uploads/${fileName}`;



                    // Obtener el archivo como un Blob

                    const response = await fetch(fileUrl);

                    const blob = await response.blob();



                    // Crear un objeto File a partir del Blob

                    const file = new File([blob], fileName, { type: blob.type });



                    return file;

                })

            );



            renderFileList(); // Renderizar los archivos existentes y nuevos



            selectedFilesFact = await Promise.all(

                facturas.map(async (archivo) => {

                    const fileName = archivo.split('/').pop();

                    const fileUrl = `${window.location.origin}/administracion/server/backend/modules/uploads/${fileName}`;



                    // Obtener el archivo como un Blob

                    const response = await fetch(fileUrl);

                    const blob = await response.blob();



                    // Crear un objeto File a partir del Blob

                    const file = new File([blob], fileName, { type: blob.type });



                    return file;

                })

            );

            renderFileListFacturados(); // Renderizar los archivos existentes y nuevos

        } else {

            alert(`Error: ${data.error}`);

        }

    } catch (error) {

        console.error('Error al cargar los datos del remito:', error);

        alert('Ocurrió un error al cargar los datos del remito.');

    } finally {

        // Eliminar loader

        if (loader) {

            loader.remove();

        }

    }

}



// Agregar estilos para el loader

const style = document.createElement('style');

style.innerHTML = `

    #loader {

        position: fixed;

        top: 50%;

        left: 50%;

        transform: translate(-50%, -50%);

        z-index: 1000;

        display: flex;

        align-items: center;

        justify-content: center;

        width: 100vw;

        height: 100vh;

        background: rgba(0, 0, 0, 0.5);

    }

    .spinner {

        width: 50px;

        height: 50px;

        border: 5px solid rgba(255, 255, 255, 0.3);

        border-top: 5px solid white;

        border-radius: 50%;

        animation: spin 1s linear infinite;

    }

    @keyframes spin {

        0% { transform: rotate(0deg); }

        100% { transform: rotate(360deg); }

    }

`;

document.head.appendChild(style);





async function enviarRemitoUpdate() {

    const form = document.getElementById('remitoFormUpdate');

    const formData = new FormData(form);



    // Agregar archivos seleccionados acumulados al FormData

    for (let i = 0; i < selectedFiles.length; i++) {

        formData.append('archivosUpdate[]', selectedFiles[i]);

    }

    for (let i = 0; i < selectedFilesFact.length; i++) {

        formData.append('facturasUpdate[]', selectedFilesFact[i]);

    }





    try {

        const response = await fetch('../../server/backend/update-remito.php', {

            method: 'POST',

            body: formData

        });



        const data = await response.json();



        if (data.success) {

            alert(data.message);

            cerrarModalUpdate();

            //fetchAndRenderRemitos(); // Actualizar la tabla con el remito actualizado

            actualizacionPendiente = true; // Marcar actualización pendiente

        } else {

            alert(`Error: ${data.error}`);

        }

    } catch (error) {

        console.error('Error al enviar los datos del remito:', error);

        alert('Ocurrió un error al intentar actualizar el remito.');

    }

}





function cerrarModalUpdate() {

    const modal = document.getElementById('modalRemitoUpdate');

    if (modal) {

        modal.classList.remove('is-active');

        const form = document.getElementById('remitoFormUpdate');

        if (form) form.reset();

        const remitoId = document.getElementById('remitoFormUpdate');

        if (remitoId) remitoId.value = '';

    }

}



export async function eliminarRemito(remitoId) {

    try {

        // Confirmar antes de eliminar

        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este remito? Esta acción no se puede deshacer.');

        if (!confirmacion) return;



        // Realizar la solicitud al backend para eliminar el remito

        const response = await fetch(`../../server/backend/delete-remito.php?id=${remitoId}`, {

            method: 'DELETE'

        });



        const data = await response.json();



        if (!data.success) {

            console.error(data.error || 'Error desconocido al eliminar el remito');

            alert(`Error al eliminar el remito: ${data.error || 'Error desconocido'}`);

            return;

        }



        // Notificar al usuario que se eliminó correctamente

        alert(`Remito ${remitoId} eliminado exitosamente.`);



        // Recargar la tabla de remitos

        fetchAndRenderRemitos();

    } catch (error) {

        console.error('Error al eliminar el remito:', error);

        alert('Ocurrió un error al intentar eliminar el remito.');

    }

}



function renderArchivos(lista) {

    const basePath = `${window.location.origin}/administracion/server/backend/modules/uploads/`;



    return lista.map(item => {

        const fileName = item.split('/').pop();

        const url = `${basePath}${fileName}`;

        const extension = fileName.split('.').pop().toLowerCase();



        let preview = '';

        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {

            preview = `<img src="${url}" alt="Vista previa" style="max-width: 100%; height: 70vh; display: block; margin-top: 10px;">`;

        } else if (extension === 'pdf') {

            preview = `<iframe src="${url}" style="width: 100%; height: 75vh; border: none;"></iframe>`;

        } else {

            preview = `<span>📄 Archivo disponible</span>`;

        }



        return `

            <li style="margin-bottom: 10px;">

                <a href="${url}" target="_blank" download>Descargar: ${fileName}</a>

                ${preview}

            </li>

        `;

    }).join('');

}



// Mostrar archivos asociados con el remito con vista previa

export async function mostrarArchivos(id) {

    try {

        const response = await fetch(`../../server/backend/modules/fetch-files-remito.php?id=${id}`, {

            cache: 'no-store'

        });

        const data = await response.json();





        if (data.success) {

            const archivos = Array.isArray(data.remito.archivos) ? data.remito.archivos : [];

            const facturas = Array.isArray(data.factura.facturas) ? data.factura.facturas : [];



            const facturasList = facturas.map(factura => {

                const basePath = `${window.location.origin}/administracion/server/backend/modules/uploads/`;

                const fileName = factura.split('/').pop(); // Obtener solo el nombre del archivo

                const urlAbsoluta = `${basePath}${fileName}`;



                // Determinar el tipo de archivo

                const extension = fileName.split('.').pop().toLowerCase();

                let preview = '';



                if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {

                    // Vista previa de imágenes (altura aumentada)

                    preview = `<img src="${urlAbsoluta}" alt="Vista previa" style="max-width: 100%; height: 70vh; display: block; margin-top: 10px;">`;

                } else if (extension === 'pdf') {

                    // Vista previa de PDF con mayor altura

                    preview = `<iframe src="${urlAbsoluta}" style="width: 100%; height: 75vh; border: none;"></iframe>`;

                } else {

                    // Ícono genérico para otros archivos

                    preview = `<span>📄 Archivo disponible</span>`;

                }



                return `

                    <li style="margin-bottom: 10px;">

                        <a href="${urlAbsoluta}" target="_blank" download>

                            Descargar: ${fileName}

                        </a>

                        ${preview}

                    </li>

                `;

            }).join('');



            const archivosList = archivos.map(archivo => {

                const basePath = `${window.location.origin}/administracion/server/backend/modules/uploads/`;

                const fileName = archivo.split('/').pop(); // Obtener solo el nombre del archivo

                const urlAbsoluta = `${basePath}${fileName}`;



                // Determinar el tipo de archivo

                const extension = fileName.split('.').pop().toLowerCase();

                let preview = '';



                if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {

                    // Vista previa de imágenes (altura aumentada)

                    preview = `<img src="${urlAbsoluta}" alt="Vista previa" style="max-width: 100%; height: 70vh; display: block; margin-top: 10px;">`;

                } else if (extension === 'pdf') {

                    // Vista previa de PDF con mayor altura

                    preview = `<iframe src="${urlAbsoluta}" style="width: 100%; height: 75vh; border: none;"></iframe>`;

                } else {

                    // Ícono genérico para otros archivos

                    preview = `<span>📄 Archivo disponible</span>`;

                }



                return `

                    <li style="margin-bottom: 10px;">

                        <a href="${urlAbsoluta}" target="_blank" download>

                            Descargar: ${fileName}

                        </a>

                        ${preview}

                    </li>

                `;

            }).join('');



            const modalContent = `

                <div class="modal is-active" id="modalArchivos"> 

                    <div class="modal-background"></div>

                    <div class="modal-card">

                        <header class="modal-card-head">

                            <p class="modal-card-title">Archivos del Remito ${id}</p>

                            <button class="delete" aria-label="close"></button>

                        </header>

                        <section class="modal-card-body" style="height: 200vh; overflow-y: auto;">

                            <ul>${archivosList}</ul>

                            <ul>${facturasList}</ul>

                        </section>

                        <footer class="modal-card-foot">

                            <button class="button" id="cerrarModalArchivos">Cerrar</button>

                        </footer>

                    </div>

                </div>

            `;



            document.body.insertAdjacentHTML('beforeend', modalContent);



            const modal = document.getElementById('modalArchivos');

            modal.addEventListener('click', (event) => {

                if (event.target.classList.contains('delete') || event.target.id === 'cerrarModalArchivos' || event.target.classList.contains('modal-background')) {

                    cerrarModalArchivos(modal);

                }

            });

        } else {

            alert('No se encontraron archivos para este remito.');

        }

    } catch (error) {

        console.error('Error al obtener los archivos:', error);

        alert('Ocurrió un error al obtener los archivos.');

    }

}







// Cerrar el modal de archivos

function cerrarModalArchivos() {

    const modal = document.getElementById('modalArchivos');

    if (modal) {

        modal.classList.remove('is-active');

        modal.remove();

    }

}



// Llamar la función cuando sea necesario

document.addEventListener('DOMContentLoaded', () => {

    fetchAndRenderRemitos();

    fetchAndRenderRemitosPendientes();

});





export async function fetchAndRenderRemitosPendientes() {

    try {

        // Realizar el fetch al archivo PHP

        const response = await fetch('../../server/backend/modules/fetch-remitos-pendientes.php');

        const data = await response.json();



        if (!data.success) {

            console.error(data.error || 'Error desconocido al obtener remitos');

            return;

        }



        // Obtener el cuerpo de la tabla

        const tableBody = document.getElementById('remitosTablePendientes');



        if (!tableBody) {

            console.error('No se encontró el elemento con ID "remitosTablePendientes"');

            return;

        }



        // Limpiar el contenido actual de la tabla

        tableBody.innerHTML = '';



        // Recorrer los remitos y generar las filas

        data.data.forEach(remito => {

            const row = document.createElement('tr');



            // Crear columnas (td) para cada dato

            row.innerHTML = `       

                <td>${remito.empresa}</td>

                <td>${remito.empresa_destino}</td>

                <td>${remito.total_valor}</td>

            `;

            // Agregar la fila a la tabla

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error('Error al obtener los remitos:', error);

    }

}



let deudasData = []; // Variable para almacenar los datos globalmente



export async function fetchAndRenderDeudas() {

    try {

        // Realizar el fetch al archivo PHP

        const response = await fetch('../../server/backend/modules/fetch-deudas.php');

        const data = await response.json();



        if (!data.success) {

            console.error(data.error || 'Error desconocido al obtener datos');

            return;

        }



        // Guardar los datos obtenidos en memoria

        deudasData = data.data;



        // Renderizar los datos en la tabla

        renderTable(deudasData);

    } catch (error) {

        console.error('Error al obtener las deudas:', error);

    }

}



// Función para renderizar los datos en la tabla

function renderTable(data) {

    const tableBody = document.getElementById('remitoDeudas');



    if (!tableBody) {

        console.error('No se encontró el elemento con ID "remitoDeudas"');

        return;

    }



    // Limpiar el contenido actual de la tabla

    tableBody.innerHTML = '';



    // Recorrer los remitos y generar las filas

    data.forEach(remito => {

        const row = document.createElement('tr');



        // Crear columnas (td) para cada dato

        row.innerHTML = `

            <td class="empresa">${remito.empresa_destino}</td>

            <td class="deuda">${remito.total_deuda}</td>

        `;



        // Agregar la fila a la tabla

        tableBody.appendChild(row);

    });

}





