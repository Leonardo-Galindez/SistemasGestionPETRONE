<?php
require_once '../../conected-bd.php';
session_start(); // Iniciar sesión para obtener el usuario logueado

header('Content-Type: application/json; charset=utf-8');

try {
    // Obtener el rol del usuario logueado
    $usuario = isset($_SESSION['usuario']['tipo_usuario']) ? $_SESSION['usuario']['tipo_usuario'] : null;
    $empresaFiltro = "";

    // Recibir los valores de los filtros desde el frontend
    $empresa = isset($_POST['empresa']) ? trim($_POST['empresa']) : '';
    $empresaDestino = isset($_POST['empresaDestino']) ? trim($_POST['empresaDestino']) : '';
    $fechaInicio = isset($_POST['fechaInicio']) ? $_POST['fechaInicio'] : '';
    $fechaFin = isset($_POST['fechaFin']) ? $_POST['fechaFin'] : '';

    if ($usuario) {
        switch ($usuario) {
            case 'nemer':
                $empresaFiltro = " AND empresa = 'NEMER'";
                break;
            case 'abasto':
                $empresaFiltro = " AND empresa = 'ABASTO'";
                break;
            case 'transpetrone':
                $empresaFiltro = " AND empresa = 'TRANSPETRONE'";
                break;
            default:
                $empresaFiltro = ""; // Si es administrador, no se filtra nada
                break;
        }
    }
    // Construcción dinámica de la consulta SQL
    $query = "SELECT 
        empresa,
        empresa_destino,
        CONCAT('$', FORMAT(SUM(valor_total), 2, 'de_DE')) AS total_valor
    FROM 
        remito
    WHERE 
        estado IN ('PendienteSinEnviar', 'PendientePorFacturar') 
        $empresaFiltro";

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
        $query .= " AND fechaCreacion >= :fechaInicio";
        $params[':fechaInicio'] = $fechaInicio;
    }

    if (!empty($fechaFin)) {
        $query .= " AND fechaCreacion <= :fechaFin";
        $params[':fechaFin'] = $fechaFin;
    }

    $query .= " GROUP BY empresa, empresa_destino;";

    // Preparar la consulta
    $stmt = $base_de_datos->prepare($query);

    // Ejecutar la consulta con los parámetros
    $stmt->execute($params);

    // Obtener los resultados
    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ----------------- NUEVO CÁLCULO DE totalValor -------------------
    $totalValorQuery = "SELECT SUM(valor_total) as total_valor FROM remito 
                        WHERE estado IN ('PendienteSinEnviar', 'PendientePorFacturar') $empresaFiltro";
    if (!empty($empresa)) {
        $totalValorQuery .= " AND LOWER(empresa) LIKE LOWER(:empresa)";
    }
    if (!empty($empresaDestino)) {
        $totalValorQuery .= " AND LOWER(empresa_destino) LIKE LOWER(:empresaDestino)";
    }
    if (!empty($fechaInicio)) {
        $totalValorQuery .= " AND fechaCreacion >= :fechaInicio";
    }
    if (!empty($fechaFin)) {
        $totalValorQuery .= " AND fechaCreacion <= :fechaFin";
    }

    $stmtTotal = $base_de_datos->prepare($totalValorQuery);
    foreach ($params as $key => &$value) {
        $stmtTotal->bindParam($key, $value);
    }
    $stmtTotal->execute();
    $totalResult = $stmtTotal->fetch(PDO::FETCH_ASSOC);
    $totalValor = $totalResult['total_valor'] ?? 0;
    // -----------------------------------------------------------------

    if (empty($remitos)) {
        echo json_encode([
            'success' => true,
            'data' => [],
            'tipo_usuario' => $usuario,
            'totalValor' => number_format($totalValor, 2, '.', ''),
            'message' => 'No hay remitos que coincidan con los filtros.'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => $remitos,
            'tipo_usuario' => $usuario,
            'totalValor' => number_format($totalValor, 2, '.', '')
        ]);
    }
} catch (PDOException $e) {
    error_log('Error al obtener remitos: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Error en la consulta de remitos: ' . $e->getMessage()
    ]);
}
exit;



