export function renderBtnFiltros() {
    const btnFiltros = ` 
            <button id="btnFiltros" class="button is-info">
                <span class="icon">
                    <i class="fas fa-filter"></i>
                </span>
                <span>Filtros</span>
            </button>`;
    const container = document.querySelector('.control-1');
    if (container) {
            container.insertAdjacentHTML('beforeend', btnFiltros);
    }
}

export function renderBtnFiltrosPendientes() {
    const btnFiltrosPendientes = ` 
            <button id="btnFiltrosPendientes" class="button is-info" style="display: none;">
                <span class="icon">
                    <i class="fas fa-filter"></i>
                </span>
                <span>Filtros</span>
            </button>`;
    const container = document.querySelector('.control-1');
    if (container) {
            container.insertAdjacentHTML('beforeend', btnFiltrosPendientes);
    }
}

export function renderBtnFiltrosDeudas() {
    const btnFiltrosDeudas = ` 
            <button id="btnFiltrosDeudas" class="button is-info" style="display: none;">
                <span class="icon">
                    <i class="fas fa-filter"></i>
                </span>
                <span>Filtros</span>
            </button>`;
    const container = document.querySelector('.control-1');
    if (container) {
            container.insertAdjacentHTML('beforeend', btnFiltrosDeudas);
    }
}
