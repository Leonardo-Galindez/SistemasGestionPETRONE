import { renderHeader } from '../components/header.js';
import { renderBtnAddRemito } from '../components/btn_add_remito.js';
import { renderTotal } from '../components/total.js';
import { renderBtnFiltros,renderBtnFiltrosPendientes,renderBtnFiltrosDeudas } from '../components/btn_filtros.js';



import { renderBtnActualizar } from '../components/btn_actualizar.js';
import { renderBtnSeleccionarRemitos } from '../components/btn_seleccionarRemitos.js';
import { renderBtnEnviarCorreo } from '../components/btn_enviarCorreos.js';
import { renderBtnFacturar } from '../components/btn_facturar.js';
import { renderTableRemitos, renderTableRemitoPendientes,renderTableDeudas } from '../components/table_remitos.js';
import { renderFormRemito,renderFormRemitoUpdate } from '../components/forms_remito.js';
import { renderFormFiltros,renderFormFiltrosDeudas,renderFormFiltrosPendientes } from '../components/forms_filtros.js';

document.addEventListener('DOMContentLoaded', () => {
    renderizarComponentes();
});
 
function renderizarComponentes() {
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
    renderTableRemitos();
    renderTableRemitoPendientes();
    renderTableDeudas();
    
}