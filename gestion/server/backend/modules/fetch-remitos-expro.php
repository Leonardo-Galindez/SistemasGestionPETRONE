<?php
require_once '../../conected-bd.php';

try {
    // Definir la consulta para obtener los nombres de las columnas
    $columnQuery = "SHOW COLUMNS FROM expro";
    $columnStmt = $base_de_datos->query($columnQuery);
    $columns = $columnStmt->fetchAll(PDO::FETCH_COLUMN);

    // Ejecutar la consulta de los datos
    $query = "SELECT  
    COALESCE(e.numero_tr, '') AS numero_tr,
    DATE_FORMAT(e.Fecha, '%d/%m/%Y') AS Fecha,  -- Cambio aquí
    COALESCE(e.numero_remito, '') AS numero_remito,
    COALESCE(e.patente, '') AS patente,
    COALESCE(e.tipo_unidad, '') AS tipo_unidad,
    COALESCE(e.dni_chofer, '') AS dni_chofer,
    COALESCE(e.origen, '') AS origen,
    COALESCE(e.destino, '') AS destino,
    COALESCE(e.operador_a, '') AS operador_a,
    COALESCE(e.centro_costo, '') AS centro_costo,
    COALESCE(e.service_line, '') AS service_line,
    COALESCE(e.resumen_servicio, '') AS resumen_servicio,
    COALESCE(e.km_recorridos, '') AS km_recorridos,
    COALESCE(e.horas_servicio, '') AS horas_servicio,
    COALESCE(FORMAT(e.costo_transporte, 2, 'de_DE'), '0,00') AS costo_transporte,
    COALESCE(e.servicios_adicionales, '') AS servicios_adicionales,
    COALESCE(FORMAT(e.costo_km_adic, 2, 'de_DE'), '0,00') AS costo_km_adic,
    COALESCE(FORMAT(e.costo_horas_espera, 2, 'de_DE'), '0,00') AS costo_horas_espera,
    COALESCE(FORMAT(e.costo_total, 2, 'de_DE'), '0,00') AS costo_total
FROM expro e";


    error_log("Consulta SQL: " . $query); // Log de la consulta SQL

    $stmt = $base_de_datos->query($query);
    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Log de los datos obtenidos
    error_log("Datos obtenidos: " . print_r($remitos, true));

    if (empty($remitos)) {
        // Si no hay datos, devolver solo los nombres de las columnas con valores vacíos
        $emptyRow = array_fill_keys($columns, '');
        $response = ['success' => true, 'data' => [$emptyRow], 'message' => 'No hay remitos disponibles.'];
    } else {
        $response = ['success' => true, 'data' => $remitos];
    }

    // Log de la respuesta JSON enviada
    error_log("Respuesta enviada: " . json_encode($response));

    echo json_encode($response);
} catch (PDOException $e) {
    // Registrar el error en los logs del servidor
    error_log('Error al obtener remitos: ' . $e->getMessage());

    $errorResponse = ['success' => false, 'error' => 'Error al obtener remitos: ' . $e->getMessage()];
    error_log("Respuesta de error enviada: " . json_encode($errorResponse));

    echo json_encode($errorResponse);
}
exit;
