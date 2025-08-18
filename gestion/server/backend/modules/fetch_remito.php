<?php
require_once '../../conected-bd.php';

header('Content-Type: application/json');

try {
    // Verificar si se recibió el nroRemito
    $nroRemito = $_GET['nroRemito'] ?? null;
    $empresa = $_GET['empresa'] ?? null;

    if (empty($nroRemito)) {
        echo json_encode(['success' => false, 'error' => 'Número de remito no proporcionado']);
        exit;
    }

    // Consultar la base de datos para verificar si el número de remito existe
    $query = "SELECT id, nroRemito 
              FROM remito 
              WHERE nroRemito = :nroRemito AND empresa = :empresa
              LIMIT 1";

    $stmt = $base_de_datos->prepare($query);
    $stmt->execute([':nroRemito' => $nroRemito]);

    $remito = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$remito) {
        // Si no existe
        echo json_encode(['success' => true, 'exists' => false]);
        exit;
    }

    // Si existe
    echo json_encode(['success' => true, 'exists' => true, 'remito' => $remito]);

} catch (PDOException $e) {
    // Manejar errores de la base de datos
    echo json_encode(['success' => false, 'error' => 'Error al verificar remito: ' . $e->getMessage()]);
}
