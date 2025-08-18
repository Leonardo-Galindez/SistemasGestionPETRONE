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
    $deleteQuery = "DELETE FROM sullair";
    $base_de_datos->exec($deleteQuery);
    error_log('Todas las filas eliminadas correctamente.');

    // Preparar la consulta para insertar cada fila
    $insertQuery = "INSERT INTO sullair (
        Fecha, cliente, remitoSullair, viaje_numero, maquinaTransportada, interno, desde,hasta,desde_1,hasta_1,hsStandBy,hsDeHidro,km,vehiculo,costo,contrato
    ) VALUES (
        :Fecha, :cliente,:remitoSullair, :viaje_numero, :maquinaTransportada, :interno, :desde, :hasta, :desde_1, :hasta_1, :hsStandBy, :hsDeHidro, :km, :vehiculo, :costo, :contrato
    )";

    $stmt = $base_de_datos->prepare($insertQuery);

    $filasAfectadas = 0;

    // Remover la última fila del array
    array_pop($input);

    foreach ($input as $fila) {
        // Convertir los valores numéricos correctamente
        $costo = str_replace(['.', ','], ['', '.'], $fila['costo'] ?? '0');
    
        $fecha = DateTime::createFromFormat('d/m/Y', $fila['Fecha']);
        $fecha = $fecha ? $fecha->format('Y-m-d') : null;

        $mappedData = [
            ':Fecha' => $fecha,  // Conversión aplicada aquí
            ':cliente' => $fila['cliente'] ?? '',
            ':remitoSullair' => $fila['remitoSullair'] ?? '',
            ':viaje_numero' => $fila['viaje_numero'] ?? '',
            ':maquinaTransportada' => $fila['maquinaTransportada'] ?? '',
            ':interno' => $fila['interno'] ?? '',
            ':desde' => $fila['desde'] ?? '',
            ':hasta' => $fila['hasta'] ?? '',
            ':desde_1' => $fila['desde_1'] ?? '',
            ':hasta_1' => $fila['hasta_1'] ?? '',
            ':hsStandBy' => $fila['hsStandBy'] ?? '',
            ':hsDeHidro' => $fila['hsDeHidro'] ?? '',
            ':km' => $fila['km'] ?? '',
            ':vehiculo' => $fila['vehiculo'] ?? '',
            ':costo' => is_numeric($costo) ? $costo : 0,
            ':contrato' => $fila['contrato'] ?? '',
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

