<?php
require_once '../../conected-bd.php';

try {
    // Consulta para obtener los remitos
    $query = "SELECT empresa_destino, SUM(valor_total) as total_deuda
              FROM remito
              WHERE estado = 'Facturado'
              GROUP BY empresa_destino
              ORDER BY total_deuda DESC";
    $stmt = $base_de_datos->query($query);

    // Obtener todos los registros
    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatear el total_deuda con el símbolo $
    foreach ($remitos as &$remito) {
        $remito['total_deuda'] = '$' . number_format($remito['total_deuda'], 2, ',', '.');
    }

    if (empty($remitos)) {
        echo json_encode(['success' => true, 'data' => [], 'message' => 'No hay remitos disponibles.']);
    } else {
        echo json_encode(['success' => true, 'data' => $remitos]);
    }
} catch (PDOException $e) {
    // Registrar el error en los logs del servidor y devolver un mensaje al cliente
    error_log('Error al obtener remitos: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error al obtener remitos: ' . $e->getMessage()]);
}
exit;
