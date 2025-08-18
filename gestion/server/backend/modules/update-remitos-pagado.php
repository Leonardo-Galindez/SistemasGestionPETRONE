<?php
header('Content-Type: application/json');
require_once '../../conected-bd.php'; // Incluye la conexión a la base de datos

// Verifica que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

// Captura y decodifica el JSON recibido
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['remitos']) || !is_array($data['remitos'])) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

$remitos = $data['remitos'];

try {
    // Usa la conexión ya creada en `conected-bd.php`
    $query = "UPDATE remito 
          SET estado = 'Pagado', 
              fechaPagado = NOW() 
          WHERE id IN (" . implode(',', array_map('intval', $remitos)) . ")";
    $stmt = $base_de_datos->prepare($query);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Remitos facturados correctamente']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>