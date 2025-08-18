export function renderBtnEnviarCorreo() {
    const btnEnviarCorreo = `
    <button id="btnEnviarCorreos" class="button is-success is-small" style="margin: 0; border-radius: 5px; display: flex; align-items: center; gap: 10px; padding: 10px 20px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); font-weight: bold; font-size: 0.9rem;">
        <span class="icon" style="font-size: 1.2rem;">
            <i class="fas fa-envelope"></i>
        </span>
        <span>Enviar Correo</span>
    </button>`;
    const container = document.querySelector('.control-2');
    if (container) {
        container.insertAdjacentHTML('beforeend', btnEnviarCorreo);
    }
}
