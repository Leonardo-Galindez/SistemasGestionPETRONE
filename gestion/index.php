<?php
session_start();
require 'server/conected-bd.php';

if (isset($_SESSION['usuario'])) {
    header("Location: client/views/administrador_home.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="client/styles/index.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
</head>

<body class="has-background-light">
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-4-desktop is-6-tablet">
                        <div class="box has-text-centered">
                            <!-- Ícono de usuario -->
                            <figure class="image is-96x96 mx-auto">
                                <img class="is-rounded" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    alt="Usuario">
                            </figure>
                            <h2 class="title is-4 has-text-centered mt-3">Iniciar Sesión</h2>
                            <form action="server/backend/login.php" method="POST">
                                <!-- Correo Electrónico -->
                                <div class="field">
                                    <label class="label has-text-left">Correo electrónico</label>
                                    <div class="control has-icons-left">
                                        <input class="input" type="email" name="correo" placeholder="Correo electrónico"
                                            required>
                                        <span class="icon is-small is-left">
                                            <i class="fa-solid fa-envelope"></i>
                                        </span>
                                    </div>
                                </div>
                                <!-- Contraseña -->
                                <div class="field">
                                    <label class="label has-text-left">Contraseña</label>
                                    <div class="control has-icons-left has-icons-right">
                                        <input class="input" type="password" name="contraseña" id="password"
                                            placeholder="Contraseña" required>
                                        <span class="icon is-small is-left">
                                            <i class="fa-solid fa-lock"></i>
                                        </span>
                                    </div>
                                </div>
                                <!-- Mensaje de error -->
                                <?php if (!empty($_GET['error'])): ?>
                                    <p class="has-text-danger has-text-centered">
                                        <?php echo htmlspecialchars($_GET['error']); ?>
                                    </p>
                                <?php endif; ?>
                                <!-- Botón de inicio de sesión -->
                                <div class="field">
                                    <div class="control">
                                        <button class="button is-primary is-fullwidth login">Iniciar Sesión</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</body>

</html>