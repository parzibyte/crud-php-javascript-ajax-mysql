<?php
include_once "funciones.php";
$productos = obtenerProductos();
echo json_encode($productos);
