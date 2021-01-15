<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class Telefono
{
    public $id;
    public $nombreCompleto;
    public $numero;
    public $territorio;
    public $direccion;
    public $estado; //Revisita,No llamar,Se puede
    public $esNegocio;//bool
    

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

    public static function GenerarID($nombreArchivo)
    {
        $lista=self::TraerTelefonosJSON($nombreArchivo);
        var_dump($lista);
        $lista=$lista;
        $retorno=1;
        if(!empty($lista))
        {
            $i=count($lista)-1;
            $retorno=$lista[$i]->id+1;
        }
        return $retorno;
    }


    public static function AgregarEnArchivoJSON($nombreArchivo,$json)
    {
        $path="./Archivos/". $nombreArchivo .".json";
        $archivo=fopen($path,"a");
        $retorno=false;
        $cadenaJson=json_encode($json);

        if(isset($archivo))
        {
            fwrite($archivo,$cadenaJson . "\n");
            fclose($archivo);
            $retorno=true;
        }

        return $retorno;
    }



    public static function AgregarUno(Request $request,Response $response,$args)
    {
        $recibo=$request->getParsedBody();
        
        $json=json_decode($recibo["cadenaJson"]);
        $nombreArchivo=$recibo["nombreArchivo"];
        
        $json->id= self::GenerarID($nombreArchivo);

        $retorno= new stdClass();
        //$json=self::ValidarCamposVacios($json);

        if(self::AgregarEnArchivoJSON($nombreArchivo,$json))
        {
            $retorno->exito=true;
            $retorno->status=200;
            $retorno->mensaje="Se a Agregado exitosamente!!!";
        }
        else
        {
        
            $retorno->exito=false;
            $retorno->status=400;
            $retorno->mensaje="No se a podido agregar";
        }

        return $response->withJson($retorno,$retorno->status);
    }

    public static function TraerTelefonosJSON($nombreArchivo)
    {
        
        $path="./Archivos/" . $nombreArchivo . ".json";
        $listaRetorno=array();

        if(file_exists($path))
        {
            $archivo=fopen($path,"r");
            if(isset($archivo))
            {
                if(filesize($path) > 0)
                {
                    while(!feof($archivo))
                    {
                        $cadenaJson=fgets($archivo);
                        if(!empty($cadenaJson))
                        {
                            $json=json_decode($cadenaJson);
                            array_push($listaRetorno,$json);
                        }

                    }
                }
                else
                {
                    $listaRetorno=false;
                }
                
                fclose($archivo);
            }
        }

        return $listaRetorno;
        
        
    }


    public static function TraerTodos(Request $request,Response $response,$args)
    {
        $nombreArchivo=$args["nombreArchivo"];
        $lista=self::TraerTelefonosJSON($nombreArchivo);
        $retorno = new stdClass();

        if(!empty($lista))
        {
            $retorno->exito=true;
            $retorno->status=200;
            $retorno->mensaje="Se han recuperado exitosamente!!!";
            $retorno->listaTelefonos=$lista;   
        }
        else if($lista==false)
        {
            $retorno->exito=true;
            $retorno->status=200;
            $retorno->mensaje="El archivo esta vacio,cargue un elemento para poder verlo";
            $retorno->listaTelefonos=$lista;
        }
        else
        {
            $retorno->exito=false;
            $retorno->status=400;
            $retorno->mensaje="No se han podido recuperar";
        }

        return $response->withJson($retorno,$retorno->status);
    }

    public static function EscribirEnArchivoJSON($lista,$nombreArchivo)
    {
        $path="./Archivos/".$nombreArchivo.".json";
        $archivo=fopen($path,"w");
        $retorno=false;
        
        if(isset($archivo))
        {
            foreach ($lista as $key => $i) {
                $cadenaJson=json_encode($i);
                fwrite($archivo,$cadenaJson . "\n");    
            }
            
            fclose($archivo);
            $retorno=true;
        }

        return $retorno;
    }

    public static function BorrarUnoJSON($id,$nombreArchivo)
    {
        $lista=self::TraerTelefonosJSON($nombreArchivo);
        $nuevaLista=array();
        $retorno=false;

        foreach ($lista as $key => $i) {
            
            if($i->id==$id)
            {
                $retorno =true;
                continue;
            }
            array_push($nuevaLista,$i);
        }
        if($retorno==true)
        {
            self::EscribirEnArchivoJSON($nuevaLista,$nombreArchivo);
        }

        return $retorno;
    }

    public static function BorrarUno(Request $request,Response $response,$args)
    {
        $recibo=$request->getParsedBody();
        $id=$recibo["id"];
        $nombreArchivo=$recibo["nombreArchivo"];
        $retorno=new stdClass();        

        if(self::BorrarUnoJson($id,$nombreArchivo))
        {
            $retorno->exito=true;
            $retorno->mensaje="Se a eliminado exitosamente";
            $retorno->status=200;
        }
        else 
        {
            
            $retorno->status=400;
            $retorno->exito=false;
            $retorno->mensaje="No se a podido eliminar";
        }

        return $response->withJson($retorno,$retorno->status);
    }

    public static function ModificarEnArchivoJSON($nombreArchivo,$elemento)    
    {
        $lista=self::TraerTelefonosJSON($nombreArchivo);
        $nuevaLista=array();
        $retorno=false;

        foreach ($lista as $key => $i) {
            
            if($i->id==$elemento->id)
            {
                $retorno=true;
                array_push($nuevaLista,$elemento);    
                continue;
            }
            array_push($nuevaLista,$i);
        }
        if($retorno==true)
        {
            self::EscribirEnArchivoJSON($nuevaLista,$nombreArchivo);
        }

        return $retorno;




    }


    public static function ModificarUno(Request $request,Response $response,$args)
    {
        $recibo=$request->getParsedBody();
        $json=json_decode($recibo["cadenaJson"]);
        $nombreArchivo=$recibo["nombreArchivo"];
        $retorno= new stdClass();
     // $json=self::ValidarCamposVacios($json);

        if(self::ModificarEnArchivoJSON($nombreArchivo,$json))
        {
            $retorno->exito=true;
            $retorno->status=200;
            $retorno->mensaje="Se a modificado exitosamente!!!";
        }
        else
        {
        
            $retorno->exito=false;
            $retorno->status=400;
            $retorno->mensaje="No se a podido modificar";
        }

        return $response->withJson($retorno,$retorno->status);
    }




   


}

?>
