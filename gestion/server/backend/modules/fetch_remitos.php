<?php
require_once '../../conected-bd.php';
session_start(); // Iniciar sesión para obtener el usuario logueado

// Habilitar la cabecera JSON
header('Content-Type: application/json; charset=utf-8');

$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

try {
    // Obtener el rol del usuario logueado
    $usuario = $_SESSION['usuario']['tipo_usuario'];
    ; // Asumiendo que el usuario se almacena en la sesión
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
                $empresaFiltro = " AND empresa = 'TPOIL'"; // Si es administrador, no se filtra nada
                break;
        }
    }

    // Consulta para obtener los datos paginados de remitos pendientes con filtro según usuario
    $query = "SELECT 
                id,
                empresa,
                empresa_destino,
                CONCAT('$', FORMAT(valor_total, 2, 'de_DE')) AS valor_total,
                email,
                archivos,
                facturas,
                estado,
                descripcion,
                nroRemito,
                debe,
                DATE_FORMAT(fechaEnvio, '%d-%m-%Y') AS fechaEnvio,
                DATE_FORMAT(fechaFacturado, '%d-%m-%Y') AS fechaFacturado,
                nroFactura
          FROM remito 
          WHERE estado IN ('PendienteSinEnviar', 'PendientePorFacturar') 
          $empresaFiltro
          ORDER BY fechaCreacion DESC
          LIMIT :limit OFFSET :offset";

    $stmt = $base_de_datos->prepare($query);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Consulta para contar el total de registros y la suma del valor_total según el filtro de empresa
    /*$countQuery = "SELECT COUNT(*) as total, 
                          COALESCE(SUM(valor_total), 0) as total_valor 
                   FROM remito 
                   WHERE estado IN ('PendienteSinEnviar', 'PendientePorFacturar')
                   $empresaFiltro";*/
    // Consulta para contar el total de registros y la suma del valor_total con IVA
    $countQuery = "SELECT COUNT(*) as total, 
        COALESCE(SUM(valor_total), 0) as total_valor 
        FROM remito 
        WHERE estado IN ('PendienteSinEnviar', 'PendientePorFacturar') $empresaFiltro";


    $countStmt = $base_de_datos->prepare($countQuery);
    $countStmt->execute();
    $result = $countStmt->fetch(PDO::FETCH_ASSOC);

    $totalCount = (int) $result['total'];
    $totalValor = (float) $result['total_valor'];

    $totalValor = number_format($totalValor, 2, '.', ''); // Formateado con dos decimales
    $totalPages = ($totalCount > 0) ? ceil($totalCount / $limit) : 1;

    echo json_encode([
        'success' => true,
        'data' => $remitos,
        'totalPages' => $totalPages,
        'currentPage' => $page,
        'totalValor' => $totalValor,
        'user' => $usuario
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los remitos: ' . $e->getMessage()
    ]);
}
exit;


