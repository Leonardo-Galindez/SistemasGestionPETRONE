import { renderBtnPagado } from '../components/btn_pagado.js';
import { renderBtnUpdateGrupoRemito } from '../components/btn_actualizarGrupo.js';
import { renderBtnAddGrupoRemito } from '../components/btn_add_grupos_remitos.js';
import { renderFormRemitoGrupos,renderFormRemitoUpdateGrupo } from '../components/forms_remito.js';
document.addEventListener('DOMContentLoaded', () => {
    renderBtnPagado();
    renderBtnAddGrupoRemito();
    renderFormRemitoGrupos();
    renderFormRemitoUpdateGrupo();
    renderBtnUpdateGrupoRemito();
});