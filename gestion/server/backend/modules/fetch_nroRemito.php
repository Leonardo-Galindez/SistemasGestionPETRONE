<?php
require_once '../../conected-bd.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

try {
    // Leer el contenido JSON enviado
    $input = json_decode(file_get_contents('php://input'), true);

    // Verificar que haya un arreglo de IDs
    if (!isset($input['ids']) || !is_array($input['ids']) || empty($input['ids'])) {
        throw new Exception('Se debe enviar un arreglo de IDs válido.');
    }

    // Crear placeholders dinámicos según la cantidad de IDs
    $placeholders = implode(',', array_fill(0, count($input['ids']), '?'));

    // Preparar consulta SQL
    $query = "SELECT id, nroRemito FROM remito WHERE id IN ($placeholders)";
    $stmt = $base_de_datos->prepare($query);
    $stmt->execute($input['ids']);

    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Extraer solo los nroRemito en un arreglo
    $nrosRemito = array_column($resultados, 'nroRemito');

    echo json_encode([
        'success' => true,
        'nroRemitos' => $nrosRemito
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
exit;



