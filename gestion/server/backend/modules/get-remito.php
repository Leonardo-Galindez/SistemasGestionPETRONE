<?php



require_once '../../conected-bd.php';



header('Content-Type: application/json');



try {

    // Verificar si se recibió el ID del remito

    $id = $_GET['id'] ?? null;



    if (empty($id)) {

        echo json_encode(['success' => false, 'error' => 'ID de remito no proporcionado']);

        exit;

    }



    // Consultar la base de datos para obtener el remito

    $query = "SELECT id, empresa, empresa_destino, valor_total, email, archivos, estado, descripcion, nroRemito, debe, fecha ,dominio, fechaEnvio,

   fechaFacturado ,nroFactura,fechaPagado,detalle,fechaVencimiento,facturas,incluirArchivos,incluirFacturas,fechaRemito,division FROM remito WHERE id = :id";

    $stmt = $base_de_datos->prepare($query);

    $stmt->execute([':id' => $id]);



    $remito = $stmt->fetch(PDO::FETCH_ASSOC);



    if (!$remito) {

        echo json_encode(['success' => false, 'error' => 'Remito no encontrado']);

        exit;

    }



    // Decodificar la lista de archivos, si es que existe

    $remito['archivos'] = !empty($remito['archivos']) ? json_decode($remito['archivos'], true) : [];

    $remito['facturas'] = !empty($remito['facturas']) ? json_decode($remito['facturas'], true) : [];



    // Respuesta exitosa con los datos del remito

    echo json_encode(['success' => true, 'remito' => $remito]);

} catch (PDOException $e) {

    // Manejar errores de la base de datos

    echo json_encode(['success' => false, 'error' => 'Error al obtener remito: ' . $e->getMessage()]);

}

