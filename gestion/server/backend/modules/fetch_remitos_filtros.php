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
    $usuario = $_SESSION['usuario']['tipo_usuario'] ?? '';
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

    // Obtener los parámetros enviados por el frontend
    $estado = $_POST['estado'] ?? null;
    $empresa = $_POST['empresa'] ?? null;
    $empresaDestino = $_POST['empresaDestino'] ?? null;
    $fechaInicio = $_POST['fechaInicio'] ?? null;
    $fechaFin = $_POST['fechaFin'] ?? null;
    $nroRemito = $_POST['nroRemito'] ?? null;
    $nroFactura = $_POST['nroFactura'] ?? null;
    //$debe = $_POST['debe'] ?? null; 

    // Construir la consulta SQL con filtros opcionales
    $query = "SELECT id,
                fechaCreacion,
                empresa,
                empresa_destino,
                CONCAT('$', FORMAT(valor_total, 2, 'de_DE')) AS valor_total,
                email,
                archivos,
                facturas,
                DATE_FORMAT(fechaEnvio, '%d-%m-%Y') AS fechaEnvio,
                estado,
                nroRemito,
                debe,
                DATE_FORMAT(fechaFacturado, '%d-%m-%Y') AS fechaFacturado,
                nroFactura,
                DATE_FORMAT(fechaRemito, '%d-%m-%Y') AS fechaRemito
          FROM remito 
          WHERE 1=1 $empresaFiltro 
          ";

    $params = [];


    if (!empty($empresa)) {
        $query .= " AND LOWER(empresa) = :empresa";
        $params[':empresa'] = strtolower($empresa);
    }

    if (!empty($empresaDestino)) {
        $query .= " AND LOWER(empresa_destino) = :empresaDestino";
        $params[':empresaDestino'] = strtolower($empresaDestino);
    }




    if (!empty($estado)) {
        if (strtolower($estado) === 'facturado') {
            if (!empty($fechaInicio) && !empty($fechaFin)) {
                $query .= " AND fechaFacturado BETWEEN :fechaInicio AND :fechaFin";
                $params[':fechaInicio'] = $fechaInicio;
                $params[':fechaFin'] = $fechaFin;
            } elseif (!empty($fechaInicio)) {
                $query .= " AND fechaFacturado >= :fechaInicio";
                $params[':fechaInicio'] = $fechaInicio;
            } elseif (!empty($fechaFin)) {
                $query .= " AND fechaFacturado <= :fechaFin";
                $params[':fechaFin'] = $fechaFin;
            }
        } else {

            if ($empresaFiltro === "TRANSPETRONE") {
                if (!empty($fechaInicio) && !empty($fechaFin)) {
                    $query .= " AND fechaRemito BETWEEN :fechaInicio AND :fechaFin";
                    $params[':fechaInicio'] = $fechaInicio;
                    $params[':fechaFin'] = $fechaFin;
                } elseif (!empty($fechaInicio)) {
                    $query .= " AND fechaRemito >= :fechaInicio";
                    $params[':fechaInicio'] = $fechaInicio;
                } elseif (!empty($fechaFin)) {
                    $query .= " AND fechaRemito <= :fechaFin";
                    $params[':fechaFin'] = $fechaFin;
                }
            } else {
                if (!empty($fechaInicio) && !empty($fechaFin)) {
                    $query .= " AND fechaCreacion BETWEEN :fechaInicio AND :fechaFin";
                    $params[':fechaInicio'] = $fechaInicio;
                    $params[':fechaFin'] = $fechaFin;
                } elseif (!empty($fechaInicio)) {
                    $query .= " AND fechaCreacion >= :fechaInicio";
                    $params[':fechaInicio'] = $fechaInicio;
                } elseif (!empty($fechaFin)) {
                    $query .= " AND fechaCreacion <= :fechaFin";
                    $params[':fechaFin'] = $fechaFin;
                }
            }
        }
    }


    if (!empty($nroRemito)) {
        $query .= " AND nroRemito LIKE :nroRemito";
        $params[':nroRemito'] = '%' . $nroRemito . '%';
    }

    if (!empty($nroFactura)) {
        $query .= " AND nroFactura LIKE :nroFactura";
        $params[':nroFactura'] = '%' . $nroFactura . '%';
    }
    /* // Valores válidos para 'debe'
    $valoresDebeValidos = ['pesada', 'ordenDeCompra', '', 'listo', 'certificado', 'remito'];

     if ($debe !== null && in_array($debe, $valoresDebeValidos, true)) {
         $query .= " AND debe = :debe";
         $params[':debe'] = $debe;
     }
 */
    if (!empty($estado)) {
        if (strtolower($estado) === 'pendiente') {
            $query .= " AND estado IN ('PendienteSinEnviar', 'PendientePorFacturar')";
        } else {
            $query .= " AND LOWER(estado) = :estado";
            $params[':estado'] = strtolower($estado);
        }
    } else {
        // Si no se filtró por estado, mostrar todos los estados posibles
        $query .= " AND estado IN ('PendienteSinEnviar', 'PendientePorFacturar', 'Facturado', 'Pagado')";
    }

    if ($estado === 'facturado' || $estado === 'pagado') {
        $query .= " ORDER BY nroFactura DESC LIMIT :limit OFFSET :offset";
    } else {
        $query .= " ORDER BY fechaCreacion DESC LIMIT :limit OFFSET :offset";
    }

    $stmt = $base_de_datos->prepare($query);
    foreach ($params as $key => &$value) {
        $stmt->bindParam($key, $value);
    }
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Obtener el total de registros sin paginar y la suma del valor_total
    $countQuery = "SELECT COUNT(*) as total, SUM(valor_total) as total_valor 
                   FROM remito WHERE 1=1 $empresaFiltro";

    /*if (!empty($estado)) {
        $countQuery .= " AND LOWER(estado) = :estado";
    }*/
    if (!empty($empresa)) {
        $countQuery .= " AND LOWER(empresa) = :empresa";
    }
    /* if ($debe !== null && in_array($debe, $valoresDebeValidos, true)) {
         $countQuery .= " AND debe = :debe";
     }
 */

    if (!empty($empresaDestino)) {
        $countQuery .= " AND LOWER(empresa_destino) = :empresaDestino";
    }

    if (!empty($estado)) {
        if ($estado === 'facturado') {
            if (!empty($fechaInicio) && !empty($fechaFin)) {
                $countQuery .= " AND fechaFacturado BETWEEN :fechaInicio AND :fechaFin";
            } elseif (!empty($fechaInicio)) {
                $countQuery .= " AND fechaFacturado >= :fechaInicio";
            } elseif (!empty($fechaFin)) {
                $countQuery .= " AND fechaFacturado <= :fechaFin";
            }

        } else {
            if (!empty($fechaInicio) && !empty($fechaFin)) {
                $countQuery .= " AND fechaCreacion BETWEEN :fechaInicio AND :fechaFin";
            } elseif (!empty($fechaInicio)) {
                $countQuery .= " AND fechaCreacion >= :fechaInicio";
            } elseif (!empty($fechaFin)) {
                $countQuery .= " AND fechaCreacion <= :fechaFin";
            }
        }
    }


    if (!empty($nroRemito)) {
        $countQuery .= " AND nroRemito LIKE :nroRemito";
    }
    if (!empty($nroFactura)) {
        $countQuery .= " AND nroFactura LIKE :nroFactura";
    }
    if (!empty($estado)) {
        if (strtolower($estado) === 'pendiente') {
            $countQuery .= " AND estado IN ('PendienteSinEnviar', 'PendientePorFacturar')";
        } else {
            $countQuery .= " AND LOWER(estado) = :estado";
        }
    } else {
        $countQuery .= " AND estado IN ('PendienteSinEnviar', 'PendientePorFacturar', 'Facturado', 'Pagado')";
    }

    $countStmt = $base_de_datos->prepare($countQuery);
    foreach ($params as $key => &$value) {
        $countStmt->bindParam($key, $value);
    }
    $countStmt->execute();
    $result = $countStmt->fetch(PDO::FETCH_ASSOC);

    $totalCount = $result['total'];
    $totalValor = $result['total_valor'] ?? 0; // Si no hay valores, devuelve 0
    $totalPages = ceil($totalCount / $limit);

    // Consulta para obtener la deuda filtrada por usuario
    $deudaQuery = "SELECT SUM(valor_total) as total_deuda 
                   FROM remito WHERE estado IN ('PendientePorFacturar', 'PendienteSinEnviar','Pagado') $empresaFiltro";
    $deudaStmt = $base_de_datos->query($deudaQuery);
    $deudaResult = $deudaStmt->fetch(PDO::FETCH_ASSOC);
    $totalDeuda = $deudaResult['total_deuda'] ?? 0;

    error_log("Resultado SQL (remitos): " . print_r($remitos, true));

    echo json_encode([
        'success' => true,
        'data' => $remitos,
        'totalPages' => $totalPages,
        'currentPage' => $page,
        'totalValor' => number_format($totalValor, 2, '.', ''),
        'totalDeuda' => number_format($totalDeuda, 2, '.', ''),
        'user' => $usuario
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los remitos: ' . $e->getMessage()
    ]);
}


