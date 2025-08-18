<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../../lib/vendor/autoload.php';
require_once '../../conected-bd.php';

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

    if (!$remito) {
        echo json_encode(['success' => false, 'message' => 'Remito no encontrado.']);
        exit;
    }

    if ($remito['estado'] === 'Facturado') {
        // Configurar PHPMailer
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'wo50.wiroos.host';
        $mail->SMTPAuth = true;
        $mail->Username = 'administracion@admtpoil.com.ar';
        $mail->Password = 'admin-45*';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $mail->setFrom('administracion@admtpoil.com.ar');
        //$mail->addAddress('documentostpoil@gmail.com');
        //$mail->addAddress('leonardogalindez2018@gmail.com');
        $mail->isHTML(true);
        $mail->Subject = "Remito " . $remito['nroRemito'] . " enviado exitosamente";
        $mail->Body = "
     <p style='color: red; font-size: 14px;'>
         <strong>Nota:</strong> Este correo es automático, por favor no responda a este mensaje.
     </p>
 ";
        $mail->addReplyTo('no-reply@admtpoil.com.ar', 'No Responder');

        // Enviar el correo
        $mail->send();

        echo json_encode([
            'success' => true,
            'message' => 'Correo enviado correctamente a documentostpoil@gmail.com.'
        ]);
    }


} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Error al enviar el correo: {$mail->ErrorInfo}"]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
