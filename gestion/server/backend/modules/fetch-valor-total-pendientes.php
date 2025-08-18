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

    // Consulta para obtener el total de valor_total filtrado por usuario
    $query = "SELECT SUM(valor_total) as total_deuda
              FROM remito
              WHERE estado IN ('PendientePorFacturar', 'PendienteSinEnviar')
              $empresaFiltro";
    $stmt = $base_de_datos->query($query);

    // Obtener el resultado
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    $totalDeuda = $resultado && $resultado['total_deuda'] !== null ? (float)$resultado['total_deuda'] : 0;

    // Si el usuario es administrador, sumar valores de otras tablas
    /*if (!$empresaFiltro) {
        $queries = [
            "secco" => "SELECT COALESCE(SUM(Total), 0) as total FROM secco",
            "sullair" => "SELECT COALESCE(SUM(costo), 0) as total FROM sullair",
            "expro" => "SELECT COALESCE(SUM(costo_total), 0) as total FROM expro"
        ];

        foreach ($queries as $sql) {
            $stmt = $base_de_datos->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            $totalDeuda += (float) ($resultado['total'] ?? 0);
        }
    }*/

    echo json_encode(['success' => true, 'total' => number_format($totalDeuda, 2, ',', '.')]);
} catch (PDOException $e) {
    error_log('Error al obtener remitos: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error al obtener remitos: ' . $e->getMessage()]);
}
exit;
