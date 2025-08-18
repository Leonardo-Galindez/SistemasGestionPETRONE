export function renderBtnAddGrupoRemito() {
    const btnAddGrupoRemito = `
    <button id="btnAgregarGrupoRemito" class="button is-primary" style="margin: 0rem; border-radius: 8px; display: flex; align-items: center; gap: 15px; padding: 15px 30px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); font-weight: bold; font-size: 1.2rem;">
        <span class="icon" style="font-size: 1.5rem;">
            <i class="fas fa-plus" style="font-weight: bold;"></i>
        </span>
        <span style="font-weight: bold;">Grupo de Remitos</span>
    </button>
    `;
    const container = document.querySelector('.addRemito');
    if (container) {
        container.insertAdjacentHTML('beforeend', btnAddGrupoRemito);
    }
}