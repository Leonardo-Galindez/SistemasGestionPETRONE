<?php
require_once '../../conected-bd.php';
session_start();
header('Content-Type: application/json');

// Log para ver si la sesión está bien
error_log("Sesión iniciada: " . print_r($_SESSION, true));

if (!isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['tipo_usuario'])) {
    error_log("Error: Usuario no autenticado");
    echo json_encode(["success" => false, "message" => "Usuario no autenticado"]);
    exit;
}

try {
    // Obtener el tipo de usuario directamente de la sesión
    $tipo_usuario = $_SESSION['usuario']['tipo_usuario'];
    error_log("Tipo de usuario encontrado en sesión: " . $tipo_usuario);

    echo json_encode(["success" => true, "tipo_usuario" => $tipo_usuario]);

} catch (Exception $e) {
    error_log("Error inesperado: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error en el servidor: " . $e->getMessage()]);
}
exit;


