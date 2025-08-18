<?php
require_once '../../conected-bd.php';

try {
    // Recibir los valores de los filtros desde el frontend
    $empresa = isset($_POST['empresa']) ? trim($_POST['empresa']) : '';
    $empresaDestino = isset($_POST['empresaDestino']) ? trim($_POST['empresaDestino']) : '';
    $fechaInicio = isset($_POST['fechaInicio']) ? $_POST['fechaInicio'] : '';
    $fechaFin = isset($_POST['fechaFin']) ? $_POST['fechaFin'] : '';

    // Construcción dinámica de la consulta SQL
    $query = "SELECT empresa,empresa_destino, SUM(valor_total) as total_deuda
              FROM remito
              WHERE estado = 'Facturado'
              GROUP BY empresa_destino
              ORDER BY total_deuda DESC";

    // Arreglo para almacenar parámetros
    $params = [];
    
    // Aplicar los filtros solo si tienen valores
    if (!empty($empresa)) {
        $query .= " AND LOWER(empresa) LIKE LOWER(:empresa)";
        $params[':empresa'] = "%$empresa%";
    }

    if (!empty($empresaDestino)) {
        $query .= " AND LOWER(empresa_destino) LIKE LOWER(:empresaDestino)";
        $params[':empresaDestino'] = "%$empresaDestino%";
    }

    if (!empty($fechaInicio)) {
        $query .= " AND fechaFacturado >= :fechaInicio";
        $params[':fechaInicio'] = $fechaInicio;
    }

    if (!empty($fechaFin)) {
        $query .= " AND fechaFacturado <= :fechaFin";
        $params[':fechaFin'] = $fechaFin;
    }

    $query .= " GROUP BY empresa_destino;";

    // Preparar la consulta
    $stmt = $base_de_datos->prepare($query);

    // Ejecutar la consulta con los parámetros
    $stmt->execute($params);

    // Obtener los resultados
    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($remitos)) {
        echo json_encode(['success' => true, 'data' => [], 'message' => 'No hay remitos que coincidan con los filtros.']);
    } else {
        echo json_encode(['success' => true, 'data' => $remitos]);
    }
} catch (PDOException $e) {
    error_log('Error al obtener remitos: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error en la consulta de remitos: ' . $e->getMessage()]);
}
exit;
