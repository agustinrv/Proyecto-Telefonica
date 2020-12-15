<?php

class Telefono
{
    public $id;
    public $nombreCompleto
    public $numero
    public $territorio
    public $direccion
    

    public function __construct($_nombreCompleto,$_numero,$_territorio,$_direccion){
        
        //$this->id=self::GenerarID($nombreArchivo);                                  
        $this->nombreCompleto=$_nombreCompleto;
        $this->numero=$_numero;
        $this->territorio=$_territorio;
        $this->direccion=$_direccion;
    }


    ///Es posible que esto no se use
    public function ToJson()
    {
        $jsonTel = new stdClass();
        //jsonID...
        $jsonTel->nombrecompleto=$this->nombreCompleto;
        $jsonTel->numero=$this->numero;
        $jsonTel->territorio=$this->territorio;
        $jsonTel->direccion=$this->direccion;

        return $jsonTel;
    }
    ///Es posible que esto no se use
    public function ToString()
    {
        return $this->nombreCompleto . " - " . $this->numero . " - " . $this->direccion . " - " . $this->territorio;
    }


}


