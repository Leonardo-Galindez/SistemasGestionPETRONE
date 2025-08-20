import { renderBtnPagado } from '../components/btn_pagado.js';

import { renderBtnUpdateGrupoRemito } from '../components/btn_actualizarGrupo.js';

import { renderFormRemitoUpdateGrupo } from '../components/forms_remito.js';

document.addEventListener('DOMContentLoaded', () => {

    renderBtnPagado();

    renderFormRemitoUpdateGrupo();

    renderBtnUpdateGrupoRemito();

});