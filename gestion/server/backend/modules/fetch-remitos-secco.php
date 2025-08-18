<?php
require_once '../../conected-bd.php';

try {
    // Definir la consulta para obtener los nombres de las columnas
    $columnQuery = "SHOW COLUMNS FROM secco";
    $columnStmt = $base_de_datos->query($columnQuery);
    $columns = $columnStmt->fetchAll(PDO::FETCH_COLUMN);

    // Ejecutar la consulta de los datos
    $query = "SELECT  
    DATE_FORMAT(s.Fecha, '%d/%m/%Y') AS Fecha,  -- Cambio aquí
    COALESCE(s.Remito, '') AS Remito,
    COALESCE(s.detalle, '') AS detalle,
    COALESCE(FORMAT(s.subtotal, 2, 'de_DE'), '0,00') AS subtotal,
    COALESCE(s.km, '') AS km,
    COALESCE(FORMAT(s.precio, 2, 'de_DE'), '0,00') AS precio,
    COALESCE(FORMAT(s.Total, 2, 'de_DE'), '0,00') AS Total,
    COALESCE(s.observaciones, '') AS observaciones
FROM secco s";


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

