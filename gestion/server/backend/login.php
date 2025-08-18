<?php
session_start();
require '../conected-bd.php';

// Verificar que la conexión esté disponible
if (!$base_de_datos) {
    die("Error de conexión a la base de datos");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];
    $contraseña = $_POST['contraseña'];

    try {
        $sql = "SELECT id, nombre, apellido, contraseña, tipo_usuario FROM usuario WHERE correo = :correo LIMIT 1";
        $stmt = $base_de_datos->prepare($sql);
        $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
        $stmt->execute();
        $usuario = $stmt->fetch();

        if ($usuario && hash('sha256', $contraseña) === $usuario['contraseña']) {
            $_SESSION['usuario'] = [
                'id' => $usuario['id'],
                'nombre' => $usuario['nombre'],
                'apellido' => $usuario['apellido'],
                'tipo_usuario' => $usuario['tipo_usuario']
            ];

            // Redirección según el tipo de usuario
            switch ($usuario['tipo_usuario']) {
                case 'administrador':
                    header("Location: ../../client/views/administrador_home.php");
                    break;
                case 'abasto':
                    header("Location: ../../client/views/abasto_home.php");
                    break;
                case 'nemer':
                    header("Location: ../../client/views/nemer_home.php");
                    break;
                case 'tpoil':
                    header("Location: ../../client/views/tpoil_home.php");
                    break;
                case 'transpetrone':
                    header("Location: ../../client/views/transpetrone_home.php");
                    break;
                default:
                    header("Location: ../../client/views/administrador_home.php"); // Página por defecto si el tipo no coincide
                    break;
            }
            exit();
        } else {
            header("Location: ../index.php?error=Usuario o contraseña incorrecta");
            exit();
        }
    } catch (PDOException $e) {
        header("Location: ../index.php?error=Error en la base de datos: " . $e->getMessage());
        exit();
    }
}
?>


