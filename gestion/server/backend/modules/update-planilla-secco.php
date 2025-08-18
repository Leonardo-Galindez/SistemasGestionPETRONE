<?php
require_once '../../conected-bd.php';

header('Content-Type: application/json');

try {
    // Obtener los datos enviados desde el frontend
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input)) {
        error_log('No se recibieron datos desde el frontend.');
        echo json_encode(['success' => false, 'message' => 'No se recibieron datos.']);
        exit;
    }

    // Log para verificar los datos recibidos
    error_log('Datos recibidos desde el frontend: ' . print_r($input, true));

    // Iniciar una transacción para garantizar integridad de datos
    $base_de_datos->beginTransaction();

    // Eliminar todas las filas antes de insertar las nuevas
    $deleteQuery = "DELETE FROM secco";
    $base_de_datos->exec($deleteQuery);
    error_log('Todas las filas eliminadas correctamente.');

    // Preparar la consulta para insertar cada fila
    $insertQuery = "INSERT INTO secco (
        Fecha, Remito, detalle, subtotal, km, precio, Total, observaciones
    ) VALUES (
        :Fecha, :Remito, :detalle, :subtotal, :km, :precio, :Total, :observaciones
    )";

    $stmt = $base_de_datos->prepare($insertQuery);

    $filasAfectadas = 0;

    // Remover la última fila del array
    array_pop($input);

    foreach ($input as $fila) {
        // Convertir los valores numéricos correctamente
        $total = str_replace(['.', ','], ['', '.'], $fila['Total'] ?? '0');
        $subtotal = str_replace(['.', ','], ['', '.'], $fila['subtotal'] ?? '0');
        $precio = str_replace(['.', ','], ['', '.'], $fila['precio'] ?? '0');

        $fecha = DateTime::createFromFormat('d/m/Y', $fila['Fecha']);
        $fecha = $fecha ? $fecha->format('Y-m-d') : null;

        $mappedData = [
            ':Fecha' => $fecha,  // Conversión aplicada aquí
            ':Remito' => $fila['Remito'] ?? '',
            ':detalle' => $fila['detalle'] ?? '',
            ':subtotal' => is_numeric($subtotal) ? $subtotal : 0,
            ':km' => $fila['km'] ?? 0,
            ':precio' => is_numeric($precio) ? $precio : 0,
            ':Total' => is_numeric($total) ? $total : 0,
            ':observaciones' => $fila['observaciones'] ?? '',
        ];


        // Log para verificar los valores antes de insertarlos
        error_log('Valores convertidos a insertar: ' . print_r($mappedData, true));

        if ($stmt->execute($mappedData)) {
            $filasAfectadas += $stmt->rowCount();
            error_log('Fila insertada correctamente.');
        } else {
            error_log('Error al ejecutar la consulta: ' . implode(', ', $stmt->errorInfo()));
        }
    }



    // Confirmar la transacción
    $base_de_datos->commit();

    // Responder al cliente con información sobre las filas afectadas
    echo json_encode([
        'success' => true,
        'message' => 'Datos guardados correctamente.',
        'filasAfectadas' => $filasAfectadas
    ]);
} catch (PDOException $e) {
    // Revertir la transacción en caso de error
    $base_de_datos->rollBack();

    error_log('Error al guardar los datos: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar los datos: ' . $e->getMessage()
    ]);
}

