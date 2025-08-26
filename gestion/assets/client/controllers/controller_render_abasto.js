import { renderBtnPagado } from '../components/btn_pagado.js';

import { renderBtnUpdateGrupoRemito } from '../components/btn_actualizarGrupo.js';

import { renderBtnAddGrupoRemito } from '../components/btn_add_grupos_remitos.js';

import { renderTableRemitosAbasto } from '../components/table_remitos.js';

import { renderFormRemitoGrupos, renderFormRemitoUpdateGrupo } from '../components/forms_remito.js';

import { renderHeader } from '../components/header.js';

import { renderBtnAddRemito } from '../components/btn_add_remito.js';

import { renderTotal } from '../components/total.js';

import { renderBtnFiltros, renderBtnFiltrosPendientes, renderBtnFiltrosDeudas } from '../components/btn_filtros.js';

import { renderBtnActualizar } from '../components/btn_actualizar.js';

import { renderBtnSeleccionarRemitos } from '../components/btn_seleccionarRemitos.js';

import { renderBtnEnviarCorreo } from '../components/btn_enviarCorreos.js';

import { renderBtnFacturar } from '../components/btn_facturar.js';

import { renderTableRemitoPendientes, renderTableDeudas } from '../components/table_remitos.js';

import { renderFormRemito, renderFormRemitoUpdate } from '../components/forms_remito.js';

import { renderFormFiltros, renderFormFiltrosDeudas, renderFormFiltrosPendientes } from '../components/forms_filtros.js';



document.addEventListener('DOMContentLoaded', () => {

    renderTableRemitosAbasto();

    renderHeader();

    renderBtnAddRemito();

    renderFormRemito();

    renderFormRemitoUpdate();

    renderTotal();

    renderBtnFiltros();

    renderBtnFiltrosPendientes();

    renderBtnFiltrosDeudas();

    renderFormFiltros();

    renderFormFiltrosDeudas();

    renderFormFiltrosPendientes();

    renderBtnActualizar();

    renderBtnSeleccionarRemitos();

    renderBtnEnviarCorreo();

    renderBtnFacturar();

    renderTableRemitoPendientes();

    renderTableDeudas();

    renderBtnPagado();

    renderFormRemitoGrupos();

    renderFormRemitoUpdateGrupo();

    renderBtnUpdateGrupoRemito();

    renderBtnAddGrupoRemito();

});