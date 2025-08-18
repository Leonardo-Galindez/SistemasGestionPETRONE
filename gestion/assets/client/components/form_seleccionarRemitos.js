export function renderFormSeleccionar() {
    const formSeleccionar = `
       <div id="modalSeleccionar" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Grupo Remitos</p>
                    <button class="delete" aria-label="close" id="cerrarSeleccionarBtn"></button>
                </header>
                <section class="modal-card-body">
                    <form id="seleccionarForm">

                        <div class="field">
                            <label class="label" for="nro_remito">Nro Remito</label>
                            <div class="control">
                                <input class="input" type="text" id="nro_remitoSeleccionar" name="nro_remitoSeleccionar" placeholder="Nro Remito separados por ;" required>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Empresa:</label>
                            <div class="select">
                                <select id="empresaSeleccionar" name="empresaSeleccionar" required>
                                    <option value="">Todas</option>
                                    <option value="TPOIL">TPOIL</option>
                                    <option value="TRANSPETRONE">TRANSPETRONE</option>
                                    <option value="ABASTO">ABASTO</option>
                                    <option value="NEMER">NEMER</option>
                                </select>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="empresa_destino">Empresa Destino:</label>
                            <div class="control">
                                <div class="select">
                                    <select id="empresa_destinoSeleccionar" name="empresa_destinoSeleccionar" required>
                                        <option value="" disabled selected>Seleccione una empresa destino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </form>
                </section>
                <footer class="modal-card-foot">
    <button class="button is-info" id="enviarCorreoSeleccionarBtn">
        <span class="icon"><i class="fas fa-envelope"></i></span>
        <span>Enviar Correo</span>
    </button>

    <button class="button is-warning" id="facturarSeleccionarBtn">
        <span class="icon"><i class="fas fa-file-invoice-dollar"></i></span>
        <span>Facturar</span>
    </button>

    <button class="button is-success" id="pagarSeleccionarBtn">
        <span class="icon"><i class="fas fa-check-circle"></i></span>
        <span>Pagado</span>
    </button>

    <button class="button is-danger" id="cancelarSeleccionarBtn">
        <span class="icon"><i class="fas fa-times-circle"></i></span>
        <span>Cancelar</span>
    </button>
</footer>

            </div>
        </div>
    `;
    const container = document.querySelector('.gestion');
    if (container) {
        container.insertAdjacentHTML('beforeend', formSeleccionar);
        fetchEmpresasDestino();
    } else {
        console.error('No se encontró un elemento con la clase "container".');
    }
}

function fetchEmpresasDestino() {
    const selectElement = document.getElementById('empresa_destinoSeleccionar');

    if (!selectElement) {
        console.error('El elemento "empresa_destino" no se encontró en el DOM.');
        return;
    }

    fetch('../../server/backend/modules/fetch_clientes.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && Array.isArray(data.data)) {
                selectElement.innerHTML = ''; // Limpia el contenido actual

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Seleccione una empresa destino';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                selectElement.appendChild(defaultOption);

                data.data.forEach(empresa => {
                    if (empresa.empresa_destino) {
                        const option = document.createElement('option');
                        option.value = empresa.empresa_destino;
                        option.textContent = empresa.empresa_destino;
                        selectElement.appendChild(option);
                    }
                });
            } else {
                console.error(data.message || 'Error al obtener las empresas destino.');
            }
        })
        .catch(error => console.error('Error al cargar empresas destino:', error));
}
