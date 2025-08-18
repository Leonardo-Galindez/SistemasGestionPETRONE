<?php
require_once '../../conected-bd.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // Consulta para obtener los correos electrónicos únicos
    $query = "SELECT DISTINCT email
              FROM remito
              WHERE email IS NOT NULL AND email != ''
              GROUP BY email";
    $stmt = $base_de_datos->query($query);

    // Obtener todos los registros
    $emails = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'success' => true,
        'emails' => $emails, // Cambiado 'data' a 'emails'
    ]);
} catch (PDOException $e) {
    // Registrar el error en los logs del servidor y devolver un mensaje al cliente
    error_log('Error al obtener correos electrónicos: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener correos electrónicos: ' . $e->getMessage(),
    ]);
}
exit;

