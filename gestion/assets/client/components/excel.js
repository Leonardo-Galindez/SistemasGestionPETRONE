import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs";

const columnNames = [

    'Fecha', 'cliente', 'remitoSullair', 'viaje_numero', 'maquinaTransportada',

    'interno', 'desde', 'hasta', 'desde_1', 'hasta_1', 'hsStandBy',

    'hsDeHidro', 'km', 'vehiculo', 'costo', 'contrato',

];



const columnNamesGo = [

    'fecha', 'remitoGo', 'division', 'dominio', 'op', 'total', 'formulas',

];



const columnNamesExpro = [

    'numero_tr', 'Fecha', 'numero_remito', 'patente', 'tipo_unidad', 'dni_chofer', 'origen', 'destino', 'operador_a', 'centro_costo',

    'service_line', 'resumen_servicio', 'km_recorridos', 'horas_servicio', 'costo_transporte', 'servicios_adicionales', 'costo_km_adic', 'costo_horas_espera', 'costo_total',

];



const columnNamesSecco = [

    'Fecha', 'Remito', 'detalle', 'subtotal', 'km',

    'precio', 'Total', 'observaciones',

];



const columnNamesTetra = [

    'fecha', 'remito', 'detalle', 'valor',

];



const coulumnFacturado = [

    'Fecha', 'NroFactura', 'Cliente', 'Remito', 'Importe', 'IVA', 'Total', 'Condicion Cobro', 'Medio de Pago', 'Fecha Pago', 'Estado', 'Retenciones', 'Efectivo', 'Banco', 'Intereses', 'Gastos', 'Pagos Realizados', 'Fecha de pago', 'C.C',

]



document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('handsontable');

    const textColorInput = document.getElementById('text-color'); // Selector de color de texto

    const fillColorInput = document.getElementById('fill-color'); // Selector de color de relleno

    const exportButton = document.querySelector('.top-menu a:nth-child(2)'); // Botón Exportar

    const importButton = document.querySelector('.top-menu a:nth-child(3)'); // Botón Importar

    const formulaInput = document.querySelector('.formulas input[type="text"]'); // Input de fórmula

    const btnGuardar = document.getElementById('btn-guardar');

    // Variable para almacenar los estilos de las celdas

    const cellStyles = new Map();



    btnGuardar.addEventListener('click', () => {

        const datosPlanilla = hot.getData();

        //console.log('Datos obtenidos de la planilla:', datosPlanilla);



        const datosSinEncabezados = datosPlanilla.slice(1);

        //console.log('Datos sin encabezados:', datosSinEncabezados);



        const datosConDatos = datosSinEncabezados.filter((fila) =>

            fila.some((celda) => celda !== null && celda !== '')

        );

        //console.log('Filas con datos:', datosConDatos);



        switch (empresaSelect.value) {

            case 'SULLAIR':

                const datosMapeados = datosConDatos.map((fila, indexFila) => {

                    //console.log(`Procesando fila ${indexFila + 1}:`, fila);



                    // Crear objeto con el orden correcto de las columnas

                    let mapeo = {};

                    columnNames.forEach((columna, indice) => {

                        mapeo[columna] = fila[indice] !== undefined ? fila[indice] : ''; // Asegura que no haya valores undefined

                    });



                    // Capturar las fórmulas sin modificar el orden de los datos

                    const formulasFila = fila.map((_, colIndex) => {

                        const formula = hot.getCellMeta(indexFila + 1, colIndex).formula;

                        return formula ? { row: indexFila + 1, col: colIndex, formula: formula } : null;

                    }).filter(Boolean); // Filtra los valores null para solo mantener las celdas con fórmula



                    // Agregar las fórmulas al objeto pero sin afectar el orden

                    mapeo["formulas"] = formulasFila;



                    //console.log(`Fila mapeada correctamente:`, mapeo);



                    return mapeo;

                });



                //console.log('Datos mapeados con fórmulas:', datosMapeados);



                fetch('../../server/backend/modules/update-planilla-sullair.php', {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                    },

                    body: JSON.stringify(datosMapeados),

                })

                    .then((response) => response.json())

                    .then((resultado) => {

                        //console.log('Respuesta del servidor:', resultado);

                        if (resultado.success) {

                            alert('Datos guardados correctamente.');

                        } else {

                            alert('Error al guardar los datos: ' + resultado.message);

                        }

                    })

                    .catch((error) => {

                        //console.error('Error al enviar los datos:', error);

                        alert('Hubo un error al guardar los datos.');

                    });

                break;





            case 'GO LOGISTISCA':

                const datosMapeadosGo = datosConDatos.map((fila, indexFila) => {

                    //console.log(`Procesando fila ${indexFila + 1}:`, fila);



                    const mapeo = fila.reduce((acumulador, valor, indice) => {

                        const columna = columnNamesGo[indice] || `undefined_${indice}`;

                        acumulador[columna] = valor || '';

                        return acumulador;

                    }, {});



                    const formulasFila = [];

                    fila.forEach((_, colIndex) => {

                        const formula = hot.getCellMeta(indexFila + 1, colIndex).formula;

                        if (formula) {

                            formulasFila.push({

                                row: indexFila + 1,

                                col: colIndex,

                                formula: formula,

                            });

                        }

                    });



                    mapeo.formulas = formulasFila;

                    //console.log(`Fila mapeada con fórmulas:`, mapeo);



                    return mapeo;

                });



                //console.log('Datos mapeados con fórmulas:', datosMapeadosGo);



                fetch('../../server/backend/modules/update-planilla-go.php', {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                    },

                    body: JSON.stringify(datosMapeadosGo),

                })

                    .then((response) => response.json())

                    .then((resultado) => {

                        //console.log('Respuesta del servidor:', resultado);

                        if (resultado.success) {

                            alert('Datos guardados correctamente.');

                        } else {

                            alert('Error al guardar los datos: ' + resultado.message);

                        }

                    })

                    .catch((error) => {

                        //console.error('Error al enviar los datos:', error);

                        alert('Hubo un error al guardar los datos.');

                    });

                break;

            case 'EXPRO':

                const datosMapeadosExpro = datosConDatos.map((fila, indexFila) => {

                    //console.log(`Procesando fila ${indexFila + 1}:`, fila);



                    const mapeo = fila.reduce((acumulador, valor, indice) => {

                        const columna = columnNamesExpro[indice] || `undefined_${indice}`;

                        acumulador[columna] = valor || '';

                        return acumulador;

                    }, {});



                    const formulasFila = [];

                    fila.forEach((_, colIndex) => {

                        const formula = hot.getCellMeta(indexFila + 1, colIndex).formula;

                        if (formula) {

                            formulasFila.push({

                                row: indexFila + 1,

                                col: colIndex,

                                formula: formula,

                            });

                        }

                    });



                    mapeo.formulas = formulasFila;

                    //console.log(`Fila mapeada con fórmulas:`, mapeo);



                    return mapeo;

                });



                //console.log('Datos mapeados con fórmulas:', datosMapeadosExpro);



                fetch('../../server/backend/modules/update-planilla-expro.php', {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                    },

                    body: JSON.stringify(datosMapeadosExpro),

                })

                    .then((response) => response.json())

                    .then((resultado) => {

                        //console.log('Respuesta del servidor:', resultado);

                        if (resultado.success) {

                            alert('Datos guardados correctamente.');

                        } else {

                            console.error('Error en el backend:', resultado.message);

                            alert('Error al guardar los datos: ' + resultado.message);

                        }

                    })

                    .catch((error) => {

                        console.error('Error al enviar los datos:', error);

                        alert('Hubo un error al guardar los datos.');

                    });



                break;

            case 'SECCO':

                const datosMapeadosSecco = datosConDatos.map((fila, indexFila) => {

                    //console.log(`Procesando fila ${indexFila + 1}:`, fila);



                    const mapeo = fila.reduce((acumulador, valor, indice) => {

                        const columna = columnNamesSecco[indice] || `undefined_${indice}`;

                        acumulador[columna] = valor || '';

                        return acumulador;

                    }, {});



                    const formulasFila = [];

                    fila.forEach((_, colIndex) => {

                        const formula = hot.getCellMeta(indexFila + 1, colIndex).formula;

                        if (formula) {

                            formulasFila.push({

                                row: indexFila + 1,

                                col: colIndex,

                                formula: formula,

                            });

                        }

                    });



                    mapeo.formulas = formulasFila;

                    //console.log(`Fila mapeada con fórmulas:`, mapeo);



                    return mapeo;

                });



                //console.log('Datos mapeados con fórmulas:', datosMapeadosSecco);



                fetch('../../server/backend/modules/update-planilla-secco.php', {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                    },

                    body: JSON.stringify(datosMapeadosSecco),

                })

                    .then((response) => response.json())

                    .then((resultado) => {

                        console.log('Respuesta del servidor:', resultado);

                        if (resultado.success) {

                            alert('Datos guardados correctamente.');

                        } else {

                            alert('Error al guardar los datos: ' + resultado.message);

                        }

                    })

                    .catch((error) => {

                        console.error('Error al enviar los datos:', error);

                        alert('Hubo un error al guardar los datos.');

                    });

                break;



            case 'TETRA':

                const datosMapeadosTetra = datosConDatos.map((fila, indexFila) => {

                    //console.log(`Procesando fila ${indexFila + 1}:`, fila);



                    const mapeo = fila.reduce((acumulador, valor, indice) => {

                        const columna = columnNamesTetra[indice] || `undefined_${indice}`;

                        acumulador[columna] = valor || '';

                        return acumulador;

                    }, {});



                    const formulasFila = [];

                    fila.forEach((_, colIndex) => {

                        const formula = hot.getCellMeta(indexFila + 1, colIndex).formula;

                        if (formula) {

                            formulasFila.push({

                                row: indexFila + 1,

                                col: colIndex,

                                formula: formula,

                            });

                        }

                    });



                    mapeo.formulas = formulasFila;

                    //console.log(`Fila mapeada con fórmulas:`, mapeo);



                    return mapeo;

                });



                //console.log('Datos mapeados con fórmulas:', datosMapeadosTetra);



                fetch('../../server/backend/modules/update-planilla-tetra.php', {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                    },

                    body: JSON.stringify(datosMapeadosTetra),

                })

                    .then((response) => response.json())

                    .then((resultado) => {

                        console.log('Respuesta del servidor:', resultado);

                        if (resultado.success) {

                            alert('Datos guardados correctamente.');

                        } else {

                            console.error('Error en el backend:', resultado.message);

                            alert('Error al guardar los datos: ' + resultado.message);

                        }

                    })

                    .catch((error) => {

                        console.error('Error al enviar los datos:', error);

                        alert('Hubo un error al guardar los datos.');

                    });



                break;

            default:

                console.log('Empresa no reconocida o sin lógica específica.');

                break;

        }

    });



    // Configuración inicial para calcular el tamaño de la tabla

    const calculateTableSize = () => {

        const screenWidth = window.innerWidth; // Ancho de la pantalla

        const screenHeight = window.innerHeight; // Alto de la pantalla



        // Estimar el número de columnas y filas en base al tamaño de la pantalla

        const columnCount = Math.floor(screenWidth / 100); // Por ejemplo, cada columna ocupa 100px

        const rowCount = Math.floor(screenHeight / 40); // Por ejemplo, cada fila ocupa 40px



        return { rows: rowCount, cols: columnCount };

    };



    // Generar datos vacíos iniciales

    const generateEmptyData = (rows, cols) => {

        return Array.from({ length: rows }, () => Array(cols).fill(''));

    };



    // Configurar el Handsontab



    // Calcular el tamaño inicial de la tabla

    const { rows, cols } = calculateTableSize();

    const hyperformulaInstance = HyperFormula.buildEmpty();



    // Crear los datos iniciales

    const initialData = generateEmptyData(rows, cols);

    const hot = new Handsontable(container, {

        data: initialData, // Datos iniciales: 20 filas, 10 columnas

        rowHeaders: true, // Mostrar encabezados de fila

        colHeaders: true, // Mostrar encabezados de columna

        width: '100%', // Ajustar al ancho del contenedor

        height: '100%', // Ajustar al alto del contenedor

        colWidths: 150, // Ancho predeterminado de columnas

        rowHeights: 30, // Altura predeterminada de filas

        manualColumnResize: true, // Permitir redimensionar columnas

        manualRowResize: true, // Permitir redimensionar filas

        stretchH: 'all', // Ajustar columnas al contenedor

        contextMenu: true, // Menú contextual habilitado

        licenseKey: 'non-commercial-and-evaluation', // Licencia gratuita

        filters: true, // Habilitar filtros

        dropdownMenu: true, // Menú desplegable para filtros y ordenación

        columnSorting: true, // Permitir ordenar columnas

        formulas: {

            engine: hyperformulaInstance // Vincular el motor HyperFormula

        },

        search: true, // Habilitar búsqueda

        formulas: true, // Soporte para fórmulas (requiere plugin avanzado)

        mergeCells: true, // Permitir combinar celdas

        manualRowMove: true, // Permitir mover filas manualmente

        manualColumnMove: true, // Permitir mover columnas manualmente

        multiColumnSorting: true, // Ordenación en varias columnas

        selectionMode: 'multiple', // Permitir seleccionar múltiples celdas

        undo: true, // Habilitar deshacer/rehacer

        redo: true, // Habilitar rehacer

        allowInsertRow: true, // Permitir insertar filas

        allowInsertColumn: true, // Permitir insertar columnas

        allowRemoveRow: true, // Permitir eliminar filas

        allowRemoveColumn: true, // Permitir eliminar columnas

        readOnly: false, // Permitir edición

        customBorders: true,

        outsideClickDeselects: false, // Mantener selección al hacer clic fuera

        autoColumnSize: true, // Ajuste automático del tamaño de columnas

        autoRowSize: true, // Ajuste automático del tamaño de filas

        className: 'htCenter htMiddle', // Centramos contenido en celdas

        cell: [], // Puedes especificar configuraciones individuales de celdas aquí

        afterChange: (changes, source) => {

            //console.log('Cambios realizados:', changes, 'Fuente:', source);

        },

        afterSelection: (row, col, row2, col2) => {

            //console.log(`Selección: (${row}, ${col}) hasta (${row2}, ${col2})`);

        },

        beforeChange: (changes) => {

            //console.log('Cambios antes de aplicar:', changes);

        },

        afterSelectionEnd: (row, col, row2, col2) => {

            // Guarda la selección actual para usarla al aplicar estilos

            hot.currentSelection = { row, col, row2, col2 };

        },

        cells: (row, col) => {

            const cellKey = `${row}-${col}`;

            const styles = cellStyles.get(cellKey) || {};

            return {

                renderer: (instance, td, row, col, prop, value, cellProperties) => {

                    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

                    // Aseguramos que ambos estilos siempre se apliquen

                    td.style.color = styles.color || 'inherit'; // Color de texto

                    td.style.backgroundColor = styles.backgroundColor || ''; // Color de fondo

                },

            };

        },

    });

    // Función para aplicar bordes





    // Cambiar color de texto

    textColorInput.addEventListener('input', () => {

        if (!textColorInput.value) return; // Valida que se haya seleccionado un color

        applyStyleToSelection((cellKey, styles) => {

            styles.color = textColorInput.value; // Aplica el color de texto

        });

    });



    // Cambiar color de relleno

    fillColorInput.addEventListener('input', () => {

        if (!fillColorInput.value) return; // Valida que se haya seleccionado un color

        applyStyleToSelection((cellKey, styles) => {

            styles.backgroundColor = fillColorInput.value; // Aplica el color de fondo

        });

    });



    // Importar desde Excel

    importButton.addEventListener('click', () => {

        const input = document.createElement('input');

        input.type = 'file';

        input.accept = '.xlsx, .xls';



        input.addEventListener('change', (event) => {

            const file = event.target.files[0];

            if (!file) return;



            const reader = new FileReader();

            reader.onload = (e) => {

                const data = new Uint8Array(e.target.result);

                const workbook = XLSX.read(data, { type: 'array', cellStyles: true }); // Leer estilos

                const sheetName = workbook.SheetNames[0];

                const sheet = workbook.Sheets[sheetName];



                // Obtener datos y convertir fechas si es necesario

                const jsonData = XLSX.utils.sheet_to_json(sheet, {

                    header: 1,

                    raw: false, // Convierte fechas automáticamente

                    dateNF: 'dd/mm/yyyy', // Formato deseado para las fechas

                });



                // Obtener tamaños de columnas y filas

                const columnWidths = [];

                const rowHeights = [];



                if (sheet['!cols']) {

                    sheet['!cols'].forEach((col) => {

                        columnWidths.push(col.wpx || 100); // wpx: ancho en píxeles

                    });

                }



                if (sheet['!rows']) {

                    sheet['!rows'].forEach((row) => {

                        rowHeights.push(row.hpx || 30); // hpx: alto en píxeles

                    });

                }



                // Cargar datos en Handsontable

                hot.updateSettings({

                    data: jsonData,

                    colWidths: columnWidths.length > 0 ? columnWidths : undefined,

                    rowHeights: rowHeights.length > 0 ? rowHeights : undefined,

                });



                // Obtener estilos adicionales

                const cellFormats = {};

                Object.keys(sheet).forEach((key) => {

                    if (!key.startsWith('!')) {

                        const cell = sheet[key];

                        if (cell.s) {

                            cellFormats[key] = {

                                backgroundColor: cell.s.fgColor?.rgb || null,

                                color: cell.s.color?.rgb || null,

                            };

                        }

                    }

                });



                // Aplicar estilos

                jsonData.forEach((row, rowIndex) => {

                    row.forEach((_, colIndex) => {

                        const cellKey = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });

                        const style = cellFormats[cellKey] || {};

                        const cellId = `${rowIndex}-${colIndex}`;

                        cellStyles.set(cellId, {

                            backgroundColor: style.backgroundColor ? `#${style.backgroundColor}` : '',

                            color: style.color ? `#${style.color}` : '',

                        });

                    });

                });



                hot.render(); // Renderizar la tabla con los estilos aplicados

            };



            reader.readAsArrayBuffer(file);

        });



        input.click();

    });



    formulaInput.addEventListener('keydown', (event) => {

        if (event.key === 'Enter') {

            const formula = formulaInput.value.trim();

            if (!formula) return;



            const selection = hot.getSelectedLast(); // Obtener la última selección

            if (!selection) {

                alert('Selecciona un rango de celdas para aplicar la fórmula.');

                return;

            }



            const [row, col] = selection;



            try {

                let result = null; // Resultado calculado



                if (formula.startsWith('SUMA(')) {

                    const range = formula.match(/SUMA\((.*)\)/)[1];

                    const [start, end] = range.split(':');

                    const [startCol, startRow] = parseCell(start);

                    const [endCol, endRow] = parseCell(end);



                    let sum = 0;

                    for (let r = startRow; r <= endRow; r++) {

                        for (let c = startCol; c <= endCol; c++) {

                            const value = hot.getDataAtCell(r, c);

                            sum += parseFloat(value) || 0;

                        }

                    }

                    result = sum;

                } else if (formula.startsWith('PROMEDIO(')) {

                    const range = formula.match(/PROMEDIO\((.*)\)/)[1];

                    const [start, end] = range.split(':');

                    const [startCol, startRow] = parseCell(start);

                    const [endCol, endRow] = parseCell(end);



                    let sum = 0;

                    let count = 0;

                    for (let r = startRow; r <= endRow; r++) {

                        for (let c = startCol; c <= endCol; c++) {

                            const value = hot.getDataAtCell(r, c);

                            sum += parseFloat(value) || 0;

                            count++;

                        }

                    }

                    result = sum / count;

                } else if (formula.startsWith('RESTA(')) {

                    const args = formula.match(/RESTA\((.*)\)/)[1].split(',');

                    const [cell1, cell2] = args.map(arg => parseCell(arg.trim()));



                    const value1 = hot.getDataAtCell(cell1[1], cell1[0]);

                    const value2 = hot.getDataAtCell(cell2[1], cell2[0]);

                    result = (parseFloat(value1) || 0) - (parseFloat(value2) || 0);

                } else if (formula.startsWith('=')) {

                    // Lógica para fórmulas como "=300+100", "=B1+300" o "=D1+F4"

                    const regex = /=([A-Z]*\d*)?\s*([\+\-\*\/])\s*([A-Z]*\d*|\d+)/;

                    const match = formula.match(regex);



                    if (match) {

                        const [, leftOperand, operator, rightOperand] = match;



                        let leftValue = 0;

                        if (leftOperand) {

                            if (isNaN(leftOperand)) {

                                const [leftCol, leftRow] = parseCell(leftOperand);

                                leftValue = parseFloat(hot.getDataAtCell(leftRow, leftCol)) || 0;

                            } else {

                                leftValue = parseFloat(leftOperand) || 0;

                            }

                        }



                        let rightValue = 0;

                        if (isNaN(rightOperand)) {

                            const [rightCol, rightRow] = parseCell(rightOperand);

                            rightValue = parseFloat(hot.getDataAtCell(rightRow, rightCol)) || 0;

                        } else {

                            rightValue = parseFloat(rightOperand) || 0;

                        }



                        switch (operator) {

                            case '+':

                                result = leftValue + rightValue;

                                break;

                            case '-':

                                result = leftValue - rightValue;

                                break;

                            case '*':

                                result = leftValue * rightValue;

                                break;

                            case '/':

                                result = rightValue !== 0 ? leftValue / rightValue : 'Error';

                                break;

                            default:

                                throw new Error('Operador no soportado.');

                        }

                    } else {

                        alert('Fórmula no válida.');

                    }

                } else {

                    alert('Fórmula no soportada.');

                }



                if (result !== null) {

                    // Guardar la fórmula en la celda como metadato

                    hot.setCellMeta(row, col, 'formula', formula);



                    // Establecer el resultado calculado en la celda

                    hot.setDataAtCell(row, col, result);

                }



                formulaInput.value = '';

            } catch (error) {

                alert('Error al aplicar la fórmula: ' + error.message);

            }

        }

    });



    // Listener para llenar el input con la fórmula de la celda seleccionada

    hot.addHook('afterSelection', (row, col) => {

        const formula = hot.getCellMeta(row, col).formula;

        if (formula) {

            formulaInput.value = formula;

        } else {

            formulaInput.value = '';

        }

    });



    // Función para convertir celdas como "D1" en índices numéricos

    function parseCell(cell) {

        const col = cell.match(/[A-Z]+/)[0].toUpperCase(); // Columna en letras

        const row = parseInt(cell.match(/\d+/)[0], 10) - 1; // Fila en números (0 indexado)

        const colIndex = col.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1; // Convertir a índice

        return [colIndex, row];

    }







    /**

     * Convierte una referencia de celda como "C1" a índices [col, row].

     * @param {string} cellRef - Referencia de celda (ej: C1).

     * @returns {[number, number]} Índices de columna y fila.

     */

    function parseCell(cellRef) {

        const col = cellRef.charCodeAt(0) - 65; // Convierte la letra de columna a índice (A=0, B=1, ...)

        const row = parseInt(cellRef.slice(1)) - 1; // Convierte el número de fila a índice (1=0, 2=1, ...)

        return [col, row];

    }



    /**

     * Aplica estilos a las celdas seleccionadas.

     * @param {Function} styleCallback - Función para aplicar el estilo a las celdas.

     */

    function applyStyleToSelection(styleCallback) {

        const selection = hot.currentSelection;

        if (!selection) {

            return;

        }



        const { row, col, row2, col2 } = selection;



        for (let r = row; r <= row2; r++) {

            for (let c = col; c <= col2; c++) {

                const cellKey = `${r}-${c}`;

                const styles = cellStyles.get(cellKey) || {};

                styleCallback(cellKey, styles);

                cellStyles.set(cellKey, styles);

            }

        }

        hot.render(); // Renderiza la tabla para reflejar los cambios

    }



    const btnAbrir = document.getElementById('btn-abrir');

    const dropdownEmpresas = document.getElementById('dropdown-empresas');

    const empresaSelect = document.getElementById('empresa-select');







    // Muestra el menú desplegable y solicita los datos

    btnAbrir.addEventListener('click', async (event) => {

        event.preventDefault();



        // Cambia la visibilidad del menú

        dropdownEmpresas.style.display = dropdownEmpresas.style.display === 'none' ? 'block' : 'none';



        if (empresaSelect.options.length <= 1) {

            // Solicita datos al backend si aún no se han cargado

            try {

                const response = await fetch('../../server/backend/modules/fetch_clientes.php');

                const data = await response.json();



                if (data.success) {

                    // Lista de empresas permitidas

                    const empresasPermitidas = ['GO LOGISTISCA', 'TETRA', 'SECCO', 'SULLAIR', 'EXPRO'];



                    // Rellena el menú desplegable con las empresas permitidas

                    data.data.forEach((empresa) => {

                        if (empresasPermitidas.includes(empresa.empresa_destino)) {

                            const option = document.createElement('option');

                            option.value = empresa.empresa_destino;

                            option.textContent = empresa.empresa_destino;

                            empresaSelect.appendChild(option);

                        }

                    });

                } else {

                    alert('Error al cargar las empresas: ' + (data.message || 'Intente más tarde.'));

                }

            } catch (error) {

                console.error('Error al cargar las empresas:', error);

                alert('Hubo un problema al conectarse con el servidor.');

            }

        }

    });



    exportButton.addEventListener('click', async () => {

        const data = hot.getData(); // Obtener datos desde Handsontable

        const trimmedData = data.slice(0, -1); // sin la última fila

        const wb = new ExcelJS.Workbook();

        const ws = wb.addWorksheet("Hoja1");



        // Agregar las filas (cabecera incluida)

        ws.addRows(trimmedData);



        // Estilizar cabecera (primera fila)

        const headerRow = ws.getRow(1);

        headerRow.eachCell((cell) => {

            cell.fill = {

                type: 'pattern',

                pattern: 'solid',

                fgColor: { argb: 'A9A9A9' }

            };

            cell.font = {

                bold: true,

                color: { argb: '000000' }

            };

            cell.alignment = {

                horizontal: 'center',

                vertical: 'middle'

            };

        });

        headerRow.commit();



        // Conversión de columnas específicas a número

        for (let R = 1; R < trimmedData.length; ++R) { // empieza desde 1 porque 0 es cabecera

            let colIndex = null;



            if (empresaSelect.value === 'GO LOGISTISCA') {

                colIndex = 6;

            } else if (empresaSelect.value === 'SULLAIR') {

                colIndex = 16;

            }



            if (colIndex) {

                const cell = ws.getCell(R + 1, colIndex); // R+1 por cabecera en fila 1

                const value = cell.value;

                if (typeof value === 'string') {

                    const num = parseFloat(value.replace(/\./g, '').replace(',', '.'));

                    if (!isNaN(num)) {

                        cell.value = num;

                        cell.numFmt = '#,##0.00';

                        cell.alignment = { horizontal: 'right' };

                    }

                }

            }

        }



        // === NUEVO: Detectar columna de valores y aplicar formato contable ===

        const lastRowNumber = ws.lastRow.number;

        const headers = trimmedData[0];



        let totalColName = "total";

        if (empresaSelect.value === 'EXPRO') {

            totalColName = "costo_total";

        } else if (empresaSelect.value === 'SULLAIR') {

            totalColName = "costo";

        } else if (empresaSelect.value === 'TETRA') {

            totalColName = "valor";

        } else if (empresaSelect.value === 'SECCO') {

            totalColName = "Total";

        }



        const totalColIndex = headers.indexOf(totalColName) + 1;



        if (totalColIndex > 0) {

            const colLetter = ws.getColumn(totalColIndex).letter;



            // Aplicar formato contable a cada celda de la columna

            for (let row = 2; row <= lastRowNumber; row++) {

                const cell = ws.getCell(`${colLetter}${row}`);

                if (typeof cell.value === 'number') {

                    cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

                    cell.alignment = { horizontal: 'right' };

                }

            }



            // Celda de suma

            const sumCell = ws.getCell(`${colLetter}${lastRowNumber + 1}`);

            sumCell.value = { formula: `SUM(${colLetter}2:${colLetter}${lastRowNumber})` };

            sumCell.font = { bold: true, color: { argb: '000000' } };

            sumCell.alignment = { horizontal: 'right' };

            sumCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';



            // (Opcional) Celda "TOTAL" a la izquierda

            const labelCell = ws.getCell(`${String.fromCharCode(colLetter.charCodeAt(0) - 1)}${lastRowNumber + 1}`);

            labelCell.value = "TOTAL";

            labelCell.font = { bold: true };

            labelCell.alignment = { horizontal: 'right' };

        }





        // Ajustar ancho de columnas según contenido (después de formatear)

        ws.columns.forEach(column => {

            let maxLength = 10;

            column.eachCell({ includeEmpty: true }, cell => {

                const text = cell.value ? cell.value.toString() : '';

                maxLength = Math.max(maxLength, text.length + 2);

            });

            column.width = maxLength;

        });



        // Exportar como archivo

        const buffer = await wb.xlsx.writeBuffer();

        const blob = new Blob([buffer], {

            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        });



        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "resumen.xlsx";

        link.click();

    });







    empresaSelect.addEventListener('change', async () => {

        const selectedEmpresa = empresaSelect.value;

        console.log(selectedEmpresa);

        if (selectedEmpresa) {

            try {

                let data;

                if (selectedEmpresa === 'SECCO') {

                    async function obtenerRemitos() {

                        try {

                            const response = await fetch('../../server/backend/modules/fetch-remitos-secco.php', {

                                method: 'GET',

                                headers: {

                                    'Content-Type': 'application/json',

                                }

                            });



                            if (!response.ok) {

                                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);

                            }



                            // Obtener la respuesta en formato JSON directamente

                            try {

                                data = await response.json(); // No es necesario JSON.parse aquí

                            } catch (e) {

                                throw new Error("Error al convertir la respuesta en JSON.");

                            }



                            //console.log("Datos obtenidos correctamente:", data.data);

                            return data;



                        } catch (error) {

                            console.error("Error al obtener los remitos:", error.message);

                            return []; // Retornar un array vacío en caso de error

                        }

                    }

                    data = await obtenerRemitos();  // ✅ Ahora data tiene un valor



                } else if (selectedEmpresa === 'SULLAIR') {

                    async function obtenerRemitosS() {

                        try {

                            const response = await fetch('../../server/backend/modules/fetch-remitos-sullair.php', {

                                method: 'GET',

                                headers: {

                                    'Content-Type': 'application/json',

                                }

                            });



                            if (!response.ok) {

                                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);

                            }



                            // Obtener la respuesta en formato JSON directamente

                            try {

                                data = await response.json(); // No es necesario JSON.parse aquí

                            } catch (e) {

                                throw new Error("Error al convertir la respuesta en JSON.");

                            }



                            //console.log("Datos obtenidos correctamente:", data.data);

                            return data;



                        } catch (error) {

                            console.error("Error al obtener los remitos:", error.message);

                            return []; // Retornar un array vacío en caso de error

                        }

                    }

                    data = await obtenerRemitosS();  // ✅ Ahora data tiene un valor

                } else if (selectedEmpresa === 'EXPRO') {

                    async function obtenerRemitosE() {

                        try {

                            const response = await fetch('../../server/backend/modules/fetch-remitos-expro.php', {

                                method: 'GET',

                                headers: {

                                    'Content-Type': 'application/json',

                                }

                            });



                            if (!response.ok) {

                                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);

                            }



                            // Obtener la respuesta en formato JSON directamente

                            try {

                                data = await response.json(); // No es necesario JSON.parse aquí

                            } catch (e) {

                                throw new Error("Error al convertir la respuesta en JSON.");

                            }



                            //console.log("Datos obtenidos correctamente:", data.data);

                            return data;



                        } catch (error) {

                            console.error("Error al obtener los remitos:", error.message);

                            return []; // Retornar un array vacío en caso de error

                        }

                    }

                    data = await obtenerRemitosE();

                } else {

                    const response2 = await fetch('../../server/backend/modules/fetch-remitos-empresa.php', {

                        method: 'POST',

                        headers: {

                            'Content-Type': 'application/json',

                        },

                        body: JSON.stringify({ empresa_cliente: selectedEmpresa }),

                    });

                    data = await response2.json();

                }

                console.log("fff", data);

                if (data.success) {

                    //console.log('Datos recibidos del backend:', data.data);

                    if (Array.isArray(data.data)) {

                        const hiddenColumn = 'formulas'; // Columna oculta

                        const columnNames = Object.keys(data.data[0] || {}); // Obtener nombres de columnas visibles



                        // Procesar las fórmulas si están presentes

                        const formulas = data.data.map(row => JSON.parse(row.formula || '[]'));



                        // Configurar los datos de Handsontable

                        const modifiedData = [

                            columnNames.filter(name => name !== hiddenColumn), // Primera fila con los nombres de las columnas visibles

                            ...data.data.map(row =>

                                columnNames.filter(name => name !== hiddenColumn).map(name => row[name]) // Mapear valores solo para columnas visibles

                            ),

                        ];



                        // Crear los encabezados de columna como letras, excluyendo "formula"

                        const colHeaders = Array.from({ length: columnNames.length }, (_, index) =>

                            String.fromCharCode(65 + index) // Convertir índice a letras (A, B, C, ...)

                        ).filter((_, index) => columnNames[index] !== hiddenColumn);



                        // Índices de las columnas que no se pueden editar

                        const nonEditableColumns = ['fecha', 'nroRemito', 'remitoGo', 'total', 'remito', 'division','dominio'];

                        const nonEditableIndexes = columnNames.map((name, index) =>

                            nonEditableColumns.includes(name) ? index : null

                        ).filter(index => index !== null);



                        const selectedEmpresa = empresaSelect.value; // Empresa seleccionada

                        let totalCost = 0;



                        // Determinar la columna a sumar según la empresa

                        let columnToSum = '';

                        if (selectedEmpresa === 'SULLAIR') {

                            columnToSum = 'costo'; // Columna para SULLAIR

                        } else if (selectedEmpresa === 'GO LOGISTISCA') {

                            columnToSum = 'total'; // Columna para GO LOGISTICS

                        } else if (selectedEmpresa === 'EXPRO') {

                            columnToSum = 'costo_total'; // Columna para EXPRO

                        } else if (selectedEmpresa === 'TETRA') {

                            columnToSum = 'valor'; // Columna para EXPRO

                        } else if (selectedEmpresa === 'SECCO') {

                            columnToSum = 'Total'; // Columna para SECCO

                        }

                        const costColumnIndex = columnNames.indexOf(columnToSum); // Obtener índice de la columna

                        if (costColumnIndex !== -1) {

                            data.data.forEach(row => {

                                let value = row[columnToSum];



                                // Convertir valores con formato numérico como "1.234,56" a números reales

                                if (typeof value === "string") {

                                    value = value.replace(/\./g, '').replace(',', '.'); // Eliminar puntos de miles y cambiar coma por punto decimal

                                }



                                value = parseFloat(value) || 0; // Convertir a número y manejar NaN

                                totalCost += value;

                            });

                        }





                        // Función para formatear el número como "000.000.000,00"

                        function formatNumber(value) {

                            return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

                        }



                        if (costColumnIndex !== -1) {

                            const lastRowIndex = modifiedData.length - 1;

                            const sumRowIndex = lastRowIndex + 1; // Dos filas más abajo

                            if (!modifiedData[sumRowIndex]) {

                                modifiedData[sumRowIndex] = Array(columnNames.length).fill(null); // Agregar nueva fila si no existe

                            }

                            // Formatear la suma con el símbolo $ y el formato adecuado

                            modifiedData[sumRowIndex][costColumnIndex] = `$${formatNumber(totalCost)}`; // Insertar la suma formateada

                        }







                        // Configurar Handsontable

                        hot.updateSettings({

                            data: modifiedData,

                            colHeaders: colHeaders,

                            rowHeaders: true,

                            stretchH: 'all',

                            height: `${Math.floor(window.innerHeight * 0.78)}px`,

                            minRows: 20,

                            minCols: columnNames.length,

                            licenseKey: 'non-commercial-and-evaluation',

                            cells: (row, col) => {

                                const cellProperties = {};

                                if (row === 0) {

                                    cellProperties.readOnly = true;

                                    cellProperties.className = 'column-name-row';

                                }

                                if (nonEditableIndexes.includes(col)) {

                                    cellProperties.readOnly = true;

                                    cellProperties.className = 'non-editable-column';

                                }

                                return cellProperties;

                            },

                        });



                        // Estilos para celdas personalizadas

                        const style = document.createElement('style');

                        style.innerHTML = `

        .column-name-row {

            background-color: #a0a0a0ff;

            font-weight: bold;

            color: #000;

            text-align: center;

        }  

        .non-editable-column {

            background-color: #f5f5f5;

            color: #000;

    }

`;

                        document.head.appendChild(style);





                        // Aplicar las fórmulas a los metadatos de las celdas correspondientes

                        formulas.forEach(formulaArray => {

                            formulaArray.forEach(({ row, col, formula }) => {

                                hot.setCellMeta(row, col, 'formula', formula);

                            });

                        });



                        // Renderizar Handsontable

                        hot.render();



                        hot.addHook('afterSelection', (row, col) => {

                            const actualColumn = columnNames.filter(name => name !== hiddenColumn)[col];

                            const formula = hot.getCellMeta(row, col).formula;

                            if (formula) {

                                formulaInput.value = formula;

                            } else {

                                formulaInput.value = '';

                            }

                        });

                    } else {

                        alert('No hay datos disponibles para esta empresa.');

                    }



                } else {

                    alert('Error al procesar la empresa seleccionada: ' + (data.message || 'Intente más tarde.'));

                }

            } catch (error) {

                console.error('Error al enviar la empresa seleccionada:', error);

                alert('Hubo un problema al conectarse con el servidor.');

            }

        } else {

            alert('Por favor, seleccione una empresa válida.');

        }

    });

});



