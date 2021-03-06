<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require "./vendor/autoload.php";
require "./Clases/Telefono.php";
require "./Clases/Territorio.php";

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$app = new \Slim\App(["settings" => $config]);


$app->group("/telefono",function(){

    $this->post("/agregar",\Telefono::class . "::AgregarUno");
    $this->get("/traerTodos/{nombreArchivo}",\Telefono::class . "::TraerTodos");
    $this->delete("/borrar",\Telefono::class . "::BorrarUno");
    $this->put("/modificar",\Telefono::class . "::ModificarUno");
});

$app->group("/territorio",function(){

    $this->post("/agregar",\Territorio::class . "::AgregarUno")->add(
                            \Territorio::class  . "::Existe");
    $this->get("/traerTodos",\Territorio::class . "::TraerTodos");
    $this->delete("/borrar",\Territorio::class . "::BorrarUno");
    //$this->put("/modificar",\Territorio::class . "::ModificarUno");//EL nombre del archivo
});

$app->run();


?>
