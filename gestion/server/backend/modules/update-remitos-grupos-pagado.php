<?php


require '../../../lib/vendor/autoload.php';
require_once '../../conected-bd.php';

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start(); // Iniciar sesión para obtener el usuario logueado

try {

    $idRemitos = $_POST['nro_remitoSeleccionar'] ?? null;
    $empresa = $_POST['empresaSeleccionar'] ?? null;
    $empresaDestino = $_POST['empresa_destinoSeleccionar'] ?? null;
    error_log("datos recibidos:" . $idRemitos . "," . $empresa . "," . $empresaDestino);
    $remitosIds = [];

    if (!empty($idRemitos)) {
        error_log("numeros:" . $idRemitos);
        $remitosIds = array_filter(array_map('trim', explode(';', $idRemitos)));
        error_log("numeros: " . print_r($remitosIds, true));

    }

    $conditions = [];
    $params = [];

    if (!empty($remitosIds)) {
        $quotedIds = array_map(function ($id) {
            return "'" . $id . "'";
        }, $remitosIds);

        $conditions[] = "nroRemito IN (" . implode(',', $quotedIds) . ")";
    }


    if (!empty($empresa)) {
        $conditions[] = "empresa = :empresa";
        $params[':empresa'] = $empresa;
    }

    if (!empty($empresaDestino)) {
        $conditions[] = "empresa_destino = :empresa_destino";
        $params[':empresa_destino'] = $empresaDestino;
    }

    $whereClause = '';
    if (!empty($conditions)) {
        $whereClause = 'WHERE ' . implode(' AND ', $conditions);
    }


    // Usa la conexión ya creada en `conected-bd.php`
    $query = "UPDATE remito 
    SET estado = 'Pagado', 
        fechaPagado = NOW() 
    $whereClause";

    error_log("Consulta SQL: $query");

    $stmt = $base_de_datos->prepare($query);
    $stmt->execute($params);


    echo json_encode(['success' => true, 'message' => 'Remitos facturados correctamente']);


} catch (PDOException $e) {
    error_log("Error de base de datos: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
