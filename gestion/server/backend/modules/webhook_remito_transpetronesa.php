<?php
require_once '../../conected-bd.php';
// Función para registrar logs en un archivo
function escribirLog($mensaje)
{
    $archivo = __DIR__ . '/debug.log'; // El archivo se guarda en el mismo directorio del script
    $fecha = date('Y-m-d H:i:s');
    file_put_contents($archivo, "[$fecha] $mensaje\n", FILE_APPEND);
}

try {
    $base_de_datos = new PDO('mysql:host=127.0.0.1;dbname=' . $nombre_base_de_datos, $usuario, $contraseña, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    die("Ocurrió algo con la base de datos: " . $e->getMessage());
}

// Leer JSON solo una vez
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Verificar errores en el JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Error en el JSON recibido: " . json_last_error_msg());
}

// Validar el formulario
if (!isset($data['NombreFormulario']) || !isset($data['Respuestas'])) {
    die("Faltan datos en la solicitud.");
}

$nroRemito = '-';
$nroFactura = '-';
$fechaFacturado = '-';
$fecha = '-';
$fechaPagado = '-';
$dominio = '-';
$empresa = '-';
$nuevaEmpresa = '-';
$empresaDestino = '-';
$valorTotal = 0;
$email = '-';
$fechaEnvio = '-';
$estado = 'PendienteSinEnviar';
$debe = '-';
$descripcion = '-';
$fechaVencimiento = '-';
$incluirArchivos = 1;
$incluirFacturas = 1;
$archivos = [];
$facturas = [];
$formulario = $data['NombreFormulario'];
$fechaEgreso = '0000-00-00';
$cliente = '-';
$entregoTP = '-';
$recibioTP = '-';
$fechaR = '0000-00-00';

$empresa = "TRANSPETRONE";
$usuario = $data['NombreUsuario'];
$idRespuesta = isset($data['Id']) ? 'Id sirve para poder buscarlo en tu mail: ' . $data['Id'] : '';
foreach ($data['Respuestas'] as $index => $respuesta) {
    if (!isset($respuesta['Pregunta']))
        continue;
    switch ($respuesta['Pregunta']) {
        case 'Empresa':
            $cliente = $respuesta['RespuestaTexto'];
            if ($cliente === 'OTRO' && isset($data['Respuestas'][$index + 1]['Pregunta']) && $data['Respuestas'][$index + 1]['Pregunta'] === 'Nueva Empresa') {
                $cliente = $data['Respuestas'][$index + 1]['RespuestaTexto'];
            }
            break;
        case 'Cliente':
            $cliente = $respuesta['RespuestaTexto'];
            if ($cliente === 'OTRO' && isset($data['Respuestas'][$index + 1]['Pregunta']) && $data['Respuestas'][$index + 1]['Pregunta'] === 'Nuevo Cliente') {
                $cliente = $data['Respuestas'][$index + 1]['RespuestaTexto'];
            }
        case 'Fecha EGRESO':
            if (!empty($respuesta['RespuestaFecha'])) {
                $fechaISO = str_replace('T', ' ', $respuesta['RespuestaFecha']);
                $fechaEgreso = date('Y-m-d', strtotime($fechaISO));  // usar formato compatible con MySQL
                escribirLog("Fecha EGRESO procesada: $fechaEgreso");
            } else {
                $fechaEgreso = '0000-00-00';
                escribirLog("Fecha EGRESO vacía, se asigna por defecto: $fechaEgreso");
            }
            break;

        case 'Fecha':
            if (!empty($respuesta['RespuestaFecha'])) {
                $fechaISO = str_replace('T', ' ', $respuesta['RespuestaFecha']);
                $fechaR = date('Y-m-d', strtotime($fechaISO));
            } else {
                $fechaR = '0000-00-00';
            }
            break;

        case 'Entrego por TP':
            $entregoTP = $respuesta['RespuestaTexto'];
            break;
        case 'Recibio por TP':
            $recibioTP = $respuesta['RespuestaTexto'];
            break;
    }
}

try {

    if ($formulario === 'Orden de Trabajo' || $formulario === 'Test Orden') {
        $nroRemito = isset($data['Folio']) ? $data['Folio'] : '';
        $nroRemito = '001 - ' . str_pad($nroRemito, 8, '0', STR_PAD_LEFT);
        // Insertar datos en la base de datos
        $stmt = $base_de_datos->prepare("
    INSERT INTO remito (
        nroFactura, fechaPagado, fechaVencimiento, empresa, empresa_destino, 
        valor_total, email, archivos, estado, fechaFacturado, fechaEnvio, 
        descripcion, nroRemito, debe, fecha, dominio, detalle, facturas, 
        incluirArchivos, incluirFacturas, fechaRemito, usuario
    )
    VALUES (
        :nroFactura, :fechaPagado, :fechaVencimiento, :empresa, :cliente, 
        :valorTotal, :email, :archivos, :estado, :fechaFacturado, :fechaEnvio, 
        :descripcion, :nroRemito, :debe, :fecha, :dominio, :detalle, :facturas, 
        :incluirArchivos, :incluirFacturas, :fechaRemito, :usuario
    )
");
        escribirLog("Datos recibidos: " . json_encode($data));

        $stmt->execute([
            ':nroFactura' => $nroFactura,
            ':fechaPagado' => $fechaPagado,
            ':fechaVencimiento' => $fechaVencimiento,
            ':empresa' => $empresa,
            ':cliente' => $cliente,
            ':valorTotal' => $valorTotal,
            ':email' => $email,
            ':archivos' => json_encode($archivos),
            ':estado' => $estado,
            ':fechaFacturado' => $fechaFacturado,
            ':fechaEnvio' => $fechaEnvio,
            ':descripcion' => $descripcion,
            ':nroRemito' => $nroRemito,
            ':debe' => $debe,
            ':fecha' => $fecha,
            ':dominio' => $dominio,
            ':detalle' => $idRespuesta, // CORREGIDO
            ':facturas' => json_encode($facturas),
            ':incluirArchivos' => $incluirArchivos,
            ':incluirFacturas' => $incluirFacturas,
            ':fechaRemito' => $formulario === 'Orden de Trabajo' ? $fechaEgreso : $fechaR,
            ':usuario' => $usuario
        ]);

    } elseif ($formulario === 'Remito') {
        $nroRemito = isset($data['Folio']) ? $data['Folio'] : '';
        $nroRemito = '002 - ' . str_pad($nroRemito, 8, '0', STR_PAD_LEFT);

        $stmt = $base_de_datos->prepare("
    INSERT INTO remito (
        nroFactura, fechaPagado, fechaVencimiento, empresa, empresa_destino, 
        valor_total, email, archivos, estado, fechaFacturado, fechaEnvio, 
        descripcion, nroRemito, debe, fecha, dominio, detalle, facturas, 
        incluirArchivos, incluirFacturas, fechaRemito, usuario
    )
    VALUES (
        :nroFactura, :fechaPagado, :fechaVencimiento, :empresa, :cliente, 
        :valorTotal, :email, :archivos, :estado, :fechaFacturado, :fechaEnvio, 
        :descripcion, :nroRemito, :debe, :fecha, :dominio, :detalle, :facturas, 
        :incluirArchivos, :incluirFacturas, :fechaRemito, :usuario
    )
");
        escribirLog("Datos recibidos: " . json_encode($data));
        $stmt->execute([
            ':nroFactura' => $nroFactura,
            ':fechaPagado' => $fechaPagado,
            ':fechaVencimiento' => $fechaVencimiento,
            ':empresa' => $empresa,
            ':cliente' => $cliente,
            ':valorTotal' => $valorTotal,
            ':email' => $email,
            ':archivos' => json_encode($archivos),
            ':estado' => $estado,
            ':fechaFacturado' => $fechaFacturado,
            ':fechaEnvio' => $fechaEnvio,
            ':descripcion' => $descripcion,
            ':nroRemito' => $nroRemito,
            ':debe' => $debe,
            ':fecha' => $fecha,
            ':dominio' => $dominio,
            ':detalle' => $idRespuesta, // CORREGIDO
            ':facturas' => json_encode($facturas),
            ':incluirArchivos' => $incluirArchivos,
            ':incluirFacturas' => $incluirFacturas,
            ':fechaRemito' => $formulario === 'Orden de Trabajo' ? $fechaEgreso : $fechaR,
            ':usuario' => $usuario
        ]);
    }
} catch (PDOException $e) {
    escribirLog("Error al ejecutar la consulta: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Error al ejecutar la consulta: " . $e->getMessage()]);
}


?>