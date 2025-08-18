<?php

require_once '../conected-bd.php';

header('Content-Type: application/json');

try {
    // Verificar si se recibió un ID (compatible con ambos formularios)
    $id = $_POST['id'] ?? $_POST['idUpdate'] ?? null;
    if (empty($id)) {
        echo json_encode(['success' => false, 'error' => 'ID de remito no proporcionado']);
        exit;
    }

    // Verificar otros datos necesarios (compatibles con ambos formularios)
    $nroRemito = $_POST['nro_remito'] ?? $_POST['nro_remitoUpdate'] ?? null;
    $nroFactura = $_POST['nro_factura'] ?? $_POST['nro_facturaUpdate'] ?? null;
    $fechaFacturado = $_POST['fechaFacturado'] ?? $_POST['fechaFacturadoUpdate'] ?? null;
    $fecha = $_POST['fecha'] ?? $_POST['fechaUpdate'] ?? null;
    $dominio = $_POST['dominio'] ?? $_POST['dominioUpdate'] ?? null;
    $empresa = $_POST['empresa'] ?? $_POST['empresaUpdate'] ?? null;
    $nuevaEmpresa = $_POST['nuevaEmpresaDestinoUpdate'] ?? null;
    $empresaDestino = $_POST['empresa_destino'] ?? $_POST['empresa_destinoUpdate'] ?? null;
    $valorTotal = $_POST['valor_total'] ?? $_POST['valor_totalUpdate'] ?? null;
    $email = $_POST['email'] ?? $_POST['emailUpdate'] ?? null;
    $fechaPagado = $_POST['fechaPago'] ?? $_POST['fechaPagoUpdate'] ?? null;
    //$fechaEnvio = $_POST['fechaEnvio'] ?? $_POST['fechaEnvioUpdate'] ?? null;
    $estado = $_POST['estado'] ?? $_POST['estadoUpdate'] ?? null;
    $descripcion = $_POST['descripcion'] ?? $_POST['descripcionUpdate'] ?? null;
    $debe = $_POST['debe'] ?? $_POST['debeUpdate'] ?? null;
    $detalle = $_POST['detalle'] ?? $_POST['detalleUpdate'] ?? null;
    $fechaVencimiento = $_POST['fechaVencimiento'] ?? $_POST['fechaVencimientoUpdate'] ?? null;
    $incluirArchivos = isset($_POST['incluirArchivos']) || isset($_POST['incluirArchivosupdate']);
    $incluirFacturas = isset($_POST['incluirFactura']) || isset($_POST['incluirFacturaupdate']);
    $fechaRemito = $_POST['fechaRemito'] ?? $_POST['fechaRemitoUpdate'] ?? null;
    /*if ($estado === 'PendientePorFacturar') {
        $fechaEnvio = date('Y-m-d H:i:s');
    }else if($estado === 'Facturado'){
        $fechaFacturado = date('Y-m-d H:i:s');
    }*/

    $uploadedFiles = [];
    $uploadedFilesFacturas = [];
    
    // Procesar archivos nuevos (si los hay)
    if (!empty($_FILES['archivosUpdate']['name'])) {
        //$targetDir = __DIR__ . "/modules/uploads/";
        $targetDir = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";
        if (!is_dir($targetDir) && !mkdir($targetDir, 0777, true)) {
            echo json_encode(['success' => false, 'error' => 'No se pudo crear el directorio para subir archivos.']);
            exit;
        }
        error_log("Directorio de subida de archivos: " . $targetDir);
        foreach ($_FILES['archivosUpdate']['name'] as $index => $fileName) {
            // Ignorar archivos con errores
            if ($_FILES['archivosUpdate']['error'][$index] !== UPLOAD_ERR_OK) {
                continue; // Ignorar este archivo y pasar al siguiente
            }

            $uniqueName = basename($fileName);
            $filePath = $targetDir . $uniqueName;
            $relativePath = "uploads/" . $uniqueName;

            if (move_uploaded_file($_FILES['archivosUpdate']['tmp_name'][$index], $filePath)) {
                $uploadedFiles[] = $relativePath;
            } else {
                echo json_encode(['success' => false, 'error' => "Error al guardar el archivo: $fileName"]);
                exit;
            }
        }
    }

    if (!empty($_FILES['facturasUpdate']['name'])) {
        //$targetDir = __DIR__ . "/modules/uploads/";
        $targetDirFac = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";
        if (!is_dir($targetDirFac) && !mkdir($targetDirFac, 0777, true)) {
            echo json_encode(['success' => false, 'error' => 'No se pudo crear el directorio para subir archivos.']);
            exit;
        }
        error_log("Directorio de subida de archivos: " . $targetDirFac);
        foreach ($_FILES['facturasUpdate']['name'] as $index => $fileNameFac) {
            // Ignorar archivos con errores
            if ($_FILES['facturasUpdate']['error'][$index] !== UPLOAD_ERR_OK) {
                continue; // Ignorar este archivo y pasar al siguiente
            }

            $uniqueNameFac = basename($fileNameFac);
            $filePathFac = $targetDir . $uniqueNameFac;
            $relativePathFac = "uploads/" . $uniqueNameFac;

            if (move_uploaded_file($_FILES['facturasUpdate']['tmp_name'][$index], $filePathFac)) {
                $uploadedFilesFacturas[] = $relativePathFac;
            } else {
                echo json_encode(['success' => false, 'error' => "Error al guardar el archivo: $fileNameFac"]);
                exit;
            }
        }
    }

    if ($empresaDestino === 'OTRA') {
        $empresaDestino = $nuevaEmpresa;
    }
    // Actualización de los datos en la base de datos
    $query = "
        UPDATE remito
        SET nroFactura = :nroFactura,
            empresa = :empresa,
            empresa_destino = :empresa_destino,
            valor_total = :valor_total,
            email = :email,
            archivos = :archivosUpdate,
            facturas = :facturasUpdate,
            estado = :estado,
            fechaFacturado = :fechaFacturado,
            fechaPagado = :fechaPagado,
            fechaVencimiento = :fechaVencimiento,
            descripcion = :descripcion,
            nroRemito = :nroRemito,
            fechaCreacion = NOW(),
            debe = :debe,
            fecha = :fecha,
            dominio = :dominio,
            detalle = :detalle,
            incluirArchivos = :incluirArchivos,
            incluirFacturas = :incluirFacturas,
            fechaRemito = :fechaRemito
        WHERE id = :id
    ";

    $stmt = $base_de_datos->prepare($query);
    $stmt->execute([
        ':nroFactura' => $nroFactura,
        ':empresa' => $empresa,
        ':empresa_destino' => $empresaDestino,
        ':valor_total' => $valorTotal,
        ':email' => $email,
        ':archivosUpdate' => json_encode($uploadedFiles),
        ':facturasUpdate' => json_encode($uploadedFilesFacturas),
        ':estado' => $estado,
        ':fechaFacturado' => $fechaFacturado,
        ':fechaPagado' => $fechaPagado,
        ':fechaVencimiento' => $fechaVencimiento,
        ':descripcion' => $descripcion,
        ':id' => $id,
        ':nroRemito' => $nroRemito,
        ':debe' => $debe,
        ':fecha' => $fecha,
        ':dominio' => $dominio,
        ':detalle' => $detalle,
        ':incluirArchivos' => $incluirArchivos ? 1 : 0,
        ':incluirFacturas' => $incluirFacturas ? 1 : 0,
        ':fechaRemito' => $fechaRemito     
    ]);

    // Respuesta exitosa
    echo json_encode(['success' => true, 'message' => "Remito $id actualizado correctamente."]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error al actualizar remito: ' . $e->getMessage()]);
}
