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

$fecha = '0000-00-00';
$supervisor = "";
$G01 = "";
$G01 = "";
$G03 = "";
$G04 = "";
$CR1 = "";
$ZM01 = "";
$CR02 = "";
$CHM02 = "";
$CV1 = "";
$CV2 = "";
$CV3 = "";
$CV4 = "";
$CHM01 = "";
$CHM57_01 = "";
$CP3 = "";
$CE01 = "";
$CE02 = "";
$CC2 = "";
$CP1 = "";
$CP2 = "";
$CA1 = "";
$CV01 = "";
$MT1 = "";
$CM1 = "";
$CM2 = "";
$LP = "";
$LC_ = "";
$LM = "";
$LB = "";
$LC = "";
$LS = "";
$TB01 = "";
$CR03 = "";
$observaciones = "";
$CM03 = "";
$CR4 = "";
$CMH3 = "";
$CH54 = "";
$G07 = "";
$G08 = "";
$AE03 = "";

foreach ($data['Respuestas'] as $index => $respuesta) {
    if (!isset($respuesta['Pregunta']))
        continue;

    switch ($respuesta['Pregunta']) {
        case 'Fecha':
            if (!empty($respuesta['RespuestaFecha'])) {
                $fecha = str_replace('T', ' ', $respuesta['RespuestaFecha']);
                $fecha = date('Y-m-d', strtotime($fecha));
            }
            break;
        case 'Supervisor':
            $supervisor = $respuesta['RespuestaTexto'];
            break;
        case 'G01':
            $G01 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'G03':
            $G03 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'G04':
            $G04 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CR1':
            $CR1 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'ZM01':
            $ZM01 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CR02':
            $CR02 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CHM02':
            $CHM02 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CV1':
            $CV1 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CV2':
            $CV2 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CV3':
            $CV3 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CV4':
            $CV4 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CHM01':
            $CHM01 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CHM57-01':
            $CHM57_01 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CP3':
            $CP3 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CE01':
            $CE01 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CE02':
            $CE02 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CC2':
            $CC2 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CP1':
            $CP1 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CP2':
            $CP2 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CA1':
            $CA1 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CV01':
            $CV01 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'MT1':
            $MT1 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CM1':
            $CM1 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CM2':
            $CM2 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'LP':
            $LP = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'LC-':
            $LC_ = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'LM':
            $LM = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'LB':
            $LB = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'LC':
            $LC = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'LS':
            $LS = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'TB01':
            $TB01 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CR03':
            $CR03 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'observaciones':
            $observaciones = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CM03':
            $CM03 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CR4':
            $CR4 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CMH3':
            $CMH3 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'CH54':
            $CH54 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'G07':
            $G07 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'G08':
            $G08 = $respuesta['RespuestaTexto'] ?? '';
            break;
        case 'AE03':
            $AE03 = $respuesta['RespuestaTexto'] ?? '';
            break;
    }
}

try {
    
    $stmt = $base_de_datos->prepare("
        INSERT INTO parte (
            fecha, supervisor, G01, G03, G04, CR1, ZM01, CR02,
            CHM02, CV1, CV2, CV3, CV4, CHM01, CHM57_01, CP3, 
            CE01, CE02, CC2, CP1, CP2, CA1, CV01, MT1, CM1, 
            CM2, LP, LC_, LM, LB, LC, LS, TB01, CR03, 
            observaciones, CM03, CR4, CMH3, CH54, G07, G08,AE03
        ) VALUES (
            :fecha, :supervisor, :G01, :G03, :G04, :CR1, :ZM01, :CR02,
            :CHM02, :CV1, :CV2, :CV3, :CV4, :CHM01, :CHM57_01, :CP3,
            :CE01, :CE02, :CC2, :CP1, :CP2, :CA1, :CV01, :MT1, :CM1,
            :CM2, :LP, :LC_, :LM, :LB, :LC, :LS, :TB01, :CR03,
            :observaciones, :CM03, :CR4, :CMH3, :CH54, :G07, :G08, :AE03
        )
    ");

    $stmt->execute([
        ':fecha' => $fecha,
        ':supervisor' => $supervisor,
        ':G01' => $G01,
        ':G03' => $G03,
        ':G04' => $G04,
        ':CR1' => $CR1,
        ':ZM01' => $ZM01,
        ':CR02' => $CR02,
        ':CHM02' => $CHM02,
        ':CV1' => $CV1,
        ':CV2' => $CV2,
        ':CV3' => $CV3,
        ':CV4' => $CV4,
        ':CHM01' => $CHM01,
        ':CHM57_01' => $CHM57_01,
        ':CP3' => $CP3,
        ':CE01' => $CE01,
        ':CE02' => $CE02,
        ':CC2' => $CC2,
        ':CP1' => $CP1,
        ':CP2' => $CP2,
        ':CA1' => $CA1,
        ':CV01' => $CV01,
        ':MT1' => $MT1,
        ':CM1' => $CM1,
        ':CM2' => $CM2,
        ':LP' => $LP,
        ':LC_' => $LC_,
        ':LM' => $LM,
        ':LB' => $LB,
        ':LC' => $LC,
        ':LS' => $LS,
        ':TB01' => $TB01,
        ':CR03' => $CR03,
        ':observaciones' => $observaciones,
        ':CM03' => $CM03,
        ':CR4' => $CR4,
        ':CMH3' => $CMH3,
        ':CH54' => $CH54,
        ':G07' => $G07,
        ':G08' => $G08,
        ':AE03' => $AE03
    ]);

} catch (PDOException $e) {
    escribirLog("Error al ejecutar la consulta: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Error al ejecutar la consulta: " . $e->getMessage()]);
}
