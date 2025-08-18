<?php
require_once '../../conected-bd.php';

header('Content-Type: application/json');

try {
    // Obtener los datos enviados desde el frontend
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input)) {
        error_log('No se recibieron datos desde el frontend.');
        echo json_encode(['success' => false, 'message' => 'No se recibieron datos.']);
        exit;
    }

    // Log para verificar los datos recibidos
    error_log('Datos recibidos desde el frontend: ' . print_r($input, true));

    // Preparar la consulta para insertar o actualizar cada fila
    $query = "INSERT INTO tetra (
        remito, detalle
    ) VALUES (
        :remito, :detalle
    )
    ON DUPLICATE KEY UPDATE
        detalle = VALUES(detalle)";

    $stmt = $base_de_datos->prepare($query);

    $filasAfectadas = 0;

    foreach ($input as $fila) {
        $mappedData = [
            ':remito' => $fila['remito'] ?? '',
            ':detalle' => $fila['detalle'] ?? '',
        ];

        // Log para verificar los valores mapeados
        error_log('Valores a insertar/actualizar: ' . print_r($mappedData, true));

        if ($stmt->execute($mappedData)) {
            $filasAfectadas += $stmt->rowCount();
            error_log('Fila insertada/actualizada correctamente.');
        } else {
            error_log('Error al ejecutar la consulta: ' . implode(', ', $stmt->errorInfo()));
        }
    }

    // Responder al cliente con información sobre las filas afectadas
    echo json_encode([
        'success' => true,
        'message' => 'Datos guardados correctamente.',
        'filasAfectadas' => $filasAfectadas
    ]);
} catch (PDOException $e) {
    error_log('Error al guardar los datos: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar los datos: ' . $e->getMessage()
    ]);
}
