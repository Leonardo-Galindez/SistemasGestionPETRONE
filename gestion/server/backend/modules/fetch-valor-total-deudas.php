<?php
require_once '../../conected-bd.php';

try {
    // Consulta para obtener el total de valor_total para el estado 'Facturado'
    $query = "SELECT SUM(valor_total*1.21) as total_deuda
              FROM remito
              WHERE estado = 'Facturado'";
    $stmt = $base_de_datos->query($query);

    // Obtener el resultado
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$resultado || $resultado['total_deuda'] === null) {
        echo json_encode(['success' => true, 'total' => 0, 'message' => 'No hay remitos disponibles en el estado Facturado.']);
    } else {
        echo json_encode(['success' => true, 'total' => (float)$resultado['total_deuda']]);
    }
} catch (PDOException $e) {
    // Registrar el error en los logs del servidor y devolver un mensaje al cliente
    error_log('Error al obtener remitos: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error al obtener remitos: ' . $e->getMessage()]);
}
exit;

