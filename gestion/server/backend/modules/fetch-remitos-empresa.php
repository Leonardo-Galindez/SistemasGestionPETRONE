<?php
require_once '../../conected-bd.php';
session_start();
header('Content-Type: application/json');

try {
    // Obtener los datos del cuerpo de la solicitud
    $input = json_decode(file_get_contents('php://input'), true);

    // Log para verificar el contenido recibido desde el frontend
    error_log('Datos recibidos desde el frontend: ' . json_encode($input));

    $empresa_destino = $input['empresa_cliente'] ?? null;
    error_log('nombre empresa: ' . $empresa_destino);

    // Verificar si se proporcionó la empresa
    if (!$empresa_destino) {
        error_log('Error: No se proporcionó ninguna empresa.');
        echo json_encode(['success' => false, 'message' => 'No se proporcionó ninguna empresa.']);
        exit;
    }

    // Inicializar la consulta según la empresa
    $query = '';
    switch (strtoupper($empresa_destino)) {
        case 'SULLAIR':
            $query = "SELECT 
        DATE(r.fechaCreacion) AS fecha,
        COALESCE(s.cliente, 'SULLAIR ARG') AS cliente,
        r.nroRemito AS remitoSullair,
        COALESCE(s.viaje_numero, '') AS viajeNumero,
        COALESCE(s.maquina_transportada, '') AS maquinaTransportada,
        COALESCE(s.interno, '') AS interno,
        COALESCE(r.empresa, '') AS desde,
        COALESCE(s.hasta, 'BASE SULLAIR') AS hasta,
        COALESCE(s.desde_1, 'BASE SULLAIR') AS desde_1,
        COALESCE(s.hasta_1, 'BASE SULLAIR') AS hasta_1,
        COALESCE(s.hs_stand_by, '') AS hsStandBy,
        COALESCE(s.hs_de_hidro, '') AS hsDeHidro,
        COALESCE(s.kilometros, '') AS km,
        COALESCE(s.vehiculo, 'CAMILLA') AS vehiculo,
        r.valor_total AS costo,
        COALESCE(s.contrato, '') AS contrato,
        COALESCE(s.formula, '') AS formula -- Agregar el campo formula
    FROM 
        remito r
    LEFT JOIN 
        (SELECT DISTINCT 
             nroRemito, 
             cliente, 
             viaje_numero, 
             maquina_transportada, 
             interno, 
             hasta, 
             desde_1, 
             hasta_1, 
             hs_stand_by, 
             hs_de_hidro, 
             kilometros, 
             vehiculo, 
             contrato, 
             formula
         FROM sullair) s
    ON 
        r.nroRemito = s.nroRemito
    WHERE 
        r.empresa_destino = :empresa_cliente";
            break;

        case 'GO LOGISTISCA':
            $query = "SELECT  
                    DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,
                    COALESCE(r.nroRemito, '') AS remitoGo, -- Traer remitoGo de go
                    COALESCE(g.lavadoDePileta, '') AS lavadoDePileta, -- Traer detalle de go
                    COALESCE(r.dominio, '') AS division, -- Traer subtotal de go
                    COALESCE(g.op, '') AS op, -- Traer km de go
                    COALESCE(FORMAT(r.valor_total, 2, 'de_DE'), '0,00') AS total, -- Traer total de go
                    COALESCE(g.formulas, '') AS formulas -- Agregar el campo formulas
                FROM 
                    remito r
                LEFT JOIN 
                    (SELECT DISTINCT 
                         remitoGo, 
                         lavadoDePileta,  
                         op,
                         formulas
                     FROM go) g
                ON 
                    r.nroRemito = g.remitoGo
                WHERE 
                    r.empresa_destino = :empresa_cliente
                    AND r.estado IN ('pendientePorFacturar', 'pendienteSinEnviar') AND r.empresa = 'TPOIL'";
            break;
        case 'EXPRO':
            $query = "SELECT 
                    DATE(r.fechaCreacion) AS fecha, -- Fecha de creación del remito
                    COALESCE(e.nTr, '') AS nTr, -- Patente del vehículo
                    COALESCE(r.nroRemito, '') AS nroRemito, -- Número de remito en EXPRO
                    COALESCE(e.patente, '') AS patente, -- Patente del vehículo
                    COALESCE(e.tipoDeUnidad, 'ZAMPI') AS tipoDeUnidad, -- Tipo de unidad
                    COALESCE(e.dniChofer, '') AS dniChofer, -- DNI del chofer
                    COALESCE(e.origen, 'NEUQUEN') AS origen, -- Origen del servicio
                    COALESCE(e.destino, 'EXPRO') AS destino, -- Destino del servicio
                    COALESCE(e.operadora, 'EXPRO') AS operadora, -- Operadora encargada
                    COALESCE(e.centroDeCosto, '') AS centroDeCosto, -- Centro de costo
                    COALESCE(e.serviceLine, '') AS serviceLine, -- Línea de servicio
                    COALESCE(e.resumenDelServicio, '') AS resumenDelServicio, -- Resumen del servicio
                    COALESCE(e.kmRecorridos, 0) AS kmRecorridos, -- Kilómetros recorridos
                    COALESCE(e.horasDeServicio, 0) AS horasDeServicio, -- Horas de servicio
                    COALESCE(e.costoTransporte, 0) AS costoTransporte, -- Costo de transporte
                    COALESCE(e.serviciosAdicionales, '') AS serviciosAdicionales, -- Servicios adicionales
                    COALESCE(e.costoKmAdic, 0) AS costoKmAdic, -- Costo por kilómetro adicional
                    COALESCE(e.costoHorasDeEspera, 0) AS costoHorasDeEspera, -- Costo por horas de espera
                    COALESCE(e.costoTotal, 0) AS costoTotal -- Costo total del servicio
                FROM 
                    remito r
                LEFT JOIN 
                    (SELECT DISTINCT 
                         nTr,
                         nroRemito, 
                         patente, 
                         tipoDeUnidad, 
                         dniChofer, 
                         origen, 
                         destino, 
                         operadora, 
                         centroDeCosto, 
                         serviceLine, 
                         resumenDelServicio, 
                         kmRecorridos, 
                         horasDeServicio, 
                         costoTransporte, 
                         serviciosAdicionales, 
                         costoKmAdic, 
                         costoHorasDeEspera, 
                         costoTotal
                     FROM expro) e
                ON 
                    r.nroRemito = e.nroRemito
                WHERE 
                    r.empresa_destino = :empresa_cliente";
            break;
        case 'SECCO':
            $query = "SELECT 
    COALESCE(DATE(fecha), '') AS fecha,
    COALESCE(nroRemito, '') AS nroRemito,
    COALESCE(detalle, '') AS detalle,
    COALESCE(subtotal, 0) AS subtotal,
    COALESCE(km, 0) AS km,
    COALESCE(precio, 0) AS precio,
    COALESCE(total, 0) AS total,
    COALESCE(observaciones, '') AS observaciones
FROM 
    secco"; // Filtro por empresa o sin empresa
            break;

        case 'TETRA':

            $query = "SELECT 
                    DATE(r.fecha) AS fecha,
                    COALESCE(r.nroRemito, '') AS remito,
                    COALESCE(t.detalle, 'MALACATE') AS detalle,
                    COALESCE(FORMAT(r.valor_total, 2, 'de_DE'), '0,00') AS valor 
                FROM 
                    remito r
                LEFT JOIN 
                    (SELECT DISTINCT 
                         remito, 
                         detalle
                     FROM tetra) t
                ON 
                    r.nroRemito = t.remito
                WHERE 
                    r.empresa_destino = :empresa_cliente
                    AND r.estado IN ('pendientePorFacturar', 'pendienteSinEnviar')";

            break;
        
        default:
            error_log('Error: La empresa proporcionada no es válida: ' . $empresa_destino);
            echo json_encode(['success' => false, 'message' => 'La empresa proporcionada no es válida.']);
            exit;
    }


    // Log para confirmar que la consulta está configurada
    error_log('Consulta SQL: ' . $query);

    // Preparar y ejecutar la consulta
    if ($empresa_destino === 'SECCO') {
        // Para SECCO, no se usa vinculación de parámetros
        $stmt = $base_de_datos->query($query); // Ejecuta directamente
    } else {
        // Para otras empresas, usar parámetros
        $stmt = $base_de_datos->prepare($query);
        $stmt->execute(['empresa_cliente' => $empresa_destino]);
    }
    // Obtener los resultados
    $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Log de resultados obtenidos
    error_log('Resultados obtenidos: ' . json_encode($datos));

    if (empty($datos)) {
        echo json_encode(['success' => false, 'data' => [], 'message' => 'No hay datos disponibles para esta empresa.']);
    } else {
        echo json_encode(['success' => true, 'data' => $datos]);
    }
} catch (PDOException $e) {
    error_log('Error al obtener datos: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al obtener datos del servidor.']);
}
exit;
