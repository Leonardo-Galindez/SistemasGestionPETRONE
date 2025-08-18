<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../../lib/vendor/autoload.php';
require_once '../../conected-bd.php';

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start(); // Iniciar sesión para obtener el usuario logueado
try {
    // Leer los datos crudos enviados al backend
    $rawData = file_get_contents('php://input');
    error_log("Datos crudos recibidos: $rawData");

    // Decodificar los datos JSON
    $data = json_decode($rawData, true);
    error_log("Datos decodificados: " . print_r($data, true));

    // Verificar si se recibió el arreglo de remitos
    $remitosIds = $data['remitos'] ?? null;

    if (!$remitosIds || !is_array($remitosIds)) {
        error_log("Error: No se proporcionaron IDs de remitos válidos.");
        echo json_encode(['success' => false, 'message' => 'No se proporcionaron IDs de remitos válidos.']);
        exit;
    }

    // Registrar los IDs de los remitos seleccionados
    error_log("IDs de remitos seleccionados: " . implode(',', $remitosIds));

    // Obtener los datos de los remitos seleccionados
    $query = "SELECT * FROM remito WHERE id IN (" . implode(',', array_map('intval', $remitosIds)) . ")";
    $stmt = $base_de_datos->prepare($query);
    $stmt->execute();
    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Verificar si se obtuvieron remitos
    if (empty($remitos)) {
        error_log("Error: No se encontraron remitos con los IDs proporcionados.");
        echo json_encode(['success' => false, 'message' => 'No se encontraron remitos con los IDs proporcionados.']);
        exit;
    }

    // Registrar datos de los remitos obtenidos
    error_log("Datos de los remitos obtenidos: " . print_r($remitos, true));

    // Inicializar lista de correos electrónicos
    $emailList = [];

    // Construir la lista de correos electrónicos de todos los remitos
    foreach ($remitos as $remito) {
        if (!empty($remito['email'])) {
            $emails = array_filter(array_map('trim', explode(';', $remito['email'])));
            $emailList = array_merge($emailList, $emails);
        }
    }

    // Eliminar duplicados en la lista de correos electrónicos
    $emailList = array_unique($emailList);

    // Verificar si hay correos electrónicos válidos
    if (empty($emailList)) {
        error_log("Error: No hay correos electrónicos válidos.");
        echo json_encode(['success' => false, 'message' => 'No hay correos electrónicos válidos.']);
        exit;
    }

    // Registrar la lista final de correos electrónicos
    error_log("Lista de correos electrónicos: " . print_r($emailList, true));

    // Configurar PHPMailer
    /*$mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'wo50.wiroos.host';
    $mail->SMTPAuth = true;
    $mail->Username = 'administracion@admtpoil.com.ar';
    $mail->Password = 'admin-45*';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->setFrom('administracion@admtpoil.com.ar', 'Administracion ' . $remito['empresa']);*/
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'admttna@gmail.com';
    $mail->Password = 'k c l j i l y f m c a g t h j g';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('admttna@gmail.com', 'Administracion ' . $remito['empresa']);
    // Agregar destinatarios únicos al correo
    foreach ($emailList as $email) {
        $mail->addAddress($email);
    }

    // Agregar destinatario adicional fijo
    $mail->addAddress('soporte.smartform@gmail.com');
    //$mail->addAddress('documentostpoil@gmail.com');

    $mail->isHTML(true);
    $mail->Subject = 'Detalles de los Remitos Seleccionados - ' . $remito['empresa'] .' - '. date('d/m/Y H:i:s') ;

    // Construir el cuerpo del correo
    $cuerpoCorreo = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>";
    $cuerpoCorreo .= "<h2 style='color:rgb(72, 75, 74); margin-bottom: 10px;'>Detalles de los Remitos Seleccionados {$remito['empresa']}</h2>";
    $targetDir = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";

    foreach ($remitos as $remito) {
        $descripcionFormateada = nl2br(htmlspecialchars($remito['descripcion']));
        $cuerpoCorreo .= "
            <div style='margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;'>
                <p><strong>Nro Remito:</strong> {$remito['nroRemito']}</p>
                <p><strong>Nro Factura:</strong> {$remito['nroFactura']}</p>
                <p><strong>Empresa:</strong> {$remito['empresa']}</p>
                <p><strong>Destino:</strong> {$remito['empresa_destino']}</p>
                <p><strong>Valor Total:</strong> <span style='color: #e74c3c;'>$" . number_format($remito['valor_total'], 2, ',', '.') . "</span></p>
                <p><strong>Descripcion:</strong> {$descripcionFormateada}</p>
            </div>
        ";

        $incluirArchivos = $remito['incluirArchivos'] ?? 0;
        $incluirFacturas = $remito['incluirFacturas'] ?? 0;

        if ($incluirArchivos == 1) {
            $archivos = !empty($remito['archivos']) ? json_decode($remito['archivos'], true) : [];
            if (!is_array($archivos)) {
                echo json_encode(['success' => false, 'message' => 'El campo archivos no contiene un JSON válido.']);
                exit;
            }
        } else {
            $archivos = [];
        }

        if ($incluirFacturas == 1) {
            $facturas = !empty($remito['facturas']) ? json_decode($remito['facturas'], true) : [];
            if (!is_array($facturas)) {
                echo json_encode(['success' => false, 'message' => 'El campo archivos no contiene un JSON válido.']);
                exit;
            }
        } else {
            $facturas = [];
        }

        // Adjuntar archivos con nombres reales
        // Adjuntar archivos con nombres reales
        foreach ($archivos as $archivo) {
            // Siempre intentar con la ruta nueva del servidor
            $rutaArchivo = $targetDir . basename($archivo);

            if (file_exists($rutaArchivo)) {
                // Si el archivo existe, eliminamos cualquier prefijo numérico del nombre para mostrarlo limpio
                //$nombreArchivo = preg_replace('/^\d+_/', '', basename($rutaArchivo));
                $nombreArchivo = basename($rutaArchivo);
                error_log("Adjuntando archivo: $rutaArchivo");
                $mail->addAttachment($rutaArchivo, $nombreArchivo);
            } else {
                error_log("Archivo no encontrado: $rutaArchivo");
            }
        }

        foreach ($facturas as $factura) {
            // Siempre intentar con la ruta nueva del servidor
            $rutaArchivoFac = $targetDir . basename($factura);

            if (file_exists($rutaArchivoFac)) {
                // Si el archivo existe, eliminamos cualquier prefijo numérico del nombre para mostrarlo limpio
                $nombreArchivoFac = basename($rutaArchivoFac);
                error_log("Adjuntando archivo: $rutaArchivoFac");
                $mail->addAttachment($rutaArchivoFac, $nombreArchivoFac);
            } else {
                error_log("Archivo no encontrado: $rutaArchivoFac");
            }
        }


    }

    $usuario = $_SESSION['usuario']['tipo_usuario'];
    ; // Asumiendo que el usuario se almacena en la sesión


    if ($usuario) {
        switch ($usuario) {
            case 'nemer':
                $mail->addAddress('documentacion@logisticanemer.com.ar');
                $mail->addReplyTo('documentacion@logisticanemer.com.ar', 'NEMER');
                $cuerpoCorreo .= "
        <hr style='border: 0; height: 1px; background: #ecf0f1; margin: 20px 0;'>
        <p style='color: #7f8c8d; font-size: 14px;'>
            <strong style='color:rgb(255, 25, 0);'>Nota:</strong> Este correo es automático, por favor no responda a este mensaje. Si necesita contactarnos, escriba a 
            <a href='mailto:documentacion@logisticanemer.com.ar' style='color: #3498db; text-decoration: none;'>documentacion@logisticanemer.com.ar</a>
        </p>
    </div>";
                break;
            case 'abasto':
                $mail->addAddress('administracion@abastonqn.com.ar');
                $mail->addReplyTo('administracion@abastonqn.com.ar', 'ABASTO');
                $cuerpoCorreo .= "
        <hr style='border: 0; height: 1px; background: #ecf0f1; margin: 20px 0;'>
        <p style='color: #7f8c8d; font-size: 14px;'>
            <strong style='color:rgb(255, 25, 0);'>Nota:</strong> Este correo es automático, por favor no responda a este mensaje. Si necesita contactarnos, escriba a 
            <a href='mailto:administracion@abastonqn.com.ar' style='color: #3498db; text-decoration: none;'>administracion@abastonqn.com.ar</a>
        </p>
    </div>";
                break;
            case 'transpetrone':

                break;
            default:
                $mail->addAddress('documentostpoil@gmail.com');
                $mail->addReplyTo('documentostpoil@gmail.com', 'TPOIL');
                $cuerpoCorreo .= "
        <hr style='border: 0; height: 1px; background: #ecf0f1; margin: 20px 0;'>
        <p style='color: #7f8c8d; font-size: 14px;'>
            <strong style='color:rgb(255, 25, 0);'>Nota:</strong> Este correo es automático, por favor no responda a este mensaje. Si necesita contactarnos, escriba a 
            <a href='mailto:documentostpoil@gmail.com' style='color: #3498db; text-decoration: none;'>documentostpoil@gmail.com</a>
        </p>
    </div>";
                break;
        }
    }


    $mail->Body = $cuerpoCorreo;

    // Enviar el correo
    $mail->send();

    // Cambiar el estado y actualizar la fecha de envío para cada remito seleccionado
    foreach ($remitosIds as $remitoId) {
        // Obtener el estado actual del remito
        $selectQuery = "SELECT estado FROM remito WHERE id = :id";
        $selectStmt = $base_de_datos->prepare($selectQuery);
        $selectStmt->execute([':id' => $remitoId]);
        $currentState = $selectStmt->fetch(PDO::FETCH_ASSOC)['estado'];

        // Actualizar el estado según su valor actual
        if ($currentState === 'PendienteSinEnviar') {
            $updateQuery = "UPDATE remito SET estado = 'PendientePorFacturar', fechaEnvio = NOW() WHERE id = :id";
        } else {
            $updateQuery = "UPDATE remito SET fechaEnvio = NOW() WHERE id = :id";
        }
        $updateStmt = $base_de_datos->prepare($updateQuery);
        $updateStmt->execute([':id' => $remitoId]);
    }


    error_log("Correo enviado exitosamente y fechas de envío actualizadas.");

    echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente con los detalles de los remitos.']);

    error_log("Correo enviado exitosamente.");
} catch (Exception $e) {
    error_log("Error al enviar el correo: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => "Error al enviar el correo: {$mail->ErrorInfo}"]);
} catch (PDOException $e) {
    error_log("Error de base de datos: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
