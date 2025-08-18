<?php
require_once '../../conected-bd.php';
try {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
        exit;
    }

    // Obtener los datos del remito
    $stmt = $base_de_datos->prepare("SELECT archivos FROM remito WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $remito = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $base_de_datos->prepare("SELECT facturas FROM remito WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $factura = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$remito && !$factura) {
        echo json_encode(['success' => false, 'message' => 'Remito no encontrado']);
        exit;
    }
     // Decodificar los JSON almacenados en la base
    $remito['archivos'] = json_decode($remito['archivos'], true) ?: [];
    $factura['facturas'] = json_decode($factura['facturas'], true) ?: [];
    // Decodificar los archivos existentes (si los hay)
    echo json_encode([
    'success' => true,
    'remito' => $remito,
    'factura' => $factura
]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al obtener remito: ' . $e->getMessage()]);
}