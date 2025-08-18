export function renderBtnActualizar() {
    const btnActualizar = ` 
            <button id="btnActualizar" class="button is-warning">
                <span class="icon">
                    <i class="fas fa-sync-alt"></i>
                </span>
                <span>Actualizar</span>
            </button>`;
    const container = document.querySelector('.control-1');
    if (container) {
            container.insertAdjacentHTML('beforeend', btnActualizar);
    }

    document.getElementById("btnActualizar").addEventListener("click", function() {
        location.reload(); // Recarga la página
    });
}
