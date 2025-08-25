<?php
require_once '../../conected-bd.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

// Paginación
$page   = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit  = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 10;
$offset = ($page - 1) * $limit;

try {
    // ---- Usuario / empresa desde sesión ----
    $tipoUsuarioRaw = $_SESSION['usuario']['tipo_usuario'] ?? '';
    $tipoUsuario    = strtolower(trim((string)$tipoUsuarioRaw));
    // Si es uno de los usuarios-empresa, guardamos la empresa en mayúsculas
    $empresaDelUsuario = in_array($tipoUsuario, ['nemer', 'abasto', 'transpetrone'], true)
        ? strtoupper($tipoUsuario)
        : '';

    // ---- Filtros recibidos desde el frontend ----
    $estado         = $_POST['estado'] ?? null;
    $estadoLc       = strtolower(trim((string)$estado));
    $empresa        = $_POST['empresa'] ?? null;
    $empresaDestino = $_POST['empresaDestino'] ?? null;
    $fechaInicio    = $_POST['fechaInicio'] ?? null;
    $fechaFin       = $_POST['fechaFin'] ?? null;
    $nroRemito      = $_POST['nroRemito'] ?? null;
    $nroFactura     = $_POST['nroFactura'] ?? null;
    // $debe = $_POST['debe'] ?? null; // si más adelante lo reactivas

    // ---- Construcción de WHERE unificado ----
    $where  = ['1=1'];
    $params = [];

    // Filtro por empresa del usuario (si corresponde)
    if ($empresaDelUsuario !== '') {
        $where[] = 'empresa = :empresaUsuario';
        $params[':empresaUsuario'] = $empresaDelUsuario;
    }

    // Filtros explícitos del formulario
    if (!empty($empresa)) {
        $where[] = 'LOWER(empresa) = :empresa';
        $params[':empresa'] = strtolower($empresa);
    }

    if (!empty($empresaDestino)) {
        $where[] = 'LOWER(empresa_destino) = :empresaDestino';
        $params[':empresaDestino'] = strtolower($empresaDestino);
    }

    // Filtro por estado
    if ($estadoLc !== '') {
        if ($estadoLc === 'pendiente') {
            $where[] = "estado IN ('PendienteSinEnviar', 'PendientePorFacturar')";
        } else {
            $where[] = 'LOWER(estado) = :estado';
            $params[':estado'] = $estadoLc;
        }
    } else {
        // Por defecto muestra todos
        $where[] = "estado IN ('PendienteSinEnviar', 'PendientePorFacturar', 'Facturado', 'Pagado')";
    }

    // ---- Selección del campo de fecha a filtrar ----
    // criterio:
    // - si facturado -> filtra por fechaFacturado
    // - si el usuario es empresa (nemer/abasto/transpetrone) -> por fechaRemito
    // - en otro caso -> por fechaCreacion
    if ($estadoLc === 'facturado') {
        $dateField = 'fechaFacturado';
    } elseif ($empresaDelUsuario !== '') {
        $dateField = 'fechaRemito';
    } else {
        $dateField = 'fechaCreacion';
    }

    // Filtro por fechas (si vienen)
    if (!empty($fechaInicio) && !empty($fechaFin)) {
        $where[] = "$dateField BETWEEN :fechaInicio AND :fechaFin";
        $params[':fechaInicio'] = $fechaInicio;
        $params[':fechaFin']    = $fechaFin;
    } elseif (!empty($fechaInicio)) {
        $where[] = "$dateField >= :fechaInicio";
        $params[':fechaInicio'] = $fechaInicio;
    } elseif (!empty($fechaFin)) {
        $where[] = "$dateField <= :fechaFin";
        $params[':fechaFin'] = $fechaFin;
    }

    // Filtros por nroRemito / nroFactura
    if (!empty($nroRemito)) {
        $where[] = 'nroRemito LIKE :nroRemito';
        $params[':nroRemito'] = '%' . $nroRemito . '%';
    }
    if (!empty($nroFactura)) {
        $where[] = 'nroFactura LIKE :nroFactura';
        $params[':nroFactura'] = '%' . $nroFactura . '%';
    }

    $whereSql = implode(' AND ', $where);

    // ---- Orden ----
    // Si es facturado o pagado, ordena por nroFactura desc; en otros casos, por la fecha elegida desc
    $orderBy = in_array($estadoLc, ['facturado', 'pagado'], true)
        ? 'nroFactura DESC'
        : "$dateField DESC";

    // ---- Consulta principal paginada ----
    $selectSql = "
        SELECT
            id,
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
            DATE_FORMAT(fechaRemito, '%d-%m-%Y') AS fechaRemito,
            dominio
        FROM remito
        WHERE $whereSql
        ORDER BY $orderBy
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $base_de_datos->prepare($selectSql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':limit',  (int)$limit,  PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
    $stmt->execute();

    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ---- Totales (COUNT y SUM) con el MISMO WHERE ----
    $countSql = "
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(valor_total), 0) AS total_valor
        FROM remito
        WHERE $whereSql
    ";
    $countStmt = $base_de_datos->prepare($countSql);
    foreach ($params as $k => $v) {
        $countStmt->bindValue($k, $v);
    }
    $countStmt->execute();
    $meta = $countStmt->fetch(PDO::FETCH_ASSOC);

    $totalCount = (int)($meta['total'] ?? 0);
    $totalValor = (float)($meta['total_valor'] ?? 0.0);
    $totalPages = (int)ceil($totalCount / $limit);

    // ---- Deuda (mantengo tu criterio original: incluye Pagado) ----
    // Se calcula sujeto a la empresa del usuario y, si enviaste filtros de empresa/empresa_destino, se respetan.
    $deudaWhere  = ['1=1', "estado IN ('PendientePorFacturar','PendienteSinEnviar','Pagado')"];
    $deudaParams = [];

    if ($empresaDelUsuario !== '') {
        $deudaWhere[] = 'empresa = :empresaUsuario';
        $deudaParams[':empresaUsuario'] = $empresaDelUsuario;
    }
    if (!empty($empresa)) {
        $deudaWhere[] = 'LOWER(empresa) = :empresa';
        $deudaParams[':empresa'] = strtolower($empresa);
    }
    if (!empty($empresaDestino)) {
        $deudaWhere[] = 'LOWER(empresa_destino) = :empresaDestino';
        $deudaParams[':empresaDestino'] = strtolower($empresaDestino);
    }

    $deudaSql = "
        SELECT COALESCE(SUM(valor_total), 0) AS total_deuda
        FROM remito
        WHERE " . implode(' AND ', $deudaWhere);

    $deudaStmt = $base_de_datos->prepare($deudaSql);
    foreach ($deudaParams as $k => $v) {
        $deudaStmt->bindValue($k, $v);
    }
    $deudaStmt->execute();
    $totalDeuda = (float)$deudaStmt->fetchColumn();

    // ---- Respuesta ----
    echo json_encode([
        'success'     => true,
        'data'        => $remitos,
        'totalPages'  => $totalPages,
        'currentPage' => $page,
        'totalValor'  => number_format($totalValor, 2, '.', ''),
        'totalDeuda'  => number_format($totalDeuda, 2, '.', ''),
        'user'        => $tipoUsuarioRaw
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los remitos: ' . $e->getMessage()
    ]);
}
