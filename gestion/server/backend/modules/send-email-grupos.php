<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../../lib/vendor/autoload.php';
require_once '../../conected-bd.php';

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

try {
    // ===== Entrada JSON =====
    $rawData = file_get_contents('php://input');
    error_log("Datos crudos recibidos: $rawData");

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'JSON inválido.']);
        exit;
    }
    error_log("Datos decodificados: " . print_r($data, true));

    $remitosIds = $data['remitos'] ?? null;
    if (!$remitosIds || !is_array($remitosIds)) {
        echo json_encode(['success' => false, 'message' => 'No se proporcionaron IDs de remitos válidos.']);
        exit;
    }

    // ===== Traer remitos =====
    $idsEnteros = array_map('intval', $remitosIds);
    $idsEnteros = array_filter($idsEnteros, fn($v) => $v > 0);
    if (empty($idsEnteros)) {
        echo json_encode(['success' => false, 'message' => 'No hay IDs válidos luego del saneamiento.']);
        exit;
    }

    $inPlaceholders = implode(',', array_fill(0, count($idsEnteros), '?'));
    $sql = "SELECT * FROM remito WHERE id IN ($inPlaceholders)";
    $stmt = $base_de_datos->prepare($sql);
    $stmt->execute($idsEnteros);
    $remitos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($remitos)) {
        echo json_encode(['success' => false, 'message' => 'No se encontraron remitos con los IDs proporcionados.']);
        exit;
    }
    error_log("Remitos obtenidos: " . print_r($remitos, true));

    // ===== Helpers para emails y mailer =====
    $parseEmails = function (?string $cadena): array {
        if (empty($cadena)) return [];
        $arr = array_filter(array_map('trim', explode(';', $cadena)));
        $arr = array_map('mb_strtolower', $arr);
        $arr = array_unique($arr);
        sort($arr, SORT_STRING);
        return $arr;
    };
    $recipientKey = fn(array $emails) => implode(';', $emails);

    $crearMailer = function (string $fromName): PHPMailer {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        // === Config SMTP (Gmail) ===
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'admttna@gmail.com';
        $mail->Password   = 'k c l j i l y f m c a g t h j g'; // Sugerido: usar variable de entorno
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;
        $mail->CharSet    = 'UTF-8';
        $mail->isHTML(true);
        $mail->setFrom('admttna@gmail.com', $fromName);
        return $mail;
    };

    // ===== Agrupar por cadena normalizada de destinatarios =====
    $grupos = []; // key => ['emails'=>[], 'remitos'=>[]]
    foreach ($remitos as $r) {
        $emails = $parseEmails($r['email'] ?? '');
        if (empty($emails)) {
            error_log("Remito ID {$r['id']} sin emails válidos. Se omite del envío.");
            continue;
        }
        $key = $recipientKey($emails);
        if (!isset($grupos[$key])) {
            $grupos[$key] = ['emails' => $emails, 'remitos' => []];
        }
        $grupos[$key]['remitos'][] = $r;
    }

    if (empty($grupos)) {
        echo json_encode(['success' => false, 'message' => 'No hay correos electrónicos válidos en los remitos seleccionados.']);
        exit;
    }

    $usuarioTipo = $_SESSION['usuario']['tipo_usuario'] ?? null;
    $targetDir   = "/home/admtpoilcom/public_html/administracion/server/backend/modules/uploads/";
    $erroresEnvio = [];

    foreach ($grupos as $key => $grupo) {
        $remitosGrupo = $grupo['remitos'];
        $emailsGrupo  = $grupo['emails'];

        // From/Subject según empresa del primer remito del grupo (si hay)
        $empresaGrupo = !empty($remitosGrupo[0]['empresa']) ? $remitosGrupo[0]['empresa'] : '';
        $fromName     = $empresaGrupo ? ('Administracion ' . $empresaGrupo) : 'Administracion';
        $subjectBase  = $empresaGrupo ? ("Detalles de los Remitos Seleccionados - $empresaGrupo") : "Detalles de los Remitos Seleccionados";

        $mail = $crearMailer($fromName);

        // Destinatarios del grupo
        foreach ($emailsGrupo as $em) {
            $mail->addAddress($em);
        }
        // Destinatarios fijos
        $mail->addAddress('soporte.smartform@gmail.com');
        // $mail->addAddress('documentostpoil@gmail.com'); // si corresponde

        // Reply-To / adicionales por tipo de usuario
        switch ($usuarioTipo) {
            case 'nemer':
                $mail->addAddress('documentacion@logisticanemer.com.ar');
                $mail->addReplyTo('documentacion@logisticanemer.com.ar', 'NEMER');
                $notaFooter = "Si necesita contactarnos, escriba a <a href='mailto:documentacion@logisticanemer.com.ar'>documentacion@logisticanemer.com.ar</a>";
                break;
            case 'abasto':
                $mail->addAddress('administracion@abastonqn.com.ar');
                $mail->addAddress('documentostpoil@gmail.com');
                $mail->addReplyTo('administracion@abastonqn.com.ar', 'ABASTO');
                $notaFooter = "Si necesita contactarnos, escriba a <a href='mailto:administracion@abastonqn.com.ar'>administracion@abastonqn.com.ar</a>";
                break;
            case 'transpetrone':
                $notaFooter = "Si necesita contactarnos, responda a este correo.";
                break;
            default:
                $mail->addAddress('documentostpoil@gmail.com');
                $mail->addReplyTo('documentostpoil@gmail.com', 'TPOIL');
                $notaFooter = "Si necesita contactarnos, escriba a <a href='mailto:documentostpoil@gmail.com'>documentostpoil@gmail.com</a>";
                break;
        }

        $mail->Subject = $subjectBase . ' - ' . date('d/m/Y H:i:s');

        // ===== Construcción del cuerpo + adjuntos solo del grupo =====
        $cuerpo = "<div style='font-family: Arial, sans-serif; line-height:1.6; color:#333'>";
        $tituloEmp = $empresaGrupo ? $empresaGrupo : '';
        $cuerpo .= "<h2 style='color:rgb(72,75,74); margin-bottom:10px;'>Detalles de los Remitos Seleccionados {$tituloEmp}</h2>";

        foreach ($remitosGrupo as $r) {
            $descripcionFormateada = nl2br(htmlspecialchars($r['descripcion'] ?? '', ENT_QUOTES, 'UTF-8'));
            $valorFmt = is_numeric($r['valor_total'] ?? null)
                ? number_format((float)$r['valor_total'], 2, ',', '.')
                : '—';

            $cuerpo .= "
                <div style='margin-bottom:20px; border:1px solid #ddd; padding:10px; border-radius:5px;'>
                    <p><strong>Nro Remito:</strong> " . htmlspecialchars($r['nroRemito'] ?? '', ENT_QUOTES, 'UTF-8') . "</p>
                    <p><strong>Nro Factura:</strong> " . htmlspecialchars($r['nroFactura'] ?? '', ENT_QUOTES, 'UTF-8') . "</p>
                    <p><strong>Empresa:</strong> " . htmlspecialchars($r['empresa'] ?? '', ENT_QUOTES, 'UTF-8') . "</p>
                    <p><strong>Destino:</strong> " . htmlspecialchars($r['empresa_destino'] ?? '', ENT_QUOTES, 'UTF-8') . "</p>
                    <p><strong>Valor Total:</strong> <span style='color:#e74c3c'>\$ {$valorFmt}</span></p>
                    <p><strong>Descripcion:</strong> {$descripcionFormateada}</p>
                </div>
            ";

            // Adjuntos condicionados
            $archivos = [];
            $facturas = [];

            $incluirArchivos = $r['incluirArchivos'] ?? 0;
            $incluirFacturas = $r['incluirFacturas'] ?? 0;

            if ($incluirArchivos == 1) {
                $archivos = !empty($r['archivos']) ? json_decode($r['archivos'], true) : [];
                if ($archivos === null && json_last_error() !== JSON_ERROR_NONE) {
                    error_log("Remito ID {$r['id']}: 'archivos' no es JSON válido. Se omiten.");
                    $archivos = [];
                }
            }
            if ($incluirFacturas == 1) {
                $facturas = !empty($r['facturas']) ? json_decode($r['facturas'], true) : [];
                if ($facturas === null && json_last_error() !== JSON_ERROR_NONE) {
                    error_log("Remito ID {$r['id']}: 'facturas' no es JSON válido. Se omiten.");
                    $facturas = [];
                }
            }

            // Adjuntar archivos
            if (is_array($archivos)) {
                foreach ($archivos as $archivo) {
                    $ruta = $targetDir . basename($archivo);
                    if (file_exists($ruta)) {
                        $mail->addAttachment($ruta, basename($ruta));
                    } else {
                        error_log("Archivo no encontrado: $ruta");
                    }
                }
            }
            if (is_array($facturas)) {
                foreach ($facturas as $factura) {
                    $rutaFac = $targetDir . basename($factura);
                    if (file_exists($rutaFac)) {
                        $mail->addAttachment($rutaFac, basename($rutaFac));
                    } else {
                        error_log("Archivo no encontrado: $rutaFac");
                    }
                }
            }
        }

        $cuerpo .= "
            <hr style='border:0;height:1px;background:#ecf0f1;margin:20px 0;'>
            <p style='color:#7f8c8d; font-size:14px;'>
                <strong style='color:rgb(255,25,0)'>Nota:</strong> Este correo es automático, por favor no responda a este mensaje. {$notaFooter}
            </p>
        </div>";
        $mail->Body = $cuerpo;

        // ===== Envío del grupo =====
        try {
            $mail->send();
            error_log("Envío OK grupo ($key)");
        } catch (Exception $e) {
            $erroresEnvio[] = "Error al enviar grupo ($key): " . $mail->ErrorInfo;
            error_log(end($erroresEnvio));
            // Continúa con otros grupos (no abortamos)
        }

        // ===== Actualización de estado/fecha por remito del grupo =====
        foreach ($remitosGrupo as $r) {
            $id = (int)($r['id'] ?? 0);
            if ($id <= 0) continue;

            $select = $base_de_datos->prepare("SELECT estado FROM remito WHERE id = :id");
            $select->execute([':id' => $id]);
            $estadoActual = $select->fetch(PDO::FETCH_ASSOC)['estado'] ?? null;

            if ($estadoActual === 'PendienteSinEnviar') {
                $update = $base_de_datos->prepare(
                    "UPDATE remito SET estado = 'PendientePorFacturar', fechaEnvio = NOW() WHERE id = :id"
                );
            } else {
                $update = $base_de_datos->prepare(
                    "UPDATE remito SET fechaEnvio = NOW() WHERE id = :id"
                );
            }
            $update->execute([':id' => $id]);
        }
    }

    if (!empty($erroresEnvio)) {
        echo json_encode([
            'success' => false,
            'message' => 'Se enviaron algunos grupos, pero otros fallaron.',
            'errors'  => $erroresEnvio
        ]);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'Correos enviados por cadenas de destinatarios, estados actualizados.']);

} catch (Exception $e) {
    error_log("Error general: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => "Error al enviar el correo: " . $e->getMessage()]);
} catch (PDOException $e) {
    error_log("Error de base de datos: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
