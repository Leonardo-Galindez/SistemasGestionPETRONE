export function renderFormFiltros() {
    const formFiltros = `
     <div id="modalFiltros" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Filtros Gestión</p>
                    <button class="delete" aria-label="close" id="cerrarFiltrosBtn"></button>
                </header>
                <section class="modal-card-body">
                    <form id="filtrosForm">

                        <div class="field">
                            <label class="label" for="nro_remito">Nro Remito</label>
                            <div class="control">
                                <input class="input" type="text" id="nro_remitoFiltro" name="nro_remitoFiltro">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="nro_factura">Nro Factura</label>
                            <div class="control">
                                <input class="input" type="text" id="nro_facturaFiltro" name="nro_facturaFiltro">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Estado del Remito:</label>
                            <div class="select">
                                <select id="estadoFiltro">
                                    <option value="">Todos</option>
                                    <option value="PendienteSinEnviar">PendienteSinEnviar</option>
                                    <option value="PendientePorFacturar">PendientePorFacturar</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Facturado">Facturado</option>
                                    <option value="Pagado">Pagado</option>
                                    <option value="FacturaRevisada">FacturaRevisada</option>
                                </select>
                            </div>
                        </div>


                        <div class="field">
                            <label class="label">Empresa:</label>
                            <div class="select">
                                <select id="empresaFiltro">
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
                                    <select id="empresa_destinoFiltro" name="empresa_destino">
                                        <option value="" disabled selected>Seleccione una empresa destino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Fecha de Inicio:</label>
                            <div class="control">
                                <input type="date" id="fechaInicioFiltro" class="input">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Fecha de Fin:</label>
                            <div class="control">
                                <input type="date" id="fechaFinFiltro" class="input">
                            </div>
                        </div>

                    </form>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" id="aplicarFiltrosBtn">Aplicar</button>
                    <button class="button" id="cancelarFiltrosBtn">Cancelar</button>
                </footer>
            </div>
        </div>
    `;
    const container = document.querySelector('.gestion');
    if (container) {
        container.insertAdjacentHTML('beforeend', formFiltros);

        // Cargar empresas destino dinámicamente
        fetchEmpresasDestino();
    } else {
        console.error('No se encontró un elemento con la clase "container".');
    }
}

function fetchEmpresasDestino() {
    const selectElement = document.getElementById('empresa_destinoFiltro');

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

export function renderFormFiltrosPendientes() {
    const formFiltrosPendientes = `
     <div id="modalFiltrosPendientes" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Filtros Pendientes</p>
                    <button class="delete" aria-label="close" id="cerrarFiltrosBtnPendientes"></button>
                </header>
                <section class="modal-card-body">
                    <form id="filtrosFormPendientes">
                        <div class="field">
                            <label class="label">Empresa:</label>
                            <div class="select">
                                <select id="empresaFiltroPendientes">
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
                                    <select id="empresa_destinoFiltroPendientes" name="empresa_destino">
                                        <option value="" disabled selected>Seleccione una empresa destino</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        <div class="field">
                            <label class="label">Fecha de Inicio:</label>
                            <div class="control">
                                <input type="date" id="fechaInicioFiltroPendientes" class="input">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Fecha de Fin:</label>
                            <div class="control">
                                <input type="date" id="fechaFinFiltroPendientes" class="input">
                            </div>
                        </div>

                    </form>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" id="aplicarFiltrosBtnPendientes">Aplicar</button>
                    <button class="button" id="cancelarFiltrosBtnPendientes">Cancelar</button>
                </footer>
            </div>
        </div>
    `;
    const container = document.querySelector('.gestion');
    if (container) {
        container.insertAdjacentHTML('beforeend', formFiltrosPendientes);
        fetchEmpresasDestinoPendientes();
    } else {
        console.error('No se encontró un elemento con la clase "container".');
    }
}

function fetchEmpresasDestinoPendientes() {
    const selectElement = document.getElementById('empresa_destinoFiltroPendientes');

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

export function renderFormFiltrosDeudas() {
    const formFiltrosDeudas = `
     <div id="modalFiltrosDeudas" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Filtros Deudas</p>
                    <button class="delete" aria-label="close" id="cerrarFiltrosBtnDeudas"></button>
                </header>
                <section class="modal-card-body">
                    <form id="filtrosFormDeudas">
                        <div class="field">
                            <label class="label">Empresa:</label>
                            <div class="select">
                                <select id="empresaFiltroDeudas">
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
                                    <select id="empresa_destinoFiltroDeudas" name="empresa_destino">
                                        <option value="" disabled selected>Seleccione una empresa destino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Fecha de Inicio:</label>
                            <div class="control">
                                <input type="date" id="fechaInicioFiltroDeudas" class="input">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Fecha de Fin:</label>
                            <div class="control">
                                <input type="date" id="fechaFinFiltroDeudas" class="input">
                            </div>
                        </div>

                    </form>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" id="aplicarFiltrosBtnDeudas">Aplicar</button>
                    <button class="button" id="cancelarFiltrosBtnDeudas">Cancelar</button>
                </footer>
            </div>
        </div>
    `;
    const container = document.querySelector('.gestion');
    if (container) {
        container.insertAdjacentHTML('beforeend', formFiltrosDeudas);
        fetchEmpresasDestinoDeudas();
    } else {
        console.error('No se encontró un elemento con la clase "container".');
    }
}

function fetchEmpresasDestinoDeudas() {
    const selectElement = document.getElementById('empresa_destinoFiltroDeudas');

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
