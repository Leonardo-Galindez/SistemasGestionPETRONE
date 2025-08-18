import { fetchAndRenderRemitos, enviarCorreo } from './controller_table_remitos.js';

const selectedFiles = []; // Arreglo para mantener los archivos seleccionados

let selectedFilesGrupos = [];

let selectedFilesFactGrupos = []; // Arreglo para mantener los archivos seleccionados

const selectedFilesFact = []; // Arreglo para mantener los archivos seleccionados

document.addEventListener('DOMContentLoaded', () => {

    const btnAgregarRemito = document.getElementById('btnAgregarRemito');

    if (btnAgregarRemito) {

        btnAgregarRemito.addEventListener('click', () => {

            abrirFormRemito();

            document.getElementById('remitoId').value = ''; // Limpiar el ID

        });

    }



    // Asigna eventos a los botones del modal después de renderizarlo

    document.addEventListener('click', (event) => {

        if (event.target.id === 'cancelarRemito' || event.target.classList.contains('delete')) {

            cerrarModal();

        }

    });



    const guardarRemito = document.getElementById('guardarRemito');



    if (guardarRemito) {

        guardarRemito.addEventListener('click', async (event) => {

            event.preventDefault(); // Prevenir comportamiento por defecto



            if (guardarRemito.disabled) return; // Si ya está deshabilitado, no hacer nada



            guardarRemito.disabled = true; // Deshabilitar el botón



            // Crear y mostrar loader

            const loader = document.createElement('div');

            loader.id = 'loader';

            loader.innerHTML = '<div class="spinner"></div>';

            document.body.appendChild(loader);



            try {

                await enviarRemito(); // Esperar a que se complete el envío

                location.reload();

            } catch (error) {

                console.error("Error al guardar el remito:", error);

            } finally {

                guardarRemito.disabled = false; // Rehabilitar el botón



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



    document.getElementById('facturasGrupo').addEventListener('change', function (event) {

        const fileList = document.getElementById('lista-facturasGrupo');



        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Evitar agregar duplicados

            if (!selectedFilesFactGrupos.some((f) => f.name === file.name && f.size === file.size)) {



                selectedFilesFactGrupos.push(file);

            }

        });



        // Limpiar la lista visible y volver a renderizar los archivos acumulados

        fileList.innerHTML = '';

        selectedFilesFactGrupos.forEach((file, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = file.name;



            // Agregar opción para eliminar el archivo seleccionado

            const removeButton = document.createElement('button');

            removeButton.textContent = 'Eliminar';

            removeButton.style.marginLeft = '10px';

            removeButton.addEventListener('click', () => {

                selectedFilesFactGrupos.splice(index, 1); // Eliminar archivo del arreglo acumulativo

                renderFileListFacturasGrupos(); // Volver a renderizar la lista visible

            });



            listItem.appendChild(removeButton);

            fileList.appendChild(listItem);

        });



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });



    document.getElementById('facturas').addEventListener('change', function (event) {

        const fileList = document.getElementById('lista-facturas');



        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Evitar agregar duplicados

            if (!selectedFilesFact.some((f) => f.name === file.name && f.size === file.size)) {



                selectedFilesFact.push(file);

            }

        });



        // Limpiar la lista visible y volver a renderizar los archivos acumulados

        fileList.innerHTML = '';

        selectedFilesFact.forEach((file, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = file.name;



            // Agregar opción para eliminar el archivo seleccionado

            const removeButton = document.createElement('button');

            removeButton.textContent = 'Eliminar';

            removeButton.style.marginLeft = '10px';

            removeButton.addEventListener('click', () => {

                selectedFilesFact.splice(index, 1); // Eliminar archivo del arreglo acumulativo

                renderFileListFacturas(); // Volver a renderizar la lista visible

            });



            listItem.appendChild(removeButton);

            fileList.appendChild(listItem);

        });



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });



    document.getElementById('archivos').addEventListener('change', function (event) {

        const fileList = document.getElementById('lista-archivos');



        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Evitar agregar duplicados

            if (!selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {



                selectedFiles.push(file);

            }

        });



        // Limpiar la lista visible y volver a renderizar los archivos acumulados

        fileList.innerHTML = '';

        selectedFiles.forEach((file, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = file.name;



            // Agregar opción para eliminar el archivo seleccionado

            const removeButton = document.createElement('button');

            removeButton.textContent = 'Eliminar';

            removeButton.style.marginLeft = '10px';

            removeButton.addEventListener('click', () => {

                selectedFiles.splice(index, 1); // Eliminar archivo del arreglo acumulativo

                renderFileList(); // Volver a renderizar la lista visible

            });



            listItem.appendChild(removeButton);

            fileList.appendChild(listItem);

        });



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });









    // Función para renderizar la lista acumulativa

    function renderFileListFacturas() {



        const fileList = document.getElementById('lista-facturas');

        fileList.innerHTML = '';

        selectedFilesFact.forEach((file, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = file.name;



            const removeButton = document.createElement('button');

            removeButton.textContent = 'Eliminar';

            removeButton.style.marginLeft = '10px';

            removeButton.addEventListener('click', () => {

                selectedFilesFact.splice(index, 1); // Eliminar archivo del arreglo acumulativo

                renderFileListFacturas(); // Volver a renderizar la lista visible

            });



            listItem.appendChild(removeButton);

            fileList.appendChild(listItem);

        });

    }



    function renderFileList() {



        const fileList = document.getElementById('lista-archivos');

        fileList.innerHTML = '';

        selectedFiles.forEach((file, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = file.name;



            const removeButton = document.createElement('button');

            removeButton.textContent = 'Eliminar';

            removeButton.style.marginLeft = '10px';

            removeButton.addEventListener('click', () => {

                selectedFiles.splice(index, 1); // Eliminar archivo del arreglo acumulativo

                renderFileList(); // Volver a renderizar la lista visible

            });



            listItem.appendChild(removeButton);

            fileList.appendChild(listItem);

        });

    }



    document.getElementById('agregarImporte').addEventListener('click', () => {

        const importeField = document.getElementById('importe');

        const valorTotalField = document.getElementById('valor_total');

        // Obtener valores actuales

        const importe = parseFloat(importeField.value) || 0;

        const valorTotal = parseFloat(valorTotalField.value) || 0;



        // Actualizar el valor total

        valorTotalField.value = (valorTotal + importe).toFixed(2);



        // Limpiar el campo de importe

        importeField.value = '';

    });



    document.getElementById('agregarImporteUpdate').addEventListener('click', () => {

        const importeField = document.getElementById('importeUpdate');

        const valorTotalField = document.getElementById('valor_totalUpdate');



        // Obtener valores actuales

        const importe = parseFloat(importeField.value) || 0;

        const valorTotal = parseFloat(valorTotalField.value) || 0;



        // Actualizar el valor total

        valorTotalField.value = (valorTotal + importe).toFixed(2);



        // Limpiar el campo de importe

        importeField.value = '';

    });

});



const remitosGrupo = [];

document.addEventListener('DOMContentLoaded', () => {

    const btnAgregarRemito = document.getElementById('btnAgregarGrupoRemito');

    if (btnAgregarRemito) {

        btnAgregarRemito.addEventListener('click', () => {

            abrirFormRemitoGrupo();

            document.getElementById('remitoIdGrupo').value = ''; // Limpiar el ID

        });

    }



    // Asigna eventos a los botones del modal después de renderizarlo

    document.addEventListener('click', (event) => {

        if (event.target.id === 'cancelarRemitoGrupo' || event.target.classList.contains('delete')) {

            cerrarModalGrupo();

        }

    });



    const guardarRemito = document.getElementById('guardarRemitoGrupo');

    if (guardarRemito) {

        guardarRemito.addEventListener('click', async (event) => {

            event.preventDefault();



            const empresaGrupo = document.getElementById('empresaGrupo').value;

            const empresa_destinoGrupo = document.getElementById('empresa_destinoGrupo').value;

            const nuevaEmpresaDestinoGrupo = document.getElementById('nuevaEmpresaDestinoGrupo').value;

            const emailGrupo = document.getElementById('emailGrupo').value;

            const nroRemitoGrupo = document.getElementById('nro_remitoGrupo').value;

            const fechaRemitoGrupo = document.getElementById('fechaRemitoGrupo').value;

            const nroFacturaGrupo = document.getElementById('nro_facturaGrupo').value;

            const fechaPagoGrupo = document.getElementById('fechaPagoGrupo').value;

            const fechaFacturadoGrupo = document.getElementById('fechaFacturadoGrupo').value;

            const fechaVencimientoGrupo = document.getElementById('fechaVencimientoGrupo').value;

            const fechaGrupo = document.getElementById('fechaGrupo').value;

            const dominioGrupo = document.getElementById('dominioGrupo').value;

            const divisionGrupo = document.getElementById('divisionGrupo').value;

            const valorTotalGrupo = document.getElementById('valor_totalGrupo').value;

            const descripcionGrupo = document.getElementById('descripcionGrupo').value;

            const detalleGrupo = document.getElementById('detalleGrupo').value;

            const debeGrupo = document.getElementById('debeGrupo').value;

            const estadoGrupo = document.getElementById('estadoGrupo').value;

            const incluirArchivosGrupo = document.getElementById('incluirArchivosGrupo').value;

            const incluirFacturasGrupo = document.getElementById('incluirFacturaGrupo').value;



            if (!nroRemitoGrupo) {

                alert("Debes ingresar un número de remito");

                return;

            }





            const remito = {

                empresaGrupo,

                empresa_destinoGrupo,

                nuevaEmpresaDestinoGrupo,

                emailGrupo,

                nroRemitoGrupo,

                fechaRemitoGrupo,

                nroFacturaGrupo,

                fechaPagoGrupo,

                fechaFacturadoGrupo,

                fechaVencimientoGrupo,

                fechaGrupo,

                dominioGrupo,

                divisionGrupo,

                valorTotalGrupo,

                descripcionGrupo,

                detalleGrupo,

                debeGrupo,

                estadoGrupo,

                archivos: [...selectedFilesGrupos],

                facturas: [...selectedFilesFactGrupos],

                incluirArchivosGrupo,

                incluirFacturasGrupo



            };

            remitosGrupo.push(remito);

            selectedFilesGrupos = [];

            selectedFilesFactGrupos = [];

            renderFileListGrupos(); // Vacía la lista en pantalla también

            renderFileListFacturasGrupos();

            mostrarRemitosEnLista();

        });



        function mostrarRemitosEnLista() {

            let lista = document.getElementById("remitosCreadosGrupo");

            if (!lista) {

                lista = document.createElement("div");

                lista.id = "remitosCreadosGrupo";

                document.querySelector("#remitoFormGrupo .modal-card-body").appendChild(lista);

            }



            lista.innerHTML = `

              <hr>

              <label class="label">Remitos Creados:</label>

              <ul>

                ${remitosGrupo.map((r, i) => `<li>${i + 1}: ${r.nroRemitoGrupo}</li>`).join('')}

              </ul>

            `;

        }

    }



    const guardarGrupo = document.getElementById('guardarGrupo');

    if (guardarGrupo) {

        guardarGrupo.addEventListener('click', async (event) => {

            event.preventDefault(); // Prevenir comportamiento por defecto



            if (guardarGrupo.disabled) return; // Si ya está deshabilitado, no hacer nada



            guardarGrupo.disabled = true; // Deshabilitar el botón



            // Crear y mostrar loader

            const loader = document.createElement('div');

            loader.id = 'loader';

            loader.innerHTML = '<div class="spinner"></div>';

            document.body.appendChild(loader);



            try {

                for (const remito of remitosGrupo) {

                    await enviarRemitoGrupo(remito); // Enviar cada remito

                }

                location.reload();

                alert("Todos los remitos fueron enviados correctamente.");

            } catch (error) {

                console.error("Error al guardar el remito:", error);

            } finally {

                guardarGrupo.disabled = false; // Rehabilitar el botón

                // Eliminar loader

                if (loader) {

                    loader.remove();

                }

            }

        });

    }



    document.getElementById('archivosGrupo').addEventListener('change', function (event) {

        const fileList = document.getElementById('lista-archivosGrupo');



        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Evitar agregar duplicados

            if (!selectedFilesGrupos.some((f) => f.name === file.name && f.size === file.size)) {



                selectedFilesGrupos.push(file);

            }

        });



        // Limpiar la lista visible y volver a renderizar los archivos acumulados

        fileList.innerHTML = '';

        selectedFilesGrupos.forEach((file, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = file.name;



            // Agregar opción para eliminar el archivo seleccionado

            const removeButton = document.createElement('button');

            removeButton.textContent = 'Eliminar';

            removeButton.style.marginLeft = '10px';

            removeButton.addEventListener('click', () => {

                selectedFilesGrupos.splice(index, 1); // Eliminar archivo del arreglo acumulativo

                renderFileListGrupos(); // Volver a renderizar la lista visible

            });



            listItem.appendChild(removeButton);

            fileList.appendChild(listItem);

        });



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });



    document.getElementById('facturasGrupo').addEventListener('change', function (event) {

        const fileList = document.getElementById('lista-facturasGrupo');



        // Agregar los nuevos archivos al arreglo acumulativo

        Array.from(event.target.files).forEach((file) => {

            // Evitar agregar duplicados

            if (!selectedFilesFactGrupos.some((f) => f.name === file.name && f.size === file.size)) {



                selectedFilesFactGrupos.push(file);

            }

        });



        // Limpiar la lista visible y volver a renderizar los archivos acumulados

        fileList.innerHTML = '';

        selectedFilesFactGrupos.forEach((file, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = file.name;



            // Agregar opción para eliminar el archivo seleccionado

            const removeButton = document.createElement('button');

            removeButton.textContent = 'Eliminar';

            removeButton.style.marginLeft = '10px';

            removeButton.addEventListener('click', () => {

                selectedFilesFactGrupos.splice(index, 1); // Eliminar archivo del arreglo acumulativo

                renderFileListGrupos(); // Volver a renderizar la lista visible

            });



            listItem.appendChild(removeButton);

            fileList.appendChild(listItem);

        });



        // Resetear el input para permitir subir el mismo archivo si se elimina

        event.target.value = '';

    });



    document.getElementById('agregarImporteGrupo').addEventListener('click', () => {

        const importeField = document.getElementById('importeGrupo');

        const valorTotalField = document.getElementById('valor_totalGrupo');



        // Obtener valores actuales

        const importe = parseFloat(importeField.value) || 0;

        const valorTotal = parseFloat(valorTotalField.value) || 0;



        // Actualizar el valor total

        valorTotalField.value = (valorTotal + importe).toFixed(2);



        // Limpiar el campo de importe

        importeField.value = '';

    });



});



function renderFileListFacturasGrupos() {



    const fileList = document.getElementById('lista-facturasGrupo');

    fileList.innerHTML = '';

    selectedFilesFactGrupos.forEach((file, index) => {

        const listItem = document.createElement('li');

        listItem.textContent = file.name;



        const removeButton = document.createElement('button');

        removeButton.textContent = 'Eliminar';

        removeButton.style.marginLeft = '10px';

        removeButton.addEventListener('click', () => {

            selectedFilesFactGrupos.splice(index, 1); // Eliminar archivo del arreglo acumulativo

            renderFileListFacturasGrupos(); // Volver a renderizar la lista visible

        });



        listItem.appendChild(removeButton);

        fileList.appendChild(listItem);

    });

}



function renderFileListGrupos() {



    const fileList = document.getElementById('lista-archivosGrupo');

    fileList.innerHTML = '';

    selectedFilesGrupos.forEach((file, index) => {

        const listItem = document.createElement('li');

        listItem.textContent = file.name;



        const removeButton = document.createElement('button');

        removeButton.textContent = 'Eliminar';

        removeButton.style.marginLeft = '10px';

        removeButton.addEventListener('click', () => {

            selectedFilesGrupos.splice(index, 1); // Eliminar archivo del arreglo acumulativo

            renderFileListGrupos(); // Volver a renderizar la lista visible

        });



        listItem.appendChild(removeButton);

        fileList.appendChild(listItem);

    });

}



function abrirFormRemitoGrupo() {

    const modal = document.getElementById('modalRemitoGrupo');

    if (modal) modal.classList.add('is-active');

    const modalBackground = modal?.querySelector('.modal-background');

    // Cerrar el modal al hacer clic en el fondo

    if (modalBackground) {

        modalBackground.addEventListener('click', () => {

            modal.classList.remove('is-active');

        });

    }

}



function cerrarModalGrupo() {

    const modal = document.getElementById('modalRemitoGrupo');

    if (modal) {

        modal.classList.remove('is-active');

        const form = document.getElementById('remitoFormGrupo');

        if (form) form.reset();

        const remitoId = document.getElementById('remitoIdGrupo');

        if (remitoId) remitoId.value = '';



    }

}



async function enviarRemitoGrupo(remito) {

    const formData = new FormData();

    formData.append('empresa', remito.empresaGrupo);

    formData.append('empresa_destino', remito.empresa_destinoGrupo);

    formData.append('division', remito.divisionGrupo);

    formData.append('nueva_empresa_destino', remito.nuevaEmpresaDestinoGrupo);

    formData.append('debe', remito.debeGrupo);

    formData.append('descripcion', remito.descripcionGrupo);

    formData.append('detalle', remito.detalleGrupo);

    formData.append('dominio', remito.dominioGrupo);

    formData.append('email', remito.emailGrupo);

    formData.append('estado', remito.estadoGrupo);

    formData.append('fecha', remito.fechaGrupo);

    formData.append('fechaPago', remito.fechaPagoGrupo);

    formData.append('fechaFacturado', remito.fechaFacturadoGrupo);

    formData.append('fechaVencimiento', remito.fechaVencimientoGrupo);

    formData.append('nro_remito', remito.nroRemitoGrupo);

    formData.append('fechaRemito', remito.fechaRemitoGrupo);

    formData.append('nro_factura', remito.nroFacturaGrupo);

    formData.append('valor_total', remito.valorTotalGrupo);

    formData.append('incluirArchivos', remito.incluirArchivosGrupo);

    formData.append('incluirFacturas', remito.incluirFacturasGrupo);



    if (remito.archivos && remito.archivos.length > 0) {

        for (let i = 0; i < remito.archivos.length; i++) {

            formData.append('archivos[]', remito.archivos[i]);

        }

    }



    if (remito.facturas && remito.facturas.length > 0) {

        for (let i = 0; i < remito.facturas.length; i++) {

            formData.append('facturas[]', remito.facturas[i]);

        }

    }



    for (let pair of formData.entries()) {

        console.log(`${pair[0]}:`, pair[1]);

    }



    try {

        const response = await fetch('../../server/backend/add-remito.php', {

            method: 'POST',

            body: formData,

        });



        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);

        }



        const data = await response.json();



        if (data.success) {

            agregarRemitoATabla(data.remito); // Asegúrate de que esta función maneje correctamente los datos.

            cerrarModal();



            //selectedFiles limpiar el arreglo 

        } else {

            alert(`Error: ${data.error}`);

        }

    } catch (error) {

        console.error('Error al enviar remito:', error);

        alert(`Error: ${error.message}`);

    }

}

function abrirFormRemito() {

    const modal = document.getElementById('modalRemito');

    if (modal) modal.classList.add('is-active');

    const modalBackground = modal?.querySelector('.modal-background');

    // Cerrar el modal al hacer clic en el fondo

    if (modalBackground) {

        modalBackground.addEventListener('click', () => {

            modal.classList.remove('is-active');

        });

    }

}



function cerrarModal() {

    const modal = document.getElementById('modalRemito');

    if (modal) {

        modal.classList.remove('is-active');

        const form = document.getElementById('remitoForm');

        if (form) form.reset();

        const remitoId = document.getElementById('remitoId');

        if (remitoId) remitoId.value = '';



    }

}



async function enviarRemito() {

    const form = document.getElementById('remitoForm');



    const formData = new FormData(form);



    // Agregar archivos seleccionados acumulados al FormData

    for (let i = 0; i < selectedFiles.length; i++) {

        formData.append('archivos[]', selectedFiles[i]);

    }





    for (let i = 0; i < selectedFilesFact.length; i++) {

        formData.append('facturas[]', selectedFilesFact[i]);

    }



    try {

        const response = await fetch('../../server/backend/add-remito.php', {

            method: 'POST',

            body: formData,

        });



        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);

        }



        const data = await response.json();



        if (data.success) {

            agregarRemitoATabla(data.remito); // Asegúrate de que esta función maneje correctamente los datos.

            cerrarModal();



            //selectedFiles limpiar el arreglo 

        } else {

            alert(`Error: ${data.error}`);

        }

    } catch (error) {

        console.error('Error al enviar remito:', error);

        alert(`Error: ${error.message}`);

    }

}





// Función para agregar el remito a la tabla dinámicamente

function agregarRemitoATabla(remito) {

    const tableBody = document.getElementById('remitosTable');

    if (!tableBody) {

        console.error('No se encontró el cuerpo de la tabla de remitos');

        return;

    }



    const row = document.createElement('tr');

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

                        <button class="button is-info is-small mostrarArchivosRemitoBtn" data-id="${remito.id}">

                            <span class="icon"><i class="fas fa-folder-open"></i></span>

                        </button>

                        <button class="button is-success is-small enviarCorreoRemitoBtn" data-id="${remito.id}">

                            <span class="icon"><i class="fas fa-envelope"></i></span>

                        </button>

                    </td>

    `;

    /*if (remito.estado === 'Facturado') {

        enviarCorreo(remito.id);

    }*/



    fetchAndRenderRemitos();

    //location.reload();

    tableBody.appendChild(row);

}





