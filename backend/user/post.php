<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");


require_once('../connect.php');

$db = connect();

 
$dato=json_decode(file_get_contents("php://input")); 

if(!$dato)
{
    exit("No se Encontraron Datos");
}

$nombre=$dato -> nombre;
$password=$dato -> password;

$db=connect();

$sql="INSERT INTO `users` (`nombre`, `contraseña`) VALUES ('$nombre', '$password');";

$result = mysqli_query($db,$sql);


