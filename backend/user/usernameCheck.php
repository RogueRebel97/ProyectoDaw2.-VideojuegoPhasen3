<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: *");


require_once('../connect.php');


$db = connect();

$dato=json_decode(file_get_contents("php://input")); 

if(!$dato)
{
    exit("No se han enviado datos");
}

$username= $dato     -> nombre;



$sql="SELECT * FROM users WHERE nombre = '$username'";

$result = mysqli_query($db,$sql);

if($result -> num_rows >0){
    $available= 0;
    }
    else
    {
        $available= 1;
    }

    echo($available);
  
  