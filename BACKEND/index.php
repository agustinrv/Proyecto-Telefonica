<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require "./vendor/autoload.php";
require "./Clases/Telefono.php";

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$app = new \Slim\App(["settings" => $config]);


$app->group("/dia",function(){

    $this->post("/agregar",\Telefono::class . "::AgregarUno");
    $this->get("/traerTodos",\Telefono::class . "::TraerTodos");
    $this->delete("/borrar",\Telefono::class . "::BorrarUno");
    $this->put("/modificar",\Telefono::class . "::ModificarUno");
});

$app->run();












?>