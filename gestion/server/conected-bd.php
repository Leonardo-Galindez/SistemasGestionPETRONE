<?php
$host = "127.0.0.1";
$usuario = "admtpoilcom_admtpoilcom";
$contraseña = "Administracion-45*";
$nombre_base_de_datos = "admtpoilcom_admPetroneBD";

try {
    // Crear conexión con PDO
    $dsn = "mysql:host=$host;dbname=$nombre_base_de_datos;charset=utf8mb4";
    $base_de_datos = new PDO($dsn, $usuario, $contraseña, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'error' => "Error de conexión: " . $e->getMessage()]));
}
?>
