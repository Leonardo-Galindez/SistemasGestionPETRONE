import { abrirFormRemitoUpdate, eliminarRemito, mostrarArchivos, enviarCorreo } from './controller_table_remitos.js';



document.addEventListener('DOMContentLoaded', () => {

    const btnFiltros = document.getElementById('btnFiltros');

    const modalFiltros = document.getElementById('modalFiltros');

    const cerrarFiltrosBtn = document.getElementById('cerrarFiltrosBtn');

    const modalBackground = modalFiltros?.querySelector('.modal-background');

    const aplicarFiltrosBtn = document.getElementById('aplicarFiltrosBtn');

    const cancelarFiltrosBtn = document.getElementById('cancelarFiltrosBtn');



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

            aplicarFiltros();

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





let currentPage = 1; // Definir globalmente para que esté accesible en toda la app



function agregarBotonDescarga(fechaInicio, fechaFin, empresaDestino, estado, nroRemito = '', nroFactura = '') {

    const control2 = document.querySelector('.control-2');

    if (!control2) return;



    // URL con todos los filtros como parámetros GET

    const url = `../../server/backend/modules/exportar_remitos.php?fecha_inicio=${encodeURIComponent(fechaInicio)}&fecha_fin=${encodeURIComponent(fechaFin)}&empresaDestino=${encodeURIComponent(empresaDestino)}&estado=${encodeURIComponent(estado)}&nro_remito=${encodeURIComponent(nroRemito)}&nro_factura=${encodeURIComponent(nroFactura)}`;



    let btnDescargar = document.getElementById('btnDescargarRegistro');

    const btnHTML = `

        <a id="btnDescargarRegistro" href="${url}" class="button is-success is-small" 

            style="margin: 0; border-radius: 5px; display: flex; align-items: center; gap: 10px; padding: 10px 20px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); font-weight: bold; font-size: 0.9rem; text-decoration: none;">

            <span class="icon" style="font-size: 1.2rem;">

                <i class="fas fa-file-excel"></i>

            </span>

            <span>Descargar Registro</span>

        </a>`;



    if (!btnDescargar) {

        control2.insertAdjacentHTML('beforeend', btnHTML);

    } else {

        btnDescargar.href = url;

    }

}







// ✅ Eliminar botón si no hay resultados

function quitarBotonDescargaControl2() {

    const boton = document.getElementById('btnDescargarRegistro');

    if (boton) boton.remove();

}



export async function aplicarFiltros(page = 1) {

    const estado = document.getElementById('estadoFiltro')?.value.toLowerCase() || '';

    const empresa = document.getElementById('empresaFiltro')?.value.toLowerCase() || '';

    const empresaDestino = document.getElementById('empresa_destinoFiltro')?.value.toLowerCase() || '';

    const fechaInicio = document.getElementById('fechaInicioFiltro')?.value || '';

    const fechaFin = document.getElementById('fechaFinFiltro')?.value || '';

    const nroRemito = document.getElementById('nro_remitoFiltro')?.value || '';

    const nroFactura = document.getElementById('nro_facturaFiltro')?.value || '';

    //const debe = document.getElementById('debeFiltros')?.value || '';



    const remitosPorPagina = 250; // Asegurar que siempre hay un valor válido



    if (estado === 'facturado') {





    }

    // Crear FormData 

    const formData = new FormData();

    formData.append('estado', estado);

    formData.append('empresa', empresa);

    formData.append('empresaDestino', empresaDestino);

    formData.append('fechaInicio', fechaInicio);

    formData.append('fechaFin', fechaFin);

    formData.append('nroRemito', nroRemito);

    formData.append('nroFactura', nroFactura);

    //formData.append('debe', debe);



    try {

        const response = await fetch(`../../server/backend/modules/fetch_remitos_filtros.php?page=${page}&limit=${remitosPorPagina}`, {

            method: 'POST',

            body: formData,

        });





        //tambien manda los datos a exportar_remitos.php para qeu genere el exccel con los filtros--------------------------------------------------------------------



        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);

        }





        const data = await response.json();





        if (data.success) {

            if (data.user === "transpetrone") {

                agregarBotonDescarga(fechaInicio, fechaFin, empresaDestino, estado, nroRemito, nroFactura);

            }

            const tbody = document.querySelector('#remitosTable');

            if (tbody) {

                tbody.innerHTML = ''; // Limpiar tabla



                if (data.data.length > 0) {

                    renderRemitosTable(data.data, tbody, data.user); // Renderizar datos

                    if (typeof data.totalPages !== 'undefined') {

                        actualizarPaginacionFiltros(page, data.totalPages);

                    } else {

                        console.error('⚠️ totalPages no está definido en la respuesta del backend:', data);

                    }



                    // Solo agregar eventos si la paginación cambia

                    if (data.totalPages > 1) {

                        agregarEventosPaginacionFiltros();

                    }

                } else {

                    renderNoResultsRow(tbody); // Mostrar mensaje "Sin resultados"

                }

            } else {

                console.error('No se encontró el tbody dentro de #remitosTable');

            }

            // Actualizar el totalValor en el componente total

            if (typeof data.totalValor !== 'undefined') {

                actualizarTotalValor(data.totalValor);

            } else {

                console.error('totalValor no está definido en la respuesta del backend:', data);

            }

        } else {

            console.error(`Error en el backend: ${data.message}`);

        }

    } catch (error) {

        console.error('Error en la solicitud:', error);

    }

}



// 🔹 Función para actualizar el total en el componente

function actualizarTotalValor(totalValor) {

    const totalElement = document.getElementById('total');

    if (totalElement) {

        totalElement.textContent = `$${parseFloat(totalValor).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    } else {

        console.error('⚠️ No se encontró el elemento con ID "total".');

    }

}



export function actualizarPaginacionFiltros(currentPage, totalPages) {

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

            aplicarFiltros(selectedPage);

        });

    });



    prevPageBtn.addEventListener("click", () => {

        if (currentPage > 1) aplicarFiltros(currentPage - 1);

    });



    nextPageBtn.addEventListener("click", () => {

        if (currentPage < totalPages) aplicarFiltros(currentPage + 1);

    });

}





export function agregarEventosPaginacionFiltros() {

    const prevPageBtn = document.getElementById('prevPage');

    const nextPageBtn = document.getElementById('nextPage');



    if (prevPageBtn) {

        prevPageBtn.onclick = () => {

            if (currentPage > 1) {

                aplicarFiltros(currentPage - 1);

            }

        };

    }



    if (nextPageBtn) {

        nextPageBtn.onclick = () => {

            if (currentPage < totalPages) {

                aplicarFiltros(currentPage + 1);

            }

        };

    }

}





function renderRemitosTable(remitos, tbody, user) {

    remitos.forEach(remito => {

        const fila = document.createElement('tr');

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



        fila.innerHTML = `

        <td>${remito.id}</td>

                <td class="nroRemito-column">${remito.nroRemito}</td>

                <td>${remito.nroFactura}</td>
                
                ${user === "administrador" ? `<td>${remito.empresa}</td>` : ""}

                <td>${remito.empresa_destino}</td>

                <td>${remito.valor_total}</td>

                ${(user !== "transpetrone" && user !== "nemer") ?
                `<td class="email-column">${remito.email}</td>`
                : ""}

                <td>${remito.estado}</td>

                ${(user === "administrador" || user === "nemer") ? `<td>${remito.debe}</td>` : ""}

                ${user === "abasto" ? `<td>${remito.dominio}</td>` : ""}

                ${user === "administrador" ? `<td>${remito.fechaEnvio}</td>` : ""}

                ${user !== "administrador" ? `<td>${remito.fechaRemito}</td>` : ""}

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





        tbody.appendChild(fila);

        if (user === 'administrador' && !tieneArchivos && !tieneFacturas) {

            fila.style.backgroundColor = '#fe6464'; // Rojo claro

        }

    });

    // Agregar eventos a los botones de eliminar

    document.querySelectorAll('.eliminarRemitoBtn').forEach(button => {

        button.addEventListener('click', () => {

            const remitoId = button.getAttribute('data-id');

            eliminarRemito(remitoId);

        });

    });



    document.querySelectorAll('.actualizarRemitoBtn').forEach(button => {

        button.addEventListener('click', () => {

            const remitoId = button.getAttribute('data-id');

            console.log('Clic en botón actualizar remito:', remitoId);

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

        button.addEventListener('click', () => {

            const remitoId = button.getAttribute('data-id'); // Obtén el ID del remito

            const confirmarEnvio = confirm('¿Deseás enviar el correo del remito?');



            if (!confirmarEnvio) {

                return; // Cancelar si el usuario responde "No"

            }

            if (remitoId) {

                enviarCorreo(remitoId);

            } else {

                alert('El ID del remito no está definido.');

            }

        });

    });

}



function renderNoResultsRow(tbody) {

    const fila = document.createElement('tr');

    fila.innerHTML = `

        <td colspan="7" class="has-text-centered">No se encontraron resultados</td>

    `;

    tbody.appendChild(fila);

}

