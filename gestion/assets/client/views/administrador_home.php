<?php

session_start();

if (!isset($_SESSION['usuario'])) {

    header("Location: ../../index.php");

    exit();

}



$usuario = $_SESSION['usuario'];

?>



<!DOCTYPE html>

<html lang="es">



<head>

    <meta charset="UTF-8">

    <link rel="stylesheet" href="../styles/home.css">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">



    <title>Administración General</title>

</head>



<body>

    <header class="header"></header>

    <div class="gestion">

        <div class="addRemito"></div>

    </div>

    <div class="controles">

        <div class="control-1"></div>

        <div class="control-2"></div>

    </div>

    <div class="table"></div>


    <script type="module" src="../controllers/controller_render_admin.js"></script>

    <script type="module" src="../controllers/controller_forms_remitos.js"></script>

    <script type="module" src="../controllers/controller_table_remitos.js"></script>

    <script type="module" src="../controllers/controller_forms_filtros.js"></script>

    <script type="module" src="../controllers/controller_forms_filtros_pendientes.js"></script>

    <script type="module" src="../controllers/controller_forms_filtros_deudas.js"></script>

    <script type="module" src="../controllers/controller_header.js"></script>

    <!--<script type="module" src="../controllers/controller_forms_seleccionarRemitos.js"></script>-->



</body>



</html>