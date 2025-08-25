import { renderTableRemitoPendientes } from '../components/table_remitos.js';

import { fetchAndRenderRemitos, fetchAndRenderDeudas,fetchAndRenderRemitosNemer } from './controller_table_remitos.js';

import { obtenerTotalDeuda, obtenerTotalPendientes } from './controller-valor-total.js';

import { renderHeader } from '../components/header.js';

import { renderBtnPagado } from '../components/btn_pagado.js';



document.addEventListener('DOMContentLoaded', () => {

    renderHeader(); // Asegurar que el header se genera antes de buscar elementos

    

    // Variables para controlar la renderización única

    let gestionRemitosRendered = false;

    let deudasEmpresasRendered = false;

    let gestionRemitosRenderedPendientes = false;

    let gestionRemitosRenderedNemer = false;

    let editarRemitoRendered = false;



    // Delegación de eventos en el documento

    document.addEventListener('click', (event) => {

        const target = event.target;



        if (target.matches('#gestionRemitosLink') || target.matches('#gestionRemitosImg')) {

            event.preventDefault();

            console.log("gestion");

            mostrarTabla('tablaRemitos', () => {

                if (!gestionRemitosRendered) {

                    fetchAndRenderRemitos();

                    actualizarVisibilidadBotones({ crearGrupoRemitos: true ,crearRemito: true, enviarCorreo: true, checkList: true, facturar: true, actualizar: true, paginacion: true, filtros: true, pagado: true, seleccionar: true ,editarGrupoRemito: true });

                    gestionRemitosRendered = true;

                    deudasEmpresasRendered = false;

                    gestionRemitosRenderedPendientes = false;

                    gestionRemitosRenderedNemer = false;

                }

            });

        }



        if (target.matches('#gestionRemitosImgNemer')) {

            console.log("gestionNemer");

            event.preventDefault();

            

            mostrarTabla('tablaRemitos', () => {

                if (!gestionRemitosRenderedNemer) {

                    fetchAndRenderRemitosNemer();

                    actualizarVisibilidadBotones({ crearRemito: true, enviarCorreo: true, checkList: true, facturar: true, actualizar: true, paginacion: true, filtros: true, pagado: true, seleccionar: true });

                    gestionRemitosRenderedNemer = true;

                    gestionRemitosRendered = false;

                    deudasEmpresasRendered = false;

                    gestionRemitosRenderedPendientes = false;

                }

            });

        }



        if (target.matches('#remitosPendientesLink')) {

            event.preventDefault();

            console.log("pendientes");

            mostrarTabla('tablaRemitosPendientes', () => {

                if (!gestionRemitosRenderedPendientes) {

                    obtenerTotalPendientes();

                    renderTableRemitoPendientes();

                    actualizarVisibilidadBotones({ filtrosPendientes: true });

                    gestionRemitosRenderedPendientes = true;

                    deudasEmpresasRendered = false;

                    gestionRemitosRendered = false;

                    gestionRemitosRenderedNemer = false;

                }

            });

        }



        if (target.matches('#deudasEmpresasLink')) {

            event.preventDefault();

            console.log("deudas");

            mostrarTabla('tablaDeudas', () => {

                if (!deudasEmpresasRendered) {

                    obtenerTotalDeuda();

                    fetchAndRenderDeudas();

                    actualizarVisibilidadBotones({ filtrosDeudas: true });

                    deudasEmpresasRendered = true;

                    gestionRemitosRendered = false;

                    gestionRemitosRenderedPendientes = false;

                    gestionRemitosRenderedNemer = false;

                }

            });

        }



        if (target.matches('#excelLink')) {

            event.preventDefault();

            window.open('../views/excel-empresa.html', '_blank');

        }

    });

});



function mostrarTabla(tablaId, callback) {

    document.querySelectorAll('table').forEach(tabla => tabla.style.display = 'none');

    const tabla = document.getElementById(tablaId);

    if (tabla) {

        tabla.style.display = 'table';

        if (callback) callback();

    } else {

        console.error(`No se encontró la tabla con el ID "${tablaId}"`);

    }

}



function actualizarVisibilidadBotones({ crearGrupoRemitos = false,crearRemito = false, enviarCorreo = false, checkList = false, facturar = false, actualizar = false, paginacion = false, filtros = false, filtrosDeudas = false, filtrosPendientes = false, pagado = false,seleccionar = false, editarGrupoRemito = false }) {

    cambiarVisibilidad('btnAgregarRemito', crearRemito);

    cambiarVisibilidad('btnEnviarCorreos', enviarCorreo);

    cambiarVisibilidad('btnMostrarChecklists', checkList);

    cambiarVisibilidad('btnFacturar', facturar);

    cambiarVisibilidad('btnActualizar', actualizar);

    cambiarVisibilidad('paginationContainer', paginacion);

    cambiarVisibilidad('btnFiltros', filtros);

    cambiarVisibilidad('btnFiltrosDeudas', filtrosDeudas);

    cambiarVisibilidad('btnFiltrosPendientes', filtrosPendientes);

    cambiarVisibilidad('btnPagado', pagado);

    cambiarVisibilidad('btnAbrirFormSeleccionar', seleccionar);

    cambiarVisibilidad('btnAgregarGrupoRemito', crearGrupoRemitos);

    cambiarVisibilidad('btnActualizarGrupoRemito', editarGrupoRemito);

}



function cambiarVisibilidad(id, mostrar) {

    const elemento = document.getElementById(id);

    if (elemento) elemento.style.display = mostrar ? 'flex' : 'none';

}

