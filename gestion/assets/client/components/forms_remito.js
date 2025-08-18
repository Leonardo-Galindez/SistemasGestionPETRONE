export function renderFormRemito() {

    const formRemito = `

        <div id="modalRemito" class="modal">

            <div class="modal-background"></div>

            <div class="modal-card">

                <header class="modal-card-head">

                    <p class="modal-card-title">Nuevo Remito</p>

                    <button class="delete" aria-label="close"></button>

                </header>

                <section class="modal-card-body">

                    <form id="remitoForm" enctype="multipart/form-data">

                        <!-- Campo oculto para el ID del remito -->

                        <input type="hidden" id="remitoId" name="id">



                        <!-- Campo oculto para los archivos existentes -->

                        <input type="hidden" id="archivosExistentes" name="archivos_existentes" value="[]">

                        <div class="field">

                            <div class="columns">

                                <div class="column">

                                    <div class="field">

                                        <label class="label" for="nro_remito">Nro Remito</label>

                                        <div class="control">

                                            <input class="input" type="text" id="nro_remito" name="nro_remito">

                                        </div>

                                    </div>

                                </div>

                                <div class="column">

                                    <div class="field">

                                        <label class="label" for="fecha">Fecha Remito</label>

                                        <div class="control">

                                            <input class="input" type="date" id="fechaRemito" name="fechaRemito">

                                        </div>

                                    </div>

                               </div>

                            </div>

                        </div>

                        <div class="field">



                            <div class="columns">

                            

                                <div class="column">

                                    <div class="field">

                                        <label class="label" for="nro_factura">Nro Factura</label>

                                        <div class="control">

                                            <input class="input" type="text" id="nro_factura" name="nro_factura">

                                        </div>

                                    </div>

                                </div>

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="fecha">Fecha Pago</label>

                                    <div class="control">

                                        <input class="input" type="date" id="fechaPago" name="fechaPago">

                                    </div>

                                </div>

                            </div>



                            <div class="column">

                                <div class="field">

                                    <label class="label" for="fecha">Fecha Facturado</label>

                                    <div class="control">

                                        <input class="input" type="date" id="fechaFacturado" name="fechaFacturado">

                                    </div>

                                </div>

                                </div>

                            </div>  

                        </div>

                    <div class="field is-hidden" id="vencimientoField">

                        <label class="label" for="fecha">Fecha Vencimiento</label>

                            <div class="control">

                                <input class="input" type="date" id="fechaVencimiento" name="fechaVencimiento">

                            </div>                 

                    </div>

                    <div class="field">

                       <div class="columns">

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="empresa">Empresa</label>

                                    <div class="control">

                                        <div class="select">

                                            <select id="empresa" name="empresa">

                                                <option value="" disabled selected>Seleccione una empresa</option>

                                                <option value="TPOIL" selected>TPOIL</option>

                                                <option value="TRANSPETRONE">TRANSPETRONE</option>

                                                <option value="ABASTO">ABASTO</option>

                                                <option value="NEMER">NEMER</option>

                                            </select>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="empresa_destino">Empresa Destino</label>

                                    <div class="control">

                                        <div class="select">

                                            <select id="empresa_destino" name="empresa_destino">

                                                <option value="" disabled selected>Seleccione una empresa destino</option>

                                            </select>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                        <div class="field is-hidden" id="fechaField">

                            <label class="label" for="fecha">Fecha:</label>

                            <div class="control">

                                <input class="input" type="date" id="fecha" name="fecha">

                            </div>

                        </div>

                    <div class="field">

                        <div class="columns">

                            <div class="column">    

                                <div class="field is-hidden" id="nuevaEmpresaDestinoField">

                                    <label class="label" for="nuevaEmpresaDestino">Nueva Empresa Destino</label>

                                    <div class="control">

                                        <input class="input" type="text" id="nuevaEmpresaDestino" name="nueva_empresa_destino" placeholder="Nombre de la nueva empresa destino">

                                    </div>

                                </div>

                            </div>

                        </div>

                     

                    <div class="field">

                        <div class="columns">

                            <div class="column">

                                <div class="field is-hidden" id="dominioField">

                                    <label class="label" for="dominio">Dominio</label>

                                    <div class="control">

                                        <input class="input" type="text" id="dominio" name="dominio" placeholder="Ingrese el dominio">

                                    </div>

                                </div>

                            </div>

                            <div class="column">

                                <div class="field is-hidden" id="divisionField">

                                    <label class="label" for="division">División</label>

                                    <div class="control">

                                        <div class="select is-fullwidth">

                                            <select id="division" name="division">

                                                <option value="CS">CS</option>

                                                <option value="IND">IND</option>

                                            </select>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div> 

                    <div class="field">

                        <div class="columns">

                                <div class="column"> 

                                    <div class="field">  

                                        <label class="label" for="importe">Importe</label>

                                        <div class="control has-addons">

                                            <input class="input" type="number" id="importe" name="importe" placeholder="Ingrese un importe">

                                            <button type="button" id="agregarImporte">Agregar</button>

                                        </div>

                                    </div>

                                </div>

                                <div class="column">

                                    <div class="field">

                                        <label class="label" for="valor_total">Valor Total</label>

                                        <div class="control">

                                            <input class="input" type="number" id="valor_total" name="valor_total">

                                        </div>

                                    </div>

                                </div>               

                        </div>

                    </div>

                    

                    <div class="field">

                        <div class="columns">

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="archivos">Cargar Remitos</label>

                                    <div class="control">

                                        <input class="input" type="file" id="archivos" name="archivos[]" multiple>

                                    </div>

                                </div>

                            </div>

                            <div class="column">

                                <div class="field">

                                    <label class="label">Remitos</label>

                                    <ul id="lista-archivos">

                                        <!-- Aquí se mostrarán los archivos subidos -->

                                    </ul>

                                </div>

                            </div>

                            <div class="column is-1 has-text-right">

                                <div class="field">

                                     <label class="label"></label>

                                    <input type="checkbox" id="incluirArchivos" name="incluirArchivos" onchange="this.value = this.checked" checked>

                                </div>

                            </div>

                        </div>

                    </div>     

                    

                    <div class="field">

                        <div class="columns">

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="facturas">Cargar Facturas</label>

                                    <div class="control">

                                        <input class="input" type="file" id="facturas" name="facturas[]" multiple>

                                    </div>

                                </div>

                            </div>

                            <div class="column">

                                <div class="field">

                                    <label class="label">Facturas</label>

                                    <ul id="lista-facturas">

                                        <!-- Aquí se mostrarán los facturas subidas -->

                                    </ul>

                                </div>

                            </div>

                            <div class="column is-1 has-text-right">

                                <div class="field">

                                    <label class="label"></label>

                                    <input type="checkbox" id="incluirFacturas" name="incluirFacturas" onchange="this.value = this.checked" checked>

                                </div>

                            </div>

                        </div>

                    </div>  



                        <div class="field">

                            <label class="label" for="email">Correo Electrónico del Cliente</label>

                            <div class="control">

                                <input class="input" list="emailSuggestions" type="email" id="email" name="email" >

                                <datalist id="emailSuggestions">

                                    <!-- Aquí se cargan las opciones -->

                                </datalist>

                            </div>

                        </div>



                        <div class="field  is-hidden">

                            <label class="label" for="fecha">Fecha Envio:</label>

                            <div class="control">

                                <input class="input" type="date" id="fechaEnvio" name="fechaEnvio">

                            </div>

                        </div>



                        <div class="field">

                            <label class="label" for="descripcion">Descripción</label>

                            <div class="control">

                                <textarea class="textarea" id="descripcion" name="descripcion" placeholder="Escribe aquí la descripción para el cliente"></textarea>

                            </div>

                        </div>



                        <div class="field">

                            <label class="label" for="detalle">Detalle</label>

                            <div class="control">

                                <textarea class="textarea" id="detalle" name="detalle" placeholder="Escribe aquí el detalle del remito para el sistema"></textarea>

                            </div>

                        </div>

                    <div class="field">

                        <div class="columns">

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="debe">Debe</label>

                                    <div class="select">

                                        <select id="debe" name="debe">

                                            <option value="" disabled selected>Seleccione una opción</option>

                                            <option value=""></option>

                                            <option value="listo">listo</option>

                                            <option value="certificado">certificado</option>

                                            <option value="remito">remito</option>

                                            <option value="pesada">pesada</option>

                                            <option value="ordenDeCompra">ordenDeCompra</option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="estado">Estado del Remito</label>

                                    <div class="select">

                                        <select id="estado" name="estado">

                                            <option value="PendienteSinEnviar">PendienteSinEnviar</option>

                                            <option value="PendientePorFacturar">PendientePorFacturar</option>

                                            <option value="Facturado">Facturado</option>

                                            <option value="Pagado">Pagado</option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    </form>

                </section>

                <footer class="modal-card-foot">

                    <button class="button is-success" id="guardarRemito">Guardar Remito</button>

                    <button class="button" id="cancelarRemito">Cancelar</button>

                </footer>

            </div>

        </div>

    `;

    const container = document.querySelector('.gestion');

    if (container) {

        container.insertAdjacentHTML('beforeend', formRemito);



        // Mostrar/Ocultar campo para nueva empresa destino al seleccionar "OTRA"

        const selectEmpresaDestino = document.getElementById('empresa_destino');

        const nuevaEmpresaDestinoField = document.getElementById('nuevaEmpresaDestinoField');

        const nroRemito = document.getElementById('nro_remito');

        const email = document.getElementById('email');

        const fechaInput = document.getElementById('fechaFacturado');

        const vencimientoField = document.getElementById('vencimientoField');

        fechaInput.addEventListener('input', () => {

            if (fechaInput.value) {

                vencimientoField.classList.remove('is-hidden');

            }

        });

        selectEmpresaDestino.addEventListener('change', () => {

            if (selectEmpresaDestino.value === 'OTRA') {

                nuevaEmpresaDestinoField.classList.remove('is-hidden');

            } else {

                nuevaEmpresaDestinoField.classList.add('is-hidden');

            }

            // Precargar el número de remito si es SULLAIR

            if (selectEmpresaDestino.value === 'SULLAIR') {

                nroRemito.value = '0106-000';

            }





            if (selectEmpresaDestino.value === 'ABASTO') {

                email.value = 'administracion@abastonqn.com.ar';

            }

            if (selectEmpresaDestino.value === 'GO LOGISTISCA' || selectEmpresaDestino.value === 'TETRA') {

                console.log(selectEmpresaDestino.value);

                fechaField.classList.remove('is-hidden');

                if (selectEmpresaDestino.value === 'GO LOGISTISCA') {

                    email.value = 'claudiogabriel.bonaparte@nov.com;Gilberto.Solis@nov.com'

                    dominioField.classList.remove('is-hidden');
                    divisionField.classList.remove('is-hidden');

                } else {

                    email.value = 'lMendoza@tetratec.com;dgimenez@onetetra.com'

                    dominioField.classList.add('is-hidden');
                    divisionField.classList.add('is-hidden');

                }

            } else {

                fechaField.classList.add('is-hidden');

            }

        });

        fetchEmpresasDestino();

        fetchEmails();

    }

}



function fetchEmails() {

    fetch('../../server/backend/modules/fetch_emails.php')

        .then(response => response.json())

        .then(data => {

            if (data.success && Array.isArray(data.emails)) {

                const datalist = document.getElementById('emailSuggestions');

                datalist.innerHTML = ''; // Limpiar el datalist



                // Agregar opciones dinámicamente

                data.emails.forEach(email => {

                    const option = document.createElement('option');

                    option.value = email;

                    datalist.appendChild(option);

                });

            } else {

                console.error(data.error || 'Error al obtener los correos electrónicos');

            }

        })

        .catch(error => console.error('Error en la solicitud:', error));

}



function fetchEmpresasDestino() {

    fetch('../../server/backend/modules/fetch_clientes.php')

        .then(response => response.json())

        .then(data => {

            if (data.success && Array.isArray(data.data)) {

                const selectElement = document.getElementById('empresa_destino');

                data.data.forEach(empresa => {

                    const option = document.createElement('option');

                    option.value = empresa.empresa_destino;

                    option.textContent = empresa.empresa_destino;

                    selectElement.appendChild(option);

                });



                // Agregar opción "OTRA"

                const otraOption = document.createElement('option');

                otraOption.value = 'OTRA';

                otraOption.textContent = 'OTRA';

                selectElement.appendChild(otraOption);

            } else {

                console.error(data.message || 'Error al obtener las empresas destino');

            }

        })

        .catch(error => console.error('Error al cargar empresas destino:', error));

}



function fetchEmpresasDestinoUpdate() {

    fetch('../../server/backend/modules/fetch_clientes.php')

        .then(response => response.json())

        .then(data => {

            if (data.success && Array.isArray(data.data)) {

                const selectElement = document.getElementById('empresa_destinoUpdate');

                data.data.forEach(empresa => {

                    const option = document.createElement('option');

                    option.value = empresa.empresa_destino;

                    option.textContent = empresa.empresa_destino;

                    selectElement.appendChild(option);

                });



                // Agregar opción "OTRA"

                const otraOption = document.createElement('option');

                otraOption.value = 'OTRA';

                otraOption.textContent = 'OTRA';

                selectElement.appendChild(otraOption);

            } else {

                console.error(data.message || 'Error al obtener las empresas destino');

            }

        })

        .catch(error => console.error('Error al cargar empresas destino:', error));

}





export function renderFormRemitoGrupos() {

    const formRemitoGrupos = `

        <div id="modalRemitoGrupo" class="modal">

            <div class="modal-background"></div>

            <div class="modal-card">

                <header class="modal-card-head">

                    <p class="modal-card-title">Nuevo Grupo</p>

                    <button class="delete" aria-label="close"></button>

                </header>

                <section class="modal-card-body ">

                    <form id="remitoFormGrupo" enctype="multipart/form-data" >



                        <div class="field">

                            <div class="columns">

                                <div class="column">

                                    <div class="field">

                                        <label class="label" for="empresa">Empresa</label>

                                        <div class="control">

                                            <div class="select">

                                                <select id="empresaGrupo" name="empresaGrupo">

                                                    <option value="" disabled selected>Seleccione una empresa</option>

                                                    <option value="TPOIL" selected>TPOIL</option>

                                                    <option value="TRANSPETRONE">TRANSPETRONE</option>

                                                    <option value="ABASTO">ABASTO</option>

                                                    <option value="NEMER">NEMER</option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div class="column">

                                    <div class="field">

                                        <label class="label" for="empresa_destino">Empresa Destino</label>

                                        <div class="control">

                                            <div class="select">

                                                <select id="empresa_destinoGrupo" name="empresa_destinoGrupo">

                                                    <option value="" disabled selected>Seleccione una empresa destino</option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div class="field">

                            <div class="columns">

                                <div class="column">    

                                    <div class="field is-hidden" id="nuevaEmpresaDestinoFieldGrupo">

                                        <label class="label" for="nuevaEmpresaDestino">Nueva Empresa Destino</label>

                                        <div class="control">

                                            <input class="input" type="text" id="nuevaEmpresaDestinoGrupo" name="nueva_empresa_destinoGrupo" placeholder="Nombre de la nueva empresa destino">

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div class="field">

                            <label class="label" for="email">Correo Electrónico del Cliente</label>

                            <div class="control">

                                <input class="input" list="emailSuggestions" type="email" id="emailGrupo" name="emailGrupo" >

                                <datalist id="emailSuggestions">

                                    <!-- Aquí se cargan las opciones -->

                                </datalist>

                            </div>

                        </div>



                        

                        <header class="modal-card-head">

                            <p class="modal-card-title">Nuevo Remito</p>

                        </header>

                        <section class="modal-card-body has-background-light">

                            <form id="remitoFormIndividual" enctype="multipart/form-data">



                                <input type="hidden" id="remitoIdGrupo" name="id">

                                <input type="hidden" id="archivosExistentesGrupo" name="archivos_existentesGrupo" value="[]">

                                <div class="field">

                                    <div class="columns">

                                        <div class="column">

                                            <div class="field">

                                                <label class="label" for="nro_remito">Nro Remito</label>

                                                <div class="control">

                                                    <input class="input" type="text" id="nro_remitoGrupo" name="nro_remitoGrupo">

                                                </div>

                                            </div>

                                        </div>

                                        <div class="column">

                                            <div class="field">

                                                <label class="label" for="nro_factura">Nro Factura</label>

                                                <div class="control">

                                                    <input class="input" type="text" id="nro_facturaGrupo" name="nro_facturaGrupo">

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div class="field">

                                    <div class="columns">

                                    <div class="column">

                                        <div class="field">

                                            <label class="label" for="fechaPago">Fecha Pago</label>

                                            <div class="control">

                                                <input class="input" type="date" id="fechaPagoGrupo" name="fechaPagoGrupo">

                                            </div>

                                        </div>

                                    </div>



                                    <div class="column">

                                        <div class="field">

                                            <label class="label" for="fecha">Fecha Facturado</label>

                                            <div class="control">

                                                <input class="input" type="date" id="fechaFacturadoGrupo" name="fechaFacturadoGrupo">

                                            </div>

                                        </div>

                                        </div>

                                    </div>  

                                </div>

                                <div class="field is-hidden" id="vencimientoFieldGrupo">

                                    <label class="label" for="fecha">Fecha Vencimiento</label>

                                        <div class="control">

                                            <input class="input" type="date" id="fechaVencimientoGrupo" name="fechaVencimientoGrupo">

                                        </div>                 

                                </div>

                            

                                <div class="field is-hidden" id="fechaFieldGrupo">

                                    <label class="label" for="fecha">Fecha</label>

                                    <div class="control">

                                        <input class="input" type="date" id="fechaGrupo" name="fechaGrupo">

                                    </div>

                                </div>

                            

                                <div class="columns">

                                    <div class="column">

                                        <div class="field is-hidden" id="dominioFieldGrupo">

                                            <label class="label" for="dominio">Dominio</label>

                                            <div class="control">

                                                <input class="input" type="text" id="dominioGrupo" name="dominioGrupo" placeholder="Ingrese el dominio">

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column">

                                        <div class="field is-hidden" id="divisionFieldGrupo">

                                            <label class="label" for="division">División</label>

                                            <div class="control">

                                                <div class="select is-fullwidth">

                                                    <select id="divisionGrupo" name="divisionGrupo">

                                                        <option value="CS">CS</option>

                                                        <option value="IND">IND</option>

                                                    </select>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div class="field">

                                    <div class="columns">

                                            <div class="column"> 

                                                <div class="field">  

                                                    <label class="label" for="importe">Importe</label>

                                                    <div class="control has-addons">

                                                        <input class="input" type="number" id="importeGrupo" name="importeGrupo" placeholder="Ingrese un importe">

                                                        <button type="button" id="agregarImporteGrupo">Agregar</button>

                                                    </div>

                                                </div>

                                            </div>

                                            <div class="column">

                                                <div class="field">

                                                    <label class="label" for="valor_total">Valor Total</label>

                                                    <div class="control">

                                                        <input class="input" type="number" id="valor_totalGrupo" name="valor_totalGrupo">

                                                    </div>

                                                </div>

                                            </div>               

                                    </div>

                                </div>

                                <div class="field">

                                    <div class="columns">

                                        <div class="column">

                                            <div class="field">

                                                <label class="label" for="archivos">Cargar Remitos</label>

                                                <div class="control">

                                                    <input class="input" type="file" id="archivosGrupo" name="archivosGrupo[]" multiple>

                                                </div>

                                            </div>

                                        </div>

                                        <div class="column">

                                            <div class="field">

                                                <label class="label">Remitos Subidos</label>

                                                <ul id="lista-archivosGrupo">

                                                    <!-- Aquí se mostrarán los archivos subidos -->

                                                </ul>

                                            </div>

                                        </div>

                                        <div class="column is-1 has-text-right">

                                            <div class="field">

                                                <label class="label"></label>

                                                <input type="checkbox" id="incluirArchivosGrupo" name="incluirArchivosGrupo" onchange="this.value = this.checked" checked>

                                            </div>

                                        </div>

                                    </div>

                                </div> 



                                <div class="field">

                                    <div class="columns">

                                        <div class="column">

                                            <div class="field">

                                                <label class="label" for="facturas">Cargar Facturas</label>

                                                <div class="control">

                                                    <input class="input" type="file" id="facturasGrupo" name="facturasGrupo[]" multiple>

                                                </div>

                                            </div>

                                        </div>

                                        <div class="column">

                                            <div class="field">

                                                <label class="label">Facturas</label>

                                                <ul id="lista-facturasGrupo">

                                                    <!-- Aquí se mostrarán los facturas subidas -->

                                                </ul>

                                            </div>

                                        </div>

                                        <div class="column is-1 has-text-right">

                                            <div class="field">

                                                <label class="label"></label>

                                                <input type="checkbox" id="incluirFacturaGrupo" name="incluirFacturaGrupo" onchange="this.value = this.checked" checked>

                                            </div>

                                        </div>

                                    </div>

                                </div>  

                                     

                                

                                <div class="field  is-hidden">

                                    <label class="label" for="fecha">Fecha Envio:</label>

                                    <div class="control">

                                        <input class="input" type="date" id="fechaEnvioGrupo" name="fechaEnvioGrupo">

                                    </div>

                                </div>



                                <div class="field">

                                    <label class="label" for="descripcion">Descripción</label>

                                    <div class="control">

                                        <textarea class="textarea" id="descripcionGrupo" name="descripcionGrupo" placeholder="Escribe aquí la descripción para el cliente"></textarea>

                                    </div>

                                </div>



                                <div class="field">

                                    <label class="label" for="detalle">Detalle</label>

                                    <div class="control">

                                        <textarea class="textarea" id="detalleGrupo" name="detalleGrupo" placeholder="Escribe aquí el detalle del remito para el sistema"></textarea>

                                    </div>

                                </div>

                                <div class="field">

                                    <div class="columns">

                                        <div class="column">

                                            <div class="field">

                                                <label class="label" for="debe">Debe</label>

                                                <div class="select">

                                                    <select id="debeGrupo" name="debeGrupo">

                                                        <option value="" disabled selected>Seleccione una opción</option>

                                                        <option value=""></option>

                                                        <option value="listo">listo</option>

                                                        <option value="certificado">certificado</option>

                                                        <option value="remito">remito</option>

                                                        <option value="pesada">pesada</option>

                                                        <option value="ordenDeCompra">ordenDeCompra</option>

                                                    </select>

                                                </div>

                                            </div>

                                        </div>

                                        <div class="column">

                                            <div class="field">

                                                <label class="label" for="estado">Estado del Remito</label>

                                                <div class="select">

                                                    <select id="estadoGrupo" name="estadoGrupo">

                                                        <option value="PendienteSinEnviar">PendienteSinEnviar</option>

                                                        <option value="PendientePorFacturar">PendientePorFacturar</option>

                                                        <option value="Facturado">Facturado</option>

                                                        <option value="Pagado">Pagado</option>

                                                    </select>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </form>

                        </section>

                        <footer class="modal-card-foot has-background-primarys">

                            <button class="button is-success" id="guardarRemitoGrupo">Agregar</button>

                        </footer>

                    </form>

                </section>

                <footer class="modal-card-foot">

                    <button class="button is-success" id="guardarGrupo">Guardar Remitos</button>

                    <button class="button" id="cancelarRemitoGrupo">Cancelar</button>

                </footer>

            </div>

        </div>

    `;

    const container = document.querySelector('.gestion');

    if (container) {

        container.insertAdjacentHTML('beforeend', formRemitoGrupos);



        // Mostrar/Ocultar campo para nueva empresa destino al seleccionar "OTRA"

        const selectEmpresaDestino = document.getElementById('empresa_destinoGrupo');

        const nuevaEmpresaDestinoField = document.getElementById('nuevaEmpresaDestinoFieldGrupo');

        const nroRemito = document.getElementById('nro_remitoGrupo');

        const email = document.getElementById('emailGrupo');

        const fechaInput = document.getElementById('fechaFacturadoGrupo');

        const vencimientoField = document.getElementById('vencimientoFieldGrupo');

        fechaInput.addEventListener('input', () => {

            if (fechaInput.value) {

                vencimientoField.classList.remove('is-hidden');

            }

        });

        selectEmpresaDestino.addEventListener('change', () => {

            if (selectEmpresaDestino.value === 'OTRA') {

                nuevaEmpresaDestinoField.classList.remove('is-hidden');

            } else {

                nuevaEmpresaDestinoField.classList.add('is-hidden');

            }

            // Precargar el número de remito si es SULLAIR

            if (selectEmpresaDestino.value === 'SULLAIR') {

                nroRemito.value = '0106-000';

            }

            if (selectEmpresaDestino.value === 'ABASTO') {

                email.value = 'administracion@abastonqn.com.ar';

            }

            if (selectEmpresaDestino.value === 'GO LOGISTISCA' || selectEmpresaDestino.value === 'TETRA') {

                console.log(selectEmpresaDestino.value);

                fechaFieldGrupo.classList.remove('is-hidden');

                if (selectEmpresaDestino.value === 'GO LOGISTISCA') {

                    email.value = 'claudiogabriel.bonaparte@nov.com;Gilberto.Solis@nov.com'
                    divisionFieldGrupo.classList.remove('is-hidden');
                    dominioFieldGrupo.classList.remove('is-hidden');

                } else {

                    email.value = 'lMendoza@tetratec.com;dgimenez@onetetra.com'
                    divisionFieldGrupo.classList.add('is-hidden');
                    dominioFieldGrupo.classList.add('is-hidden');

                }

            } else {

                fechaField.classList.add('is-hidden');

            }

        });

        fetchEmpresasDestinoGrupo();

        fetchEmails();

    }

}



function fetchEmpresasDestinoGrupo() {

    fetch('../../server/backend/modules/fetch_clientes.php')

        .then(response => response.json())

        .then(data => {

            if (data.success && Array.isArray(data.data)) {

                const selectElement = document.getElementById('empresa_destinoGrupo');

                data.data.forEach(empresa => {

                    const option = document.createElement('option');

                    option.value = empresa.empresa_destino;

                    option.textContent = empresa.empresa_destino;

                    selectElement.appendChild(option);

                });



                // Agregar opción "OTRA"

                const otraOption = document.createElement('option');

                otraOption.value = 'OTRA';

                otraOption.textContent = 'OTRA';

                selectElement.appendChild(otraOption);

            } else {

                console.error(data.message || 'Error al obtener las empresas destino');

            }

        })

        .catch(error => console.error('Error al cargar empresas destino:', error));

}



export function renderFormRemitoUpdate() {

    const formRemitoUpdate = `

        <div id="modalRemitoUpdate" class="modal">

            <div class="modal-background"></div>

            <div class="modal-card">

                <header class="modal-card-head">

                    <p class="modal-card-title">Actualizar Remito</p>

                    <button class="delete" aria-label="close"></button>

                </header>

                <section class="modal-card-body">

                

                    <form id="remitoFormUpdate" enctype="multipart/form-data">

                        <!-- Campo oculto para el ID del remito -->

                        <input type="hidden" id="remitoIdUpdate" name="idUpdate">



                        <!-- Campo oculto para los archivos existentes -->

                        <input type="hidden" id="archivosExistentesUpdate" name="archivos_existentesUpdate" value="[]">

                            <div class="field">

                                <div class="columns">

                                    <div class="column">

                                        <div class="field">

                                            <label class="label" for="nro_remito">Nro Remito</label>

                                            <div class="control">

                                                <input class="input" type="text" id="nro_remitoUpdate" name="nro_remitoUpdate">

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column">

                                    <div class="field">

                                        <label class="label" for="fecha">Fecha Remito</label>

                                        <div class="control">

                                            <input class="input" type="date" id="fechaRemitoUpdate" name="fechaRemitoUpdate">

                                        </div>

                                    </div>

                               </div>

                                </div>

                            </div>

                            <div class="field">

                                <div class="columns">

                                <div class="column">

                                        <div class="field">

                                            <label class="label" for="nro_factura">Nro Factura</label>

                                            <div class="control">

                                                <input class="input" type="text" id="nro_facturaUpdate" name="nro_facturaUpdate">

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="fechaPago">Fecha Pago</label>

                                            <div class="control">

                                                <input class="input" type="date" id="fechaPagoUpdate" name="fechaPagoUpdate">

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="fechaFacturado">Fecha Facturado:</label>

                                            <div class="control">

                                                <input class="input" type="date" id="fechaFacturadoUpdate" name="fechaFacturadoUpdate">

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        <div class="field" id="vencimientoFieldUpdate">

                        <label class="label" for="fecha">Fecha Vencimiento</label>

                            <div class="control">

                                <input class="input" type="date" id="fechaVencimientoUpdate" name="fechaVencimientoUpdate">

                            </div>                 

                        </div>



                        <!-- Nuevo campo de Fecha (oculto por defecto) -->

                        <div class="field is-hidden" id="fechaFieldUpdate">

                            <label class="label" for="fecha">Fecha:</label>

                            <div class="control">

                                <input class="input" type="date" id="fechaUpdate" name="fecha">

                            </div>

                        </div>



                            <div class="field">

                                <div class="columns">

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="empresa">Empresa:</label>

                                            <div class="control">

                                                <div class="select">

                                                    <select id="empresaUpdate" name="empresaUpdate" >

                                                        <option value="" disabled selected>Seleccione una empresa</option>

                                                        <option value="TPOIL">TPOIL</option>

                                                        <option value="TRANSPETRONE">TRANSPETRONE</option>

                                                        <option value="ABASTO">ABASTO</option>

                                                        <option value="NEMER">NEMER</option>

                                                    </select>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="empresa_destino">Empresa Destino:</label>

                                            <div class="control">

                                                <div class="select">

                                                    <select id="empresa_destinoUpdate" name="empresa_destinoUpdate">

                                                        <option value="" disabled selected>Seleccione una empresa destino</option>

                                                    </select>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>



                        <div class="field is-hidden" id="nuevaEmpresaDestinoFieldUpdate">

                            <label class="label" for="nuevaEmpresaDestino">Nueva Empresa Destino:</label>

                            <div class="control">

                                <input class="input" type="text" id="nuevaEmpresaDestinoUpdate" name="nuevaEmpresaDestinoUpdate" placeholder="Nombre de la nueva empresa destino">

                            </div>

                        </div>

                            <div class="columns">

                                <div class="column">

                                    <div class="field is-hidden" id="dominioFieldUpdate">

                                        <label class="label" for="dominio">Dominio</label>

                                        <div class="control">

                                            <input class="input" type="text" id="dominioUpdate" name="dominio" placeholder="Ingrese el dominio">

                                        </div>

                                    </div>

                                </div>

                                <div class="column">

                                    <div class="field is-hidden" id="divisionFieldUpdate">

                                        <label class="label" for="division">División</label>

                                        <div class="control">

                                            <div class="select is-fullwidth">

                                                <select id="divisionUpdate" name="division">

                                                    <option value="CS">CS</option>

                                                    <option value="IND">IND</option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            <div class="field">

                                <div class="columns">

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="importe">Importe:</label>

                                            <div class="control has-addons">

                                                <input class="input" type="number" id="importeUpdate" name="importe" placeholder="Ingrese un importe">

                                                <button type="button" id="agregarImporteUpdate">Agregar</button>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="valor_total">Valor Total:</label>

                                            <div class="control">

                                                <input class="input" type="number" id="valor_totalUpdate" name="valor_totalUpdate" required>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>



                        <div class="field">

                            <label class="label" for="valor_IVA">Valor IVA:</label>

                            <div class="control">

                                <input class="input" type="number" id="valor_IvaUpdate" name="valor_IvaUpdate" disabled>

                            </div>

                        </div>

                            <div class="field">

                                <div class="columns">

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="archivos">Cargar Archivos:</label>

                                            <div class="control">

                                                <input class="input" type="file" id="archivosUpdate" name="archivosUpdate[]" multiple>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label">Archivos Subidos</label>

                                            <ul id="lista-archivos-update">

                                                <!-- Aquí se mostrarán los archivos subidos -->

                                            </ul>

                                        </div>

                                    </div>

                                    <div class="column is-1 has-text-right">

                                <div class="field">

                                    <label class="label"></label>

                                    <input type="checkbox" id="incluirArchivosupdate" name="incluirArchivosupdate" onchange="this.value = this.checked">

                                </div>

                            </div>

                                </div>

                            </div>



                            <div class="field">

                        <div class="columns">

                            <div class="column">

                                <div class="field">

                                    <label class="label" for="facturas">Cargar Facturas</label>

                                    <div class="control">

                                        <input class="input" type="file" id="facturasUpdate" name="facturasUpdate[]" multiple>

                                    </div>

                                </div>

                            </div>

                            <div class="column">

                                <div class="field">

                                    <label class="label">Facturas</label>

                                    <ul id="lista-facturas-Update">

                                        <!-- Aquí se mostrarán los facturas subidas -->

                                    </ul>

                                </div>

                            </div>

                            <div class="column is-1 has-text-right">

                                <div class="field">

                                    <label class="label"></label>

                                    <input type="checkbox" id="incluirFacturaupdate" name="incluirFacturaupdate" onchange="this.value = this.checked">

                                </div>

                            </div>

                        </div>

                    </div> 



                        <div class="field">

                            <label class="label" for="email">Correo Electrónico del Cliente:</label>

                            <div class="control">

                                <input class="input" list="emailSuggestions" type="email" id="emailUpdate" name="emailUpdate" placeholder="; para separar los correos electrónicos">

                                <datalist id="emailSuggestions">

                                    <!-- Aquí se cargan las opciones -->

                                </datalist>

                            </div>

                        </div>



                        <div class="field  is-hidden">

                            <label class="label" for="fechaEnvio">Fecha Envio:</label>

                            <div class="control">

                                <input class="input" type="date" id="fechaEnvioUpdate" name="fechaEnvioUpdate">

                            </div>

                        </div>



                        <div class="field">

                            <label class="label" for="descripcion">Descripción</label>

                            <div class="control"> 

                                <textarea class="textarea" id="descripcionUpdate" name="descripcionUpdate" placeholder="Escribe aquí la descripción para el cliente"></textarea>

                            </div>

                        </div>



                        <div class="field">

                            <label class="label" for="detalle">Detalle</label>

                            <div class="control">

                                <textarea class="textarea" id="detalleUpdate" name="detalleUpdate" placeholder="Escribe aquí el detalle del remito"></textarea>

                            </div>

                        </div>

                            <div class="field">

                                <div class="columns">

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="debe">Debe:</label>

                                            <div class="select">

                                                <select id="debeUpdate" name="debeUpdate">

                                                    <option value="" disabled selected>Seleccione una opción</option>

                                                    <option value=""></option>

                                                    <option value="listo">listo</option>

                                                    <option value="certificado">certificado</option>

                                                    <option value="remito">remito</option>

                                                    <option value="pesada">pesada</option>

                                                    <option value="ordenDeCompra">ordenDeCompra</option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="estado">Estado del Remito:</label>

                                            <div class="select">

                                                <select id="estadoUpdate" name="estadoUpdate">

                                                    <option value="PendienteSinEnviar">PendienteSinEnviar</option>

                                                    <option value="PendientePorFacturar">PendientePorFacturar</option>

                                                    <option value="Facturado">Facturado</option>

                                                    <option value="Pagado">Pagado</option>

                                                    <option value="FacturaRevisada">FacturaRevisada</option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                    </form>

                </section>

                <footer class="modal-card-foot">

                    <button class="button is-success" id="actualizarRemito">Actualizar Remito</button>

                    <button class="button" id="cancelarRemitoUpdate">Cancelar</button>

                </footer>

            </div>

        </div>

    `;



    const container = document.querySelector('.gestion');

    if (container) {

        container.insertAdjacentHTML('beforeend', formRemitoUpdate);



        // Mostrar/Ocultar campo para nueva empresa destino al seleccionar "OTRA"

        const selectEmpresaDestino = document.getElementById('empresa_destinoUpdate');

        const nuevaEmpresaDestinoField = document.getElementById('nuevaEmpresaDestinoFieldUpdate');

        const fechaInput = document.getElementById('fechaFacturadoUpdate');

        const vencimientoField = document.getElementById('vencimientoFieldUpdate');

        fechaInput.addEventListener('input', () => {

            if (fechaInput.value) {

                vencimientoField.classList.remove('is-hidden');

            }

        });



        selectEmpresaDestino.addEventListener('change', () => {

            if (selectEmpresaDestino.value === 'OTRA') {

                nuevaEmpresaDestinoField.classList.remove('is-hidden');

            } else {

                nuevaEmpresaDestinoField.classList.add('is-hidden');

            }



            // Precargar el número de remito si es SULLAIR

            if (selectEmpresaDestino.value === 'SULLAIR') {

                nroRemito.value = '0106-000';

            }



            if (selectEmpresaDestino.value === 'GO LOGISTISCA' || selectEmpresaDestino.value === 'TETRA') {

                console.log(selectEmpresaDestino.value);

                fechaFieldUpdate.classList.remove('is-hidden');

                if (selectEmpresaDestino.value === 'GO LOGISTISCA') {

                    dominioFieldUpdate.classList.remove('is-hidden');
                    divisionFieldUpdate.classList.remove('is-hidden');
                    email.value = 'claudiogabriel.bonaparte@nov.com;Gilberto.Solis@nov.com'

                } else {

                    email.value = 'lMendoza@tetratec.com;dgimenez@onetetra.com'

                }

            } else {

                fechaFieldUpdate.classList.add('is-hidden');
                divisionFieldUpdate.classList.add('is-hidden');
                dominioFieldUpdate.classList.add('is-hidden');

            }

        });



        // Cargar empresas destino dinámicamente

        fetchEmpresasDestinoUpdate();

        fetchEmails();

    } else {

        console.error('No se encontró un elemento con la clase "container"');

    }

}



export function renderFormRemitoUpdateGrupo() {

    const formRemitoUpdateGrupo = `

        <div id="modalRemitoUpdateGrupo" class="modal">

            <div class="modal-background"></div>

            <div class="modal-card">

                <header class="modal-card-head">

                    <p class="modal-card-title">Actualizar Grupo de Remitos</p>

                    <button class="delete" aria-label="close" id="cerrarUpdateGrupo"></button>

                </header>

                <section class="modal-card-body">

                

                    <form id="remitoFormUpdateGrupo" enctype="multipart/form-data">

                        <!-- Campo oculto para el ID del remito -->

                        <input type="hidden" id="remitoIdUpdateGrupo" name="idUpdateGrupo">



                            <div class="field">

                                <div class="columns">

                                    <div class="column">

                                        <div class="field">

                                            <label class="label" for="nro_remito">Nro Remitos</label>

                                            <div class="control">

                                                <input class="input" type="text" id="nro_remitoUpdateGrupo" name="nro_remitoUpdateGrupo" placeholder="Nro remitos separado por ;" readonly>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            <div class="field">

                                <div class="columns">

                                    <div class="column">

                                        <div class="field">

                                            <label class="label" for="nro_factura">Nro Factura</label>

                                            <div class="control">

                                                <input class="input" type="text" id="nro_facturaUpdateGrupo" name="nro_facturaUpdateGrupo">

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            <div class="field">

                                <label class="label" for="email">Correo Electrónico del Cliente</label>

                                <div class="control">

                                    <input class="input" list="emailSuggestions" type="email" id="emailUpdateGrupo" name="emailUpdateGrupo" placeholder="; para separar los correos electrónicos">

                                    <datalist id="emailSuggestions">

                                        <!-- Aquí se cargan las opciones -->

                                    </datalist>

                                </div>

                            </div>



                            <div class="field">

                                <div class="columns">

                                    <div class="column"> 

                                        <div class="field">

                                            <label class="label" for="fechaFacturado">Fecha Facturado</label>

                                            <div class="control">

                                                <input class="input" type="date" id="fechaFacturadoUpdateGrupo" name="fechaFacturadoUpdateGrupo">

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            <div class="field">

                                <div class="columns">

                                    <div class="column"> 

                                        <div class="field" id="vencimientoFieldUpdate">

                                            <label class="label" for="fecha">Fecha Vencimiento</label>

                                            <div class="control">

                                                <input class="input" type="date" id="fechaVencimientoUpdateGrupo" name="fechaVencimientoUpdateGrupo">

                                            </div>                 

                                        </div>

                                    </div>

                                </div>

                            </div>



                            <div class="field">

                                <div class="columns">

                                    <div class="column">

                                        <div class="field">

                                            <label class="label" for="facturas">Cargar Facturas</label>

                                            <div class="control">

                                                <input class="input" type="file" id="facturasUpdateGrupo" name="facturasUpdateGrupo[]" multiple>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="column">

                                        <div class="field">

                                            <label class="label">Facturas</label>

                                            <ul id="lista-facturas-UpdateGrupo">

                                                <!-- Aquí se mostrarán los facturas subidas -->

                                            </ul>

                                        </div>

                                    </div>

                                    <div class="column">

                                        <div class="field">

                                            <label class="label" for="nro_remitoAdjuntoGrupo">Nro Remito</label>

                                            <div class="control">

                                                <select class="input" id="nro_remitoAdjuntoGrupo" name="nro_remitoAdjuntoGrupo">

                                                    <!-- Opciones se agregan con JS -->

                                                </select>

                                            </div>

                                        </div>

                                    </div>



                                </div>

                            </div> 

                    </form>

                </section>

                <footer class="modal-card-foot">

                    <button class="button is-success" id="actualizarRemitoGrupo">Actualizar Remito</button>

                    <button class="button" id="cancelarRemitoUpdateGrupo">Cancelar</button>

                </footer>

            </div>

        </div>

    `;



    const container = document.querySelector('.gestion');

    if (container) {

        container.insertAdjacentHTML('beforeend', formRemitoUpdateGrupo);

        const fechaInput = document.getElementById('fechaFacturadoUpdateGrupo');

        const vencimientoField = document.getElementById('fechaVencimientoUpdateGrupo');

        fechaInput.addEventListener('input', () => {

            if (fechaInput.value) {

                vencimientoField.classList.remove('is-hidden');

            }

        });

        fetchEmails();

    } else {

        console.error('No se encontró un elemento con la clase "container"');

    }

}

