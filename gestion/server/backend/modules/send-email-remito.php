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

$targetDir = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";



try {

    $remitoId = $_POST['id'] ?? null;



    if (!$remitoId) {

        echo json_encode(['success' => false, 'message' => 'ID del remito no proporcionado.']);

        exit;

    }



    // Obtener datos del remito

    $query = "SELECT * FROM remito WHERE id = :id";

    $stmt = $base_de_datos->prepare($query);

    $stmt->execute([':id' => $remitoId]);



    $remito = $stmt->fetch(PDO::FETCH_ASSOC);



    error_log("Datos del remito obtenidos: " . print_r($remito, true));



    if (!$remito) {

        echo json_encode(['success' => false, 'message' => 'Remito no encontrado.']);

        exit;

    }



    // Verificar si el estado actual es "Facturado"

    $estadoActual = $remito['estado'];

    $cambiarEstado = strtolower($estadoActual) !== 'facturado';



    // Supongamos que ya tenés una fila obtenida como $remito

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

            echo json_encode(['success' => false, 'message' => 'El campo facturas no contiene un JSON válido.']);

            exit;

        }

    } else {

        $facturas = [];

    }





    // Obtener correos del campo `email`

    $emails = $remito['email'] ?? '';

    $emailList = array_filter(array_map('trim', explode(';', $emails))); // Separar correos y limpiar espacios en blanco



    if (empty($emailList)) {

        echo json_encode(['success' => false, 'message' => 'No hay correos electrónicos válidos.']);

        exit;

    }



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

    // Agregar destinatarios

    foreach ($emailList as $email) {

        $mail->addAddress($email);

    }



    // Obtener el rol del usuario logueado

    $usuario = $_SESSION['usuario']['tipo_usuario'] ?? '';



    if ($usuario) {

        switch ($usuario) {

            case 'nemer':

                $mail->addAddress('documentacion@logisticanemer.com.ar');

                $mail->addReplyTo('documentacion@logisticanemer.com.ar', 'NEMER');

                $mail->Body = "

    <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>

        <h2 style='color:rgb(72, 75, 74); margin-bottom: 10px;'>Detalle del Remito</h2>

        <p><strong style='color:rgb(0, 0, 0);'>Nro Remito:</strong> {$remito['nroRemito']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Empresa:</strong> {$remito['empresa']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Destino:</strong> {$remito['empresa_destino']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Valor Total:</strong> 

            <span style='color: #e74c3c;'>$" . number_format($remito['valor_total'], 2, ',', '.') . "</span>

        </p>

        <p><strong style='color:rgb(0, 0, 0);'>Descripción:</strong> {$remito['descripcion']}</p>

        <hr style='border: 0; height: 1px; background: #ecf0f1; margin: 20px 0;'>

        <p style='color: #7f8c8d; font-size: 14px; margin-top: 20px;'>

            <strong style='color:rgb(255, 25, 0);'>Nota:</strong> Este correo es automático, por favor no responda a este mensaje. Si necesita contactarnos, escriba a 

            <a href='mailto:documentacion@logisticanemer.com.ar' style='color: #3498db; text-decoration: none;'>documentacion@logisticanemer.com.ar</a>

        </p>

    </div>";

                break;

            case 'abasto':

                $mail->addAddress('administracion@abastonqn.com.ar');
                
                $mail->addAddress('documentostpoil@gmail.com');

                $mail->addReplyTo('administracion@abastonqn.com.ar', 'ABASTO');

                $mail->Body = "

    <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>

        <h2 style='color:rgb(72, 75, 74); margin-bottom: 10px;'>Detalle del Remito</h2>

        <p><strong style='color:rgb(0, 0, 0);'>Nro Remito:</strong> {$remito['nroRemito']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Empresa:</strong> {$remito['empresa']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Destino:</strong> {$remito['empresa_destino']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Valor Total:</strong> 

            <span style='color: #e74c3c;'>$" . number_format($remito['valor_total'], 2, ',', '.') . "</span>

        </p>

        <p><strong style='color:rgb(0, 0, 0);'>Descripción:</strong> {$remito['descripcion']}</p>

        <hr style='border: 0; height: 1px; background: #ecf0f1; margin: 20px 0;'>

        <p style='color: #7f8c8d; font-size: 14px; margin-top: 20px;'>

            <strong style='color:rgb(255, 25, 0);'>Nota:</strong> Este correo es automático, por favor no responda a este mensaje. Si necesita contactarnos, escriba a 

            <a href='mailto:administracion@abastonqn.com.ar' style='color: #3498db; text-decoration: none;'>administracion@abastonqn.com.ar</a>

        </p>

    </div>";

                break;

            case 'transpetrone':

                

                break;

            default:

                $descripcionFormateada = nl2br(htmlspecialchars($remito['descripcion']));

                $mail->addAddress('documentostpoil@gmail.com');

                $mail->addReplyTo('documentostpoil@gmail.com', 'TPOIL');

                $mail->Body = "

    <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>

        <h2 style='color:rgb(72, 75, 74); margin-bottom: 10px;'>Detalle del Remito</h2>

        <p><strong style='color:rgb(0, 0, 0);'>Nro Remito:</strong> {$remito['nroRemito']}</p>

        <p><strong style='color:rgb(0, 0, 0);'>Nro Factura:</strong> {$remito['nroFactura']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Empresa:</strong> {$remito['empresa']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Destino:</strong> {$remito['empresa_destino']}</p>

        <p><strong style='color: rgb(0, 0, 0);'>Valor Total:</strong> 

            <span style='color: #e74c3c;'>$" . number_format($remito['valor_total'], 2, ',', '.') . "</span>

        </p>

        <p><strong style='color:rgb(0, 0, 0);'>Descripción:</strong> {$descripcionFormateada}</p>

        <hr style='border: 0; height: 1px; background: #ecf0f1; margin: 20px 0;'>

        <p style='color: #7f8c8d; font-size: 14px; margin-top: 20px;'>

            <strong style='color:rgb(255, 25, 0);'>Nota:</strong> Este correo es automático, por favor no responda a este mensaje. Si necesita contactarnos, escriba a 

            <a href='mailto:documentostpoil@gmail.com' style='color: #3498db; text-decoration: none;'>documentostpoil@gmail.com</a>

        </p>

    </div>";

                break;

        }

    }



    $mail->addAddress('soporte.smartform@gmail.com');

    $mail->isHTML(true);

    

    $mail->Subject = "Detalles del Remito " . $remito['empresa'] .' - ' . date('d/m/Y H:i:s') ;



    // Adjuntar archivos con nombres reales

    foreach ($archivos as $archivo) {

        $rutaArchivo = $archivo;



        // Si el archivo no existe directamente, intentamos obtenerlo desde $targetDir

        if (!file_exists($rutaArchivo)) {

            $rutaArchivo = $targetDir . basename($archivo); // Concatenar ruta con nombre del archivo

        }



        if (file_exists($rutaArchivo)) {

            $nombreArchivo = basename($rutaArchivo); // Eliminar prefijo numérico

            error_log("Adjuntando archivo: $rutaArchivo");

            $mail->addAttachment($rutaArchivo, $nombreArchivo);

        } else {

            error_log("Archivo no encontrado: $rutaArchivo");

        }

    }



    foreach ($facturas as $factura) {

        $rutaArchivoFac = $factura;



        // Si el archivo no existe directamente, intentamos obtenerlo desde $targetDir

        if (!file_exists($rutaArchivoFac)) {

            $rutaArchivoFac = $targetDir . basename($factura); // Concatenar ruta con nombre del archivo

        }



        if (file_exists($rutaArchivoFac)) {

            $nombreArchivoFac =  basename($rutaArchivoFac); // Eliminar prefijo numérico

            error_log("Adjuntando archivo: $rutaArchivoFac");

            $mail->addAttachment($rutaArchivoFac, $nombreArchivoFac);

        } else {

            error_log("Archivo no encontrado: $rutaArchivoFac");

        }

    }







    // Enviar el correo

    $mail->send();



    // Cambiar el estado del remito solo si no está en "Facturado"

    if ($cambiarEstado) {

        $updateQuery = "UPDATE remito SET estado = 'PendientePorFacturar', fechaEnvio = NOW() WHERE id = :id";

        $updateStmt = $base_de_datos->prepare($updateQuery);

        $updateStmt->execute([':id' => $remitoId]);

    } else {

        $updateQuery = "UPDATE remito SET fechaEnvio = NOW() WHERE id = :id";

        $updateStmt = $base_de_datos->prepare($updateQuery);

        $updateStmt->execute([':id' => $remitoId]);

    }



    echo json_encode([

        'success' => true,

        'message' => 'Correo enviado correctamente. ' . ($cambiarEstado ? 'Estado del remito actualizado a PendientePorFacturar.' : 'El estado no fue modificado porque ya es Facturado.')

    ]);

} catch (Exception $e) {

    echo json_encode(['success' => false, 'message' => "Error al enviar el correo: {$mail->ErrorInfo}"]);

} catch (PDOException $e) {

    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);

}

