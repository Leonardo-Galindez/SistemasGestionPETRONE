<?php

require_once '../conected-bd.php';



header('Content-Type: application/json; charset=utf-8');



try {

    // Validar datos de entrada

    $nroRemito = $_POST['nro_remito'] ?? null;

    $nroFactura = $_POST['nro_factura'] ?? null;

    $fechaFacturado = $_POST['fechaFacturado'] ?? null;

    $fecha = $_POST['fecha'] ?? null;

    $fechaPagado = $_POST['fechaPago'] ?? null;

    $dominio = $_POST['dominio'] ?? null;

    $empresa = $_POST['empresa'] ?? null;

    $nuevaEmpresa = $_POST['nueva_empresa_destino'] ?? null;

    $empresaDestino = $_POST['empresa_destino'] ?? null;

    $valorTotal = $_POST['valor_total'] ?? null;

    $email = $_POST['email'] ?? null;

    $fechaEnvio = $_POST['fechaEnvio'] ?? null;

    $estado = $_POST['estado'] ?? 'PendientePorEnviar';

    $debe = $_POST['debe'] ?? null;

    $descripcion = $_POST['descripcion'] ?? null;

    $detalle = $_POST['detalle'] ?? null;

    $fechaVencimiento = $_POST['fechaVencimiento'] ?? null;

    $incluirArchivos = isset($_POST['incluirArchivos']);

    $incluirFacturas = isset($_POST['incluirFacturas']);

    $fechaRemito = $_POST['fechaRemito'] ?? null;

    $division = $_POST['division'] ?? null;



    // Manejar archivos subidos



    /*

        if ($estado === 'PendientePorFacturar') {

            $fechaEnvio = date('Y-m-d H:i:s');

        } elseif ($estado === 'Facturado') {

            $fechaFacturado = date('Y-m-d H:i:s');

            //$debe = '';

        }

    */

    $archivos = [];

    $facturas = [];



    if (!empty($_FILES['facturas']['name'])) {



        $targetDir = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";

        if (!is_dir($targetDir) && !mkdir($targetDir, 0777, true)) {

            echo json_encode(['success' => false, 'error' => 'No se pudo crear el directorio para subir archivos.']);

            exit;

        }



        error_log("Directorio de subida de facturas: " . $targetDir);

        foreach ($_FILES['facturas']['name'] as $index => $fileName) {

            // Ignorar archivos con errores

            if ($_FILES['facturas']['error'][$index] !== UPLOAD_ERR_OK) {

                continue; // Ignorar este archivo y pasar al siguiente

            }



            //$uniqueName = uniqid() . "_" . basename($fileName);

            $uniqueName = basename($fileName);

            $filePath = $targetDir . $uniqueName;

            $relativePath = "uploads/" . $uniqueName;



            if (move_uploaded_file($_FILES['facturas']['tmp_name'][$index], $filePath)) {

                $facturas[] = $relativePath;

            } else {

                echo json_encode(['success' => false, 'error' => "Error al guardar la factura: $fileName"]);

                exit;

            }

        }

    }



    if (!empty($_FILES['archivos']['name'])) {



        $targetDir = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";

        if (!is_dir($targetDir) && !mkdir($targetDir, 0777, true)) {

            echo json_encode(['success' => false, 'error' => 'No se pudo crear el directorio para subir archivos.']);

            exit;

        }

        error_log("Directorio de subida de archivos: " . $targetDir);

        foreach ($_FILES['archivos']['name'] as $index => $fileName) {

            // Ignorar archivos con errores

            if ($_FILES['archivos']['error'][$index] !== UPLOAD_ERR_OK) {

                continue; // Ignorar este archivo y pasar al siguiente

            }



            //$uniqueName = uniqid() . "_" . basename($fileName);

            $uniqueName = basename($fileName);

            $filePath = $targetDir . $uniqueName;

            $relativePath = "uploads/" . $uniqueName;



            if (move_uploaded_file($_FILES['archivos']['tmp_name'][$index], $filePath)) {

                $archivos[] = $relativePath;

            } else {

                echo json_encode(['success' => false, 'error' => "Error al guardar el archivo: $fileName"]);

                exit;

            }

        }

    }



    if ($empresaDestino === 'OTRA') {

        $empresaDestino = $nuevaEmpresa;

    }



    // Insertar datos en la base de datos

    $stmt = $base_de_datos->prepare("

        INSERT INTO remito (nroFactura,fechaPagado,fechaVencimiento,empresa, empresa_destino, valor_total, email, archivos, estado, fechaFacturado, fechaEnvio, descripcion, nroRemito, debe,fecha,dominio,detalle,facturas,incluirArchivos,incluirFacturas,fechaRemito,division)

        VALUES (:nroFactura ,:fechaPagado, :fechaVencimiento,:empresa,:empresa_destino, :valor_total, :email, :archivos, :estado, :fechaFacturado, :fechaEnvio ,:descripcion, :nroRemito, :debe,:fecha,:dominio,:detalle,:facturas,:incluirArchivos,:incluirFacturas,:fechaRemito,:division)

    ");



    $stmt->execute([

        ':nroFactura' => $nroFactura,

        ':empresa' => $empresa,

        ':empresa_destino' => $empresaDestino,

        ':valor_total' => $valorTotal,

        ':email' => $email,

        ':archivos' => json_encode($archivos),

        ':facturas' => json_encode($facturas),

        ':estado' => $estado,

        ':fechaFacturado' => $fechaFacturado,

        ':fechaEnvio' => $fechaEnvio,

        ':fechaPagado' => $fechaPagado,

        ':fechaVencimiento' => $fechaVencimiento,

        ':descripcion' => $descripcion,

        ':nroRemito' => $nroRemito,

        ':debe' => $debe,

        ':fecha' => $fecha,

        ':dominio' => $dominio,

        ':detalle' => $detalle,

        ':incluirArchivos' => $incluirArchivos,

        ':incluirFacturas' => $incluirFacturas,

        ':fechaRemito' => $fechaRemito,

        ':division' => $division

    ]);



    $lastInsertId = $base_de_datos->lastInsertId();



    echo json_encode([

        'success' => true,

        'message' => 'Remito agregado exitosamente',

        'remito' => [

            'id' => $lastInsertId,

            'nroFactura' => $nroFactura,

            'empresa' => $empresa,

            'empresa_destino' => $empresaDestino,

            'valor_total' => $valorTotal,

            'email' => $email,

            'estado' => $estado,

            'archivos' => $archivos,

            'fechaFacturado' => $fechaFacturado,

            'fechaEnvio' => $fechaEnvio,

            'fechaPagado' => $fechaPagado,

            'fechaVencimiento' => $fechaVencimiento,

            'descripcion' => $descripcion,

            'nroRemito' => $nroRemito,

            'debe' => $debe,

            'fecha' => $fecha,

            'dominio' => $dominio,

            'detalle' => $detalle,

            'incluirArchivos' => $incluirArchivos,

            'incluirFacturas' => $incluirFacturas,

            'fechaRemito' => $fechaRemito,

            'division' => $division

        ]

    ]);

} catch (PDOException $e) {

    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);

} catch (Exception $e) {

    echo json_encode(['success' => false, 'error' => 'Error general: ' . $e->getMessage()]);

}

