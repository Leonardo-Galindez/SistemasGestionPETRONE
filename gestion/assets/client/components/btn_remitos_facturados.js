import { fetchAndRenderRemitosFacturados } from '../controllers/controller_table_remitos.js';
export function renderBtnRemitosFacturados() {
    const btnRemitosFacturados = `
    <button id="btnRemitosFacturados" class="button is-success">
        <span class="icon" style="font-size: 1.2rem;">
            <i class="fas fa-file-invoice-dollar"></i>
        </span>
        <span>Remitos Facturados</span>
    </button>`;
    const container = document.querySelector('.control-1');
    if (container) {
        container.insertAdjacentHTML('beforeend', btnRemitosFacturados);
        // Ahora seleccionamos el botón recién insertado
        const btn = document.getElementById('btnRemitosFacturados');
        if (btn) {
            btn.addEventListener('click', () => {
                console.log("hola");
                fetchAndRenderRemitosFacturados();
            });
        }
    }
}