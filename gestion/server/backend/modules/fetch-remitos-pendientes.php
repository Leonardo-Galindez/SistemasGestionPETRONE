<?php
require_once '../../conected-bd.php';
session_start(); // Iniciar sesión para obtener el usuario logueado

header('Content-Type: application/json; charset=utf-8');

try {
    // Obtener el rol del usuario logueado
    $usuario = $_SESSION['usuario']['tipo_usuario'] ?? ''; // Asegurar que la variable esté definida
    $empresaFiltro = "";

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
                $empresaFiltro = ""; // Administrador u otro usuario sin filtro
                break;
        }
    }

    // Consulta para obtener los remitos con los estados específicos y filtro por empresa
    $query = "SELECT 
                    empresa,
                    empresa_destino,
                    CONCAT('$', FORMAT(SUM(valor_total), 2, 'de_DE')) AS total_valor
              FROM 
                    remito
              WHERE 
                    estado IN ('PendienteSinEnviar', 'PendientePorFacturar')
                    $empresaFiltro
              GROUP BY 
                    empresa, empresa_destino";

    $stmt = $base_de_datos->query($query);
    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($remitos)) {
        echo json_encode(['success' => true, 'data' => [], 'message' => 'No hay remitos disponibles.']);
    } else {
        echo json_encode(['success' => true, 'data' => $remitos]);
    }
} catch (PDOException $e) {
    error_log('Error al obtener remitos: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error al obtener remitos: ' . $e->getMessage()]);
}
exit;

