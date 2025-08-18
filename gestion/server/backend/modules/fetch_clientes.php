<?php
require_once '../../conected-bd.php';
session_start();
try {

    // Obtener el rol del usuario logueado
    $usuario = $_SESSION['usuario']['tipo_usuario']; // Asumiendo que el usuario se almacena en la sesión
    $empresaFiltro = "";

    if ($usuario) {
        switch ($usuario) {
            case 'transpetrone':
                $empresaFiltro = " AND empresa = 'TRANSPETRONE'";
                break;
            default:
                $empresaFiltro = " AND empresa = 'TPOIL'";
                break;
        }
    }
    // Consulta para obtener las empresas únicas (sin valores nulos)
    $query = "SELECT empresa_destino
        FROM remito
        WHERE empresa_destino IS NOT NULL $empresaFiltro
        GROUP BY empresa_destino
    ";
    $stmt = $base_de_datos->query($query);

    // Obtener todos los registros
    $empresas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($empresas)) {
        echo json_encode(['success' => true, 'data' => [], 'message' => 'No hay empresas disponibles.']);
    } else {
        echo json_encode(['success' => true, 'data' => $empresas]);
    }

} catch (PDOException $e) {
    // Registrar el error en los logs del servidor y devolver un mensaje al cliente
    error_log('Error al obtener empresas: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error al obtener empresas: ' . $e->getMessage()]);
}
exit;