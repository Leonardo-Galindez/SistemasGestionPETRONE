<?php

session_start();

if (!isset($_SESSION['usuario'])) {

    header("Location: login.php");

    exit();

}



require_once '../../conected-bd.php';



// Establecer encabezados para que Excel lo interprete como UTF-8 correctamente

header("Content-Type: application/vnd.ms-excel; charset=UTF-8");

header("Content-Disposition: attachment; filename=remitos.xls");

echo "\xEF\xBB\xBF"; // BOM para UTF-8





echo "<table border='1'>";

echo "<tr>

        <th>Nro Remito</th>

        <th>Nro Factura</th>

        <th>Fecha</th>

        <th>Cliente</th>

        <th>Total</th>

        <th>IVA</th>

      </tr>";



try {

    // Armar filtros desde parámetros GET

    $filtros = [];

    $valores = [];





    if (!empty($_GET['nro_remito'])) {

        $filtros[] = "nroRemito = :nro_remito";

        $valores[':nro_remito'] = $_GET['nro_remito'];

    }



    if (!empty($_GET['nro_factura'])) {

        $filtros[] = "nroFactura = :nro_factura";

        $valores[':nro_factura'] = $_GET['nro_factura'];

    }





    if (!empty($_GET['fecha_inicio'])) {

        $filtros[] = "fechaRemito >= :fecha_inicio";

        $valores[':fecha_inicio'] = $_GET['fecha_inicio'];

    }



    if (!empty($_GET['fecha_fin'])) {

        $filtros[] = "fechaRemito <= :fecha_fin";

        $valores[':fecha_fin'] = $_GET['fecha_fin'];

    }





    if (!empty($_GET['empresaDestino'])) {

        $filtros[] = "empresa_destino LIKE :empresaDestino";

        $valores[':empresaDestino'] = '%' . $_GET['empresaDestino'] . '%';

    }





    if (!empty($_GET['estado'])) {

        $filtros[] = "estado LIKE :estado";

        $valores[':estado'] = '%' . $_GET['estado'] . '%';

    }



    $sql = "SELECT nroRemito, nroFactura, fechaRemito, empresa_destino, valor_total, valor_total * 0.21 as IVA 

        FROM remito 

        WHERE empresa = 'TRANSPETRONE'";



    if (!empty($filtros)) {

        $sql .= " AND " . implode(" AND ", $filtros);

    }



    $sql .= " ORDER BY fechaRemito DESC";



    $consulta = $base_de_datos->prepare($sql);

    $consulta->execute($valores);

    $remitos = $consulta->fetchAll();



    foreach ($remitos as $remito) {

        echo "<tr>

                <td>" . mb_convert_encoding($remito['nroRemito'], 'UTF-8', 'auto') . "</td>

                <td>" . mb_convert_encoding($remito['nroFactura'], 'UTF-8', 'auto') . "</td>

                <td>" . mb_convert_encoding($remito['fechaRemito'], 'UTF-8', 'auto') . "</td>

                <td>" . mb_convert_encoding($remito['empresa_destino'], 'UTF-8', 'auto') . "</td>

                <td>" . number_format($remito['valor_total'], 2, '.', '') . "</td>

                <td>" . number_format($remito['IVA'], 2, '.', '') . "</td>



                </tr>";

    }



    if (count($remitos) === 0) {

        echo "<tr><td colspan='7'>No hay remitos cargados con los filtros aplicados.</td></tr>";

    }

} catch (PDOException $e) {

    echo "<tr><td colspan='7'>Error: " . $e->getMessage() . "</td></tr>";

}



echo "</table>";