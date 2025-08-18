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
    $deleteQuery = "DELETE FROM expro";
    $base_de_datos->exec($deleteQuery);
    error_log('Todas las filas eliminadas correctamente.');

    // Preparar la consulta para insertar cada fila
    $insertQuery = "INSERT INTO expro (
        numero_tr, Fecha, numero_remito, patente, tipo_unidad, dni_chofer, origen,destino,operador_a,centro_costo,service_line,resumen_servicio,km_recorridos,horas_servicio,costo_transporte,servicios_adicionales,costo_km_adic,costo_horas_espera,costo_total
    ) VALUES (
        :numero_tr, :Fecha, :numero_remito, :patente, :tipo_unidad, :dni_chofer, :origen, :destino, :operador_a, :centro_costo, :service_line, :resumen_servicio, :km_recorridos, :horas_servicio, :costo_transporte, :servicios_adicionales, :costo_km_adic, :costo_horas_espera, :costo_total
    )";

    $stmt = $base_de_datos->prepare($insertQuery);

    $filasAfectadas = 0;

    // Remover la última fila del array
    array_pop($input);

    foreach ($input as $fila) {
        // Convertir los valores numéricos correctamente
        $costo_transporte = str_replace(['.', ','], ['', '.'], $fila['costo_transporte'] ?? '0');
        $costo_km_adic = str_replace(['.', ','], ['', '.'], $fila['costo_km_adic'] ?? '0');
        $costo_horas_espera = str_replace(['.', ','], ['', '.'], $fila['costo_horas_espera'] ?? '0');
        $costo_total = str_replace(['.', ','], ['', '.'], $fila['costo_total'] ?? '0');


        $fecha = DateTime::createFromFormat('d/m/Y', $fila['Fecha']);
        $fecha = $fecha ? $fecha->format('Y-m-d') : null;

        $mappedData = [
            ':numero_tr' => $fila['numero_tr'] ?? '',
            ':Fecha' => $fecha,  // Conversión aplicada aquí
            ':numero_remito' => $fila['numero_remito'] ?? '',
            ':patente' => $fila['patente'] ?? '',
            ':tipo_unidad' => $fila['tipo_unidad'] ?? '',
            ':dni_chofer' => $fila['dni_chofer'] ?? '',
            ':origen' => $fila['origen'] ?? '',
            ':destino' => $fila['destino'] ?? '',
            ':operador_a' => $fila['operador_a'] ?? '',
            ':centro_costo' => $fila['centro_costo'] ?? '',
            ':service_line' => $fila['service_line'] ?? '',
            ':resumen_servicio' => $fila['resumen_servicio'] ?? '',
            ':km_recorridos' => $fila['km_recorridos'] ?? '',
            ':horas_servicio' => $fila['horas_servicio'] ?? '',
            ':costo_transporte' => $costo_transporte,
            ':servicios_adicionales' => $fila['servicios_adicionales'] ?? '',
            ':costo_km_adic' => $costo_km_adic,
            ':costo_horas_espera' => $costo_horas_espera,
            ':costo_total' => is_numeric($costo_total) ? $costo_total : 0,
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

