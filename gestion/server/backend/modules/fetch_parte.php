<?php
require_once '../../conected-bd.php';
session_start();
header('Content-Type: application/json');

try {
    $sql = "SELECT * FROM parte";
    $params = [];
    $condiciones = [];

    // Agregar filtro por fechas si existen
    if (isset($_GET['fechaInicio']) && isset($_GET['fechaFin'])) {
        $condiciones[] = "fecha BETWEEN :inicio AND :fin";
        $params[':inicio'] = $_GET['fechaInicio'];
        $params[':fin'] = $_GET['fechaFin'];
    }

    // Agregar filtro por supervisor si existe
    if (isset($_GET['supervisor']) && !empty($_GET['supervisor'])) {
        $condiciones[] = "supervisor = :supervisor";
        $params[':supervisor'] = $_GET['supervisor'];
    }

    // Unir condiciones con AND
    if (!empty($condiciones)) {
        $sql .= " WHERE " . implode(" AND ", $condiciones);
    }

    $stmt = $base_de_datos->prepare($sql);
    $stmt->execute($params);
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $resultados
    ]);

} catch (PDOException $e) {
    error_log("Error al consultar la base de datos: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error al consultar la base de datos: " . $e->getMessage()
    ]);
}
exit;
