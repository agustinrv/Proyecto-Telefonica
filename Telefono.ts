///<reference path="node_modules/@types/jquery/index.d.ts" />
///<reference path="./genericas.ts" />

function Agregar()
{
    let tel:any={};
    let pagina="BACKEND/telefono/agregar";

    tel.nombre=$("#txtNombre").val();
    tel.numero=$("#txtNumero").val();
    tel.direccion=$("#txtDireccion").val();
    tel.estado=$("#cboEstado").val();
    tel.categoria=$("#cboCategoria").val();
    

    
    if(AdministrarValidaciones(tel))
    {
        //let nombreArchivo=localStorage.getItem("nombreArchivo");
        let form = new FormData();
        form.append("cadenaJson",JSON.stringify(tel));
        form.append("nombreArchivo","prueba");

        $.ajax({
            url:pagina,
            type:"post",
            data:form,
            dataType:"json",
            contentType:false,
            processData:false,
            async:true
        }).done(function(respuesta){
            AlertSuccess(respuesta.mensaje);
            CargarTabla();
            ArmarAgregar();
        }).fail(function(jqxhr){
            console.log(jqxhr.responseText);
            let respuesta=JSON.parse(jqxhr.responseText);
            AlertDanger(respuesta.mensaje);
        });
    }

    
    
}


//Deberia verse selecionada la fila que voy a modificar

function CargarTabla()
{
    let nombreArchivo="prueba";//localStorage.getItem("nombreArchivo");

    let pagina="BACKEND/telefono/traerTodos/" + nombreArchivo;
    
    $.ajax({
        url:pagina,
        type:"get",
        dataType:"json",
        //contentType:false,
        //processData:false,
        async:true
    }).done(function(respuesta){
        
        if(respuesta.exito)
        {
            if(respuesta.listaTelefonos==false)
            {
                AlertWarning(respuesta.mensaje)
            }
            else
            {
                let fila=0;
                let listaTelefonos=respuesta.listaTelefonos;
                let total=CalcularTotales(listaTelefonos);

                let archivo= "prueba" //localStorage.getItem("nombreArchivo");
                
                let html='<h1 class="text-white">'+ archivo +'</h1> ';
                html+='<div class="table-responsive">';
                html+='<table class="table table-sm table-dark table-hover">';
                html+='<tr><th></th><th class="pl-4">Nº</th><th class="text-center">Nombre</th><th class="text-center">Numero</th><th class="text-center">Direccion</th>';
                html+='<th class="text-center">Estado</th><th class="text-center">Categoria</th>';
                html+='<th class="pl-3">Modificar</th><th class="pl-3">Eliminar</th></tr>';
                listaTelefonos.forEach(element => {
                    fila++;
                    total.nombre+=parseInt(element.nombre);
                    total.numero+=parseInt(element.numero);
                    total.direccion+=parseInt(element.direccion);
                    total.estado+=parseInt(element.estado);

                    html+='<tr onclick="SeleccionarFilaPrimary('+fila+","+total.telefonos+')" id="fila-'+fila+'" ><td></td>';
                    html+='<td class="text-center">'+fila+'</td><td class="text-center">'+element.nombre+'</td>'+'<td class="text-center">'+element.numero+'</td>';
                    html+='<td class="text-center">'+element.direccion+'</td>'+'<td class="text-center">'+element.estado+'</td>';
                    html+='<td class="text-center">'+element.categoria+'</td>';
                    html+="<td><input type='button' value='Modificar' class='btn btn-warning' onclick='ArmarModificar("+JSON.stringify(element) +","+fila+")'></td>";
                    html+='<td><input type="button" value="Eliminar" class="btn btn-danger" onclick="Eliminar('+element.id+","+fila+')"></td></tr>';
                });
                
                html+='<tr><td>Total:</td><td class="text-left pl-3" colspan="2">'+total.telefonos+' telefonos</td></tr></table></div>';
            
                html+="<input type='button' value='Generar Informe' class='btn btn-primary' id='btnInforme' onclick='GenerarInforme("+JSON.stringify(total)+")'>";
                html+='<div id="divInforme" class="mt-2"></div>';

                $("#tablaTel").html(html);
               
                



                
            }
        }


    }).fail(function(jqxhr){
        console.log(jqxhr.responseText);
    });
    
}

function CalcularTotales(listaTelefonos:any)
{
    let total:any={};
    total.telefonos=listaTelefonos.length;
    total.casas=0;
    total.edificios=0;
    total.negocios=0;
    total.sePuede=0;
    total.noLlamar=0;
    total.revisitas=0;

   ///Categoria

    let categorias=listaTelefonos.map(function(value,index,array){
        return value.categoria;
    })

    total.casas=categorias.filter(function(value:string,index,array){
        return value.toLowerCase()=="casa";
    }).length;

    total.edificios=categorias.filter(function(value:string,index,array){
        return value.toLowerCase()=="edificio";
    }).length;

    total.negocios=categorias.filter(function(value:string,index,array){
        return value.toLowerCase()=="negocio";
    }).length

///Estado
    let estados=listaTelefonos.map(function(value,index,array){
        return value.estado;
    })

    total.sePuede=estados.filter(function(value:string,index,array){
        return value.toLowerCase()=="se puede";
    }).length

    total.noLlamar=estados.filter(function(value:string,index,array){
        return value.toLowerCase()=="no llamar";
    }).length

    total.revisitas=estados.filter(function(value:string,index,array){
        return value.toLowerCase()=="revisita";
    }).length

    
    return total;
}

function GenerarInforme(total)
{
   // total=JSON.parse(total);
    console.log(total);
    
    
    AlertInforme("<strong>Informe: </strong>"+"</br>"+
    "Total de Numeros: " +  total.telefonos + "</br>"+
    "Total de Casas: " + total.casas + "</br>"+
    "Total de Edificios: " + total.edificios + "</br>"+
    "Total de Negocios: " + total.negocios + "</br>"+
    "Total de Numeros que se pueden llamar: " + total.sePuede+"</br>"+//"total de 'se puede' "
    "Total de No Llamar: "+total.noLlamar + "</br>"+
    "Total de Revisitas: "+total.revisitas + "</br>"+ "</br>");
     
    
}




//Cambiar confirm por ventana Modal

function Eliminar(id,fila)
{
    let pagina="BACKEND/telefono/borrar";

    if(confirm("Desea eliminar la fila nº" + fila))
    {
        let archivo= "prueba"//localStorage.getItem("nombreArchivo");
        $.ajax({
            url:pagina,
            type:"delete",
            data:{"id":id,"nombreArchivo":archivo},
            dataType:"json",
            async:true
        }).done(function(resultado){
            CargarTabla();
            AlertSuccess(resultado.mensaje);
    
        }).fail(function(jqxhr){
            
            let respuesta=JSON.parse( jqxhr.responseText);
            
            AlertDanger(respuesta.mensaje);
        });
    }    
}

function Modificar(id)
{
    let pagina="BACKEND/telefono/modificar";
    let tel:any={};

    tel.id=id;
    tel.nombre=$("#txtNombre").val();
    tel.numero=$("#txtNumero").val();
    tel.direccion=$("#txtDireccion").val();
    tel.estado=$("#cboEstado").val();
    tel.categoria=$("#cboCategoria").val();
  



    let archivo="prueba";//localStorage.getItem("nombreArchivo");
    
    if(AdministrarValidaciones(tel))
    {
        let json={"cadenaJson":JSON.stringify(tel),"nombreArchivo":archivo};
        
        $.ajax({
            url:pagina,
            type:"put",
            data:json,
            dataType:"json",
        // contentType:false,
        // processData:false,
            async:true
        }).done(function(respuesta){
            AlertSuccess(respuesta.mensaje);
            CargarTabla();
            ArmarAgregar();
        }).fail(function(jqxhr){
            let respuesta=JSON.parse(jqxhr.responseText);
            AlertDanger(respuesta.mensaje);

        });
    }

    
}

function ArmarAgregar()
{    

    $("#txtNombre").val("");
    $("#txtNumero").val("");
    $("#txtDireccion").val("");
    $("#cboEstado").val("");
    $("#cboCategoria").val("");
    $("#btnAgregar").val("Agregar");
    $("#btnAgregar").attr("onclick","Agregar()");
}

function ArmarModificar(elemento,fila)
{ 
    $("#txtNombre").val(elemento.nombre);
    $("#txtNumero").val(elemento.numero);
    $("#txtDireccion").val(elemento.direccion);
    $("#cboEstado").val(elemento.estado);
    $("#cboCategoria").val(elemento.categoria);
    $("#btnAgregar").val("Modificar");
    $("#btnAgregar").attr("onclick","Modificar("+elemento.id+")");
    AlertWarning("<strong>Cuidado!!!</strong> Fila nº "+fila+" seleccionada para modificar");
}

function AdministrarValidaciones(tel)
{
    let aux:string="";
    let mensaje:string="";
    let contador=0;
    let flagError=false;
    let retorno=false;

    if(tel.numero !=null && tel.numero.length>0)
    {
        if(tel.nombre==null || tel.nombre.length==0 )
        {
            aux+="El Nombre\n";
            contador++;
        }
        
        if(tel.direccion==null || tel.direccion.length==0)
        {
            aux+="La Direccion\n";
            contador++;
            
        }
        if(tel.estado==null || tel.estado.length==0)
        {
            aux+="El Estado\n";
            contador++
            
        }
        if(tel.categoria==null || tel.categoria.length==0)
        {
            aux+="La Categoria\n";
            contador++;
            
        }

        if(contador>1)
        {
            mensaje+='No se han ingresado:\n\n' + aux + '\n\nDesea continuar?\n\n(Se colocara "Desconocido" en los espacios vacios)';
            flagError=true;
        }
        else
        {
            mensaje+='No se a ingresado:\n\n' + aux + '\n\nDesea continuar?\n\n(Se colocara "Desconocido" en el espacio vacio)';
            flagError=true;
        }    
     
     
    }
    else
    {
        AlertDanger("<strong>Error!!!</strong> No se puede ingresar un Telefono sin numero");
        retorno=false;
    }

    if(flagError)
    {
        retorno=confirm(mensaje);
    }


    return retorno;
}

