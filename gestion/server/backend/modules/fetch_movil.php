<?php
require_once '../../conected-bd.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

try {
  // Parámetros
  $empresa = isset($_GET['empresa']) && $_GET['empresa'] !== '' ? trim($_GET['empresa']) : null;
  $cliente = isset($_GET['cliente']) && $_GET['cliente'] !== '' ? trim($_GET['cliente']) : null;
  $estado  = isset($_GET['estado'])  && $_GET['estado']  !== '' ? trim($_GET['estado'])  : null; // "", Pendiente, PendienteSinEnviar, PendientePorFacturar, Facturado
  $desde   = isset($_GET['desde'])   && $_GET['desde']   !== '' ? trim($_GET['desde'])   : null;
  $hasta   = isset($_GET['hasta'])   && $_GET['hasta']   !== '' ? trim($_GET['hasta'])   : null;

  $estadoLower = $estado ? strtolower($estado) : null;

  // === CONDICIONES ===
  // Pendiente estrictamente = solo estos dos valores de estado:
  $COND_PENDIENTE_STRICT = "LOWER(estado) IN ('pendientesinenviar','pendienteporfacturar')";
  // Facturado: dejamos la definición por estado (ajústala si lo deseas más estricta o la tienes normalizada)
  $COND_FACTURADO = "LOWER(estado) LIKE 'facturad%'";

  // WHERE base
  $whereBase = " WHERE 1=1 ";
  $params = [];
  if ($empresa) { $whereBase .= " AND empresa = :empresa "; $params[':empresa'] = $empresa; }
  if ($cliente) { $whereBase .= " AND empresa_destino = :cliente "; $params[':cliente'] = $cliente; }

  // Fechas
  $d1 = $desde ? $desde . " 00:00:00" : null;
  $d2 = $hasta ? $hasta . " 23:59:59" : null;

  // ===== KPIs =====
  // Pendientes → fechaRemito
  $wherePend = $whereBase . " AND $COND_PENDIENTE_STRICT ";
  $pPend = $params;
  if ($d1) { $wherePend .= " AND fechaRemito >= :p_d1 "; $pPend[':p_d1'] = $d1; }
  if ($d2) { $wherePend .= " AND fechaRemito <= :p_d2 "; $pPend[':p_d2'] = $d2; }
  $sqlPend = "SELECT COUNT(*) AS cant, SUM(COALESCE(valor_total,0)) AS total FROM remito $wherePend";
  $stmt = $base_de_datos->prepare($sqlPend);
  $stmt->execute($pPend);
  $kpiPend = $stmt->fetch(PDO::FETCH_ASSOC) ?: ['cant'=>0,'total'=>0];

  // Facturados → fechaFacturado
  $whereFact = $whereBase . " AND $COND_FACTURADO ";
  $pFact = $params;
  if ($d1) { $whereFact .= " AND fechaFacturado >= :f_d1 "; $pFact[':f_d1'] = $d1; }
  if ($d2) { $whereFact .= " AND fechaFacturado <= :f_d2 "; $pFact[':f_d2'] = $d2; }
  $sqlFact = "SELECT COUNT(*) AS cant, SUM(COALESCE(valor_total,0)) AS total FROM remito $whereFact";
  $stmt = $base_de_datos->prepare($sqlFact);
  $stmt->execute($pFact);
  $kpiFact = $stmt->fetch(PDO::FETCH_ASSOC) ?: ['cant'=>0,'total'=>0];

  // ===== TABLA AGRUPADA =====
  $whereTabla = $whereBase;
  $tablaParams = $params;

  if ($estadoLower === 'pendiente') {
    // Pendiente = SOLO los dos sub-estados
    $whereTabla .= " AND $COND_PENDIENTE_STRICT ";
    if ($d1) { $whereTabla .= " AND fechaRemito >= :t_d1 "; $tablaParams[':t_d1'] = $d1; }
    if ($d2) { $whereTabla .= " AND fechaRemito <= :t_d2 "; $tablaParams[':t_d2'] = $d2; }

  } elseif ($estadoLower === 'facturado') {
    $whereTabla .= " AND $COND_FACTURADO ";
    if ($d1) { $whereTabla .= " AND fechaFacturado >= :t_d1 "; $tablaParams[':t_d1'] = $d1; }
    if ($d2) { $whereTabla .= " AND fechaFacturado <= :t_d2 "; $tablaParams[':t_d2'] = $d2; }

  } elseif (in_array($estadoLower, ['pendientesinenviar','pendienteporfacturar'], true)) {
    // Sub-estado puntual
    $whereTabla .= " AND LOWER(estado) = :t_sub ";
    $tablaParams[':t_sub'] = $estadoLower;
    if ($d1) { $whereTabla .= " AND fechaRemito >= :t_d1 "; $tablaParams[':t_d1'] = $d1; }
    if ($d2) { $whereTabla .= " AND fechaRemito <= :t_d2 "; $tablaParams[':t_d2'] = $d2; }

  } else {
    // Estado vacío (Todos): combinar por fechas con OR entre pendientes estrictos y facturados
    if ($d1 || $d2) {
      if ($d1 && $d2) {
        $whereTabla .= " AND ( ($COND_PENDIENTE_STRICT AND fechaRemito BETWEEN :td1 AND :td2)
                               OR ($COND_FACTURADO      AND fechaFacturado BETWEEN :td1 AND :td2) )";
        $tablaParams[':td1'] = $d1; $tablaParams[':td2'] = $d2;
      } elseif ($d1) {
        $whereTabla .= " AND ( ($COND_PENDIENTE_STRICT AND fechaRemito    >= :td1)
                               OR ($COND_FACTURADO      AND fechaFacturado >= :td1) )";
        $tablaParams[':td1'] = $d1;
      } elseif ($d2) {
        $whereTabla .= " AND ( ($COND_PENDIENTE_STRICT AND fechaRemito    <= :td2)
                               OR ($COND_FACTURADO      AND fechaFacturado <= :td2) )";
        $tablaParams[':td2'] = $d2;
      }
    }
  }

  $sqlTbl = "SELECT empresa, empresa_destino, SUM(COALESCE(valor_total,0)) AS valor_total
             FROM remito
             $whereTabla
             GROUP BY empresa, empresa_destino
             ORDER BY empresa ASC, empresa_destino ASC";
  $stmt = $base_de_datos->prepare($sqlTbl);
  $stmt->execute($tablaParams);
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Clientes dependientes
  $whereClientes = " WHERE 1=1 ";
  $pCli = [];
  if ($empresa) { $whereClientes .= " AND empresa = :empresa "; $pCli[':empresa'] = $empresa; }
  $sqlCli = "SELECT DISTINCT empresa_destino FROM remito $whereClientes ORDER BY empresa_destino";
  $stmt = $base_de_datos->prepare($sqlCli);
  $stmt->execute($pCli);
  $clientes = array_values(array_map(fn($r)=>$r['empresa_destino'], $stmt->fetchAll(PDO::FETCH_ASSOC)));

  echo json_encode([
    'success' => true,
    'kpis' => [
      'pendientes' => ['cantidad'=>(int)$kpiPend['cant'], 'total'=>(float)($kpiPend['total'] ?? 0)],
      'facturados' => ['cantidad'=>(int)$kpiFact['cant'], 'total'=>(float)($kpiFact['total'] ?? 0)]
    ],
    'clientes' => $clientes,
    'data' => $rows
  ], JSON_UNESCAPED_UNICODE);
  exit;

} catch (Throwable $e) {
  error_log('[fetch_movil] '.$e->getMessage());
  http_response_code(500);
  echo json_encode(['success'=>false,'error'=>'Error del servidor.']);
  exit;
}
