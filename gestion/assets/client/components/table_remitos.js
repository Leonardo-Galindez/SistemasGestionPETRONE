export function renderTableRemitos() {

    const tableRemitos = `

        <table class="table is-striped is-fullwidth" id="tablaRemitos">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Nro</th>

                    <th>Nro Factura</th>

                    <th>Empresa</th>

                    <th>Cliente</th>

                    <th>Total</th>

                    <th>Correo</th>

                    <th>Estado</th>

                    <th>Debe</th>

                    <th>Envio</th>

                    <th>Facturado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="remitosTable"></tbody>

        </table>

        <div class="pagination-container" id="paginationContainer">

            <button id="prevPage" class="button" disabled>

                

            </button>

            <div id="paginationNumbers"></div>

            <button id="nextPage" class="button">

                

            </button>

        </div>

    `;



    const container = document.querySelector('.table');

    if (container) {

        container.innerHTML = tableRemitos;

    }



}

export function renderTableRemitosTranspetrone() {

    const tableRemitos = `

        <table class="table is-striped is-fullwidth" id="tablaRemitos">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Nro</th>

                    <th>Nro Factura</th>

                    <th>Cliente</th>

                    <th>Total</th>

                    <th>Estado</th>

                    <th>Fecha</th>

                    <th>Facturado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="remitosTable"></tbody>

        </table>

        <div class="pagination-container" id="paginationContainer">

            <button id="prevPage" class="button" disabled>

                

            </button>

            <div id="paginationNumbers"></div>

            <button id="nextPage" class="button">

                

            </button>

        </div>

    `;



    const container = document.querySelector('.table');

    if (container) {

        container.innerHTML = tableRemitos;

    }



}

export function renderTableRemitosAbasto() {

    const tableRemitos = `

        <table class="table is-striped is-fullwidth" id="tablaRemitos">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Nro</th>

                    <th>Nro Factura</th>

                    <th>Cliente</th>

                    <th>Total</th>

                    <th>Correo</th>

                    <th>Estado</th>

                    <th>Dominio</th>

                    <th>Fecha</th>

                    <th>Facturado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="remitosTable"></tbody>

        </table>

        <div class="pagination-container" id="paginationContainer">

            <button id="prevPage" class="button" disabled>

                

            </button>

            <div id="paginationNumbers"></div>

            <button id="nextPage" class="button">

                

            </button>

        </div>

    `;



    const container = document.querySelector('.table');

    if (container) {

        container.innerHTML = tableRemitos;

    }



}

export function renderTableRemitosNemer() {

    const tableRemitos = `

        <table class="table is-striped is-fullwidth" id="tablaRemitos">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Nro</th>

                    <th>Nro Factura</th>

                    <th>Cliente</th>

                    <th>Total</th>

                    <th>Estado</th>

                    <th>Debe</th>

                    <th>Fecha</th>

                    <th>Facturado</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="remitosTable"></tbody>

        </table>

        <div class="pagination-container" id="paginationContainer">

            <button id="prevPage" class="button" disabled>

                

            </button>

            <div id="paginationNumbers"></div>

            <button id="nextPage" class="button">

                

            </button>

        </div>

    `;



    const container = document.querySelector('.table');

    if (container) {

        container.innerHTML = tableRemitos;

    }



}




// Agregar estilos para la paginación

const style = document.createElement("style");

style.innerHTML = `

    .pagination-container {

        display: flex;

        justify-content: center;

        align-items: center;

        gap: 10px;

        margin-top: 15px;

    }

    .pagination-btn {

        border: none;

        background: #f0f0f0;

        padding: 6px 12px;

        border-radius: 6px;

        font-weight: bold;

        cursor: pointer;

        transition: 0.3s ease;

    }

    .pagination-btn.active {

        background: #209cee;

        color: white;

    }

    .pagination-btn:hover {

        background: #209cee;

        color: white;

    }

    .pagination-ellipsis {

        padding: 6px;

        font-weight: bold;

    }

    .button.is-info.is-light {

        border-radius: 8px;

        padding: 8px 12px;

        font-weight: bold;

        transition: background 0.3s ease;

    }

    .button.is-info.is-light:hover {

        background: #209cee;

        color: white;

    }

    .button[disabled] {

        opacity: 0.5;

        cursor: not-allowed;

    }

`;

document.head.appendChild(style);



export function renderTableRemitoPendientes() {

    const tableRemitoPendientes = `

        <table class="table is-striped is-fullwidth" id="tablaRemitosPendientes" style="display: none;">

            <thead>

                <tr>

                    <th>Empresa</th>

                    <th>Cliente</th>

                    <th>Valor Total</th>

                </tr>

            </thead>

            <tbody id="remitosTablePendientes">



            </tbody>

        </table>

    `;

    const container = document.querySelector('.table');

    if (container) {

        container.insertAdjacentHTML('beforeend', tableRemitoPendientes);

    }

}



export function renderTableDeudas() {

    const tableDeudas = `

        <table class="table is-striped is-fullwidth" id="tablaDeudas" style="display: none;">

            <thead>

                <tr>

                    <th>Empresa</th>

                    <th>Total Deuda</th>

                </tr>

            </thead>

            <tbody id="remitoDeudas">

            </tbody>

        </table>

    `;



    const container = document.querySelector('.table');

    if (container) {

        container.insertAdjacentHTML('beforeend', tableDeudas);

    }

}