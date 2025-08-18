<?php

require_once '../conected-bd.php';

try {
    $id = $_GET['id'];

    // Recuperar la lista de archivos del remito antes de eliminarlo
    $stmt = $base_de_datos->prepare("SELECT archivos FROM remito WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $remito = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($remito && $remito['archivos']) {
        // Decodificar los archivos
        $archivos = json_decode($remito['archivos'], true);

        // Ruta base correcta para eliminar
        $uploadsDir = __DIR__ . '/modules/';
        error_log("Ruta base definida: $uploadsDir");

        foreach ($archivos as $relativePath) {
            // Construir la ruta completa para el archivo
            $filePath = $uploadsDir . $relativePath;

            error_log("Intentando eliminar: $filePath");
            if (file_exists($filePath)) {
                if (unlink($filePath)) {
                    error_log("Archivo eliminado: $filePath");
                } else {
                    error_log("Error al intentar eliminar: $filePath");
                }
            } else {
                error_log("El archivo no existe: $filePath");
            }
        }
    } else {
        error_log("No se encontraron archivos asociados al remito ID: $id");
    }

    // Eliminar el remito de la base de datos
    $stmt = $base_de_datos->prepare("DELETE FROM remito WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => "Remito $id eliminado junto con sus archivos"]);
} catch (PDOException $e) {
    error_log("Error al eliminar remito: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error al eliminar remito: ' . $e->getMessage()]);
}
