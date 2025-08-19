<?php

ini_set('display_errors', 1);

ini_set('display_startup_errors', 1);

error_reporting(E_ALL);

require_once '../../conected-bd.php';

header('Content-Type: application/json');



function logDatos($datos) {

    $logFile = __DIR__ . '/log_remitos_update.log'; // Ruta del log (podés cambiarla)

    $fecha = date("Y-m-d H:i:s");

    file_put_contents($logFile, "[$fecha] " . print_r($datos, true) . "\n", FILE_APPEND);

}



try {

    $remitosSeleccionador = isset($_POST['remitosSeleccionador']) ? json_decode($_POST['remitosSeleccionador'], true) : null;

    if (empty($remitosSeleccionador)) {

        echo json_encode(['success' => false, 'error' => 'No se seleccionaron remitos.']);

        exit;

    }



    // Datos del formulario

    $nroFactura = $_POST['nro_facturaUpdateGrupo'] ?? null;

    $fechaFacturado = $_POST['fechaFacturadoUpdateGrupo'] ?? null;

    $email = $_POST['emailUpdateGrupo'] ?? null;

    $fechaPagado = $_POST['fechaPagoUpdate'] ?? null;

    $fechaVencimiento = $_POST['fechaVencimientoUpdateGrupo'] ?? null;

    $nroRemitoConAdjunto = $_POST['nro_remitoAdjuntoGrupo'] ?? null;



    // Guardar log de datos del formulario

    logDatos([

        'POST' => $_POST,

        'FILES' => $_FILES,

        'remitosSeleccionador' => $remitosSeleccionador

    ]);



    // Procesar archivos

    $uploadedFiles = [];

    if (!empty($_FILES['facturasUpdateGrupo']['name'])) {

        $targetDir = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";

        if (!is_dir($targetDir) && !mkdir($targetDir, 0777, true)) {

            echo json_encode(['success' => false, 'error' => 'No se pudo crear el directorio de subida.']);

            exit;

        }



        foreach ($_FILES['facturasUpdateGrupo']['name'] as $index => $fileName) {

            if ($_FILES['facturasUpdateGrupo']['error'][$index] !== UPLOAD_ERR_OK) {

                continue;

            }



            $uniqueName = time() . "_" . basename($fileName);

            $filePath = $targetDir . $uniqueName;

            $relativePath = "uploads/" . $uniqueName;



            if (move_uploaded_file($_FILES['facturasUpdateGrupo']['tmp_name'][$index], $filePath)) {

                $uploadedFiles[] = $relativePath;

            } else {

                echo json_encode(['success' => false, 'error' => "Error al guardar el archivo: $fileName"]);

                exit;

            }

        }

    }



    // Actualizar cada remito

    foreach ($remitosSeleccionador as $idRemito) {

        $setParts = [];

        $params = [];



        if ($nroFactura !== null && $nroFactura !== '') {

            $setParts[] = "nroFactura = :nroFactura";

            $params[':nroFactura'] = $nroFactura;

        }



        if ($email !== null && $email !== '') {

            $setParts[] = "email = :email";

            $params[':email'] = $email;

        }



        if ($fechaFacturado !== null && $fechaFacturado !== '') {

            $setParts[] = "fechaFacturado = :fechaFacturado";

            $params[':fechaFacturado'] = $fechaFacturado;

        }



        if ($fechaPagado !== null && $fechaPagado !== '') {

            $setParts[] = "fechaPagado = :fechaPagado";

            $params[':fechaPagado'] = $fechaPagado;

        }



        if ($fechaVencimiento !== null && $fechaVencimiento !== '') {

            $setParts[] = "fechaVencimiento = :fechaVencimiento";

            $params[':fechaVencimiento'] = $fechaVencimiento;

        }



        $esRemitoConAdjunto = ($idRemito == $nroRemitoConAdjunto);

        if ($esRemitoConAdjunto) {

            $facturasParaGuardar = !empty($uploadedFiles) ? json_encode($uploadedFiles) : null;

            $setParts[] = "incluirFacturas = 1";

            $setParts[] = "facturas = :facturas";

            $params[':facturas'] = $facturasParaGuardar;

        }

        $setParts[] = "fechaCreacion = NOW()";

        $setClause = implode(', ', $setParts);

        $params[':idRemito'] = $idRemito;

        $stmt = $base_de_datos->prepare("UPDATE remito SET $setClause WHERE id = :idRemito");

        $stmt->execute($params);

    }



    echo json_encode(['success' => true, 'message' => 'Remitos actualizados correctamente.']);

} catch (PDOException $e) {

    echo json_encode(['success' => false, 'error' => 'Error al actualizar remitos: ' . $e->getMessage()]);

}

