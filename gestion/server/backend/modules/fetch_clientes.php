<?php
require_once '../../conected-bd.php';

try {
    // Consulta para obtener las empresas únicas (sin valores nulos)
    $query = "SELECT empresa_destino
        FROM remito
        WHERE empresa_destino IS NOT NULL
        GROUP BY empresa_destino
    ";
    $stmt = $base_de_datos->query($query);

    // Obtener todos los registros
    $empresas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($empresas)) {
        echo json_encode(['success' => true, 'data' => [], 'message' => 'No hay empresas disponibles.']);
    } else {
        echo json_encode(['success' => true, 'data' => $empresas]);
    }

} catch (PDOException $e) {
    // Registrar el error en los logs del servidor y devolver un mensaje al cliente
    error_log('Error al obtener empresas: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error al obtener empresas: ' . $e->getMessage()]);
}
exit;