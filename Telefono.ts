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
    

    
   // if(AdministrarValidaciones(tel))
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
                let total:any={};

                total.telefonos=listaTelefonos.length;
                total.nombre=0;
                total.numero=0;
                total.direccion=0;
                total.estado=0;
                total.categoria=0;
                let archivo= "prueba" //localStorage.getItem("nombreArchivo");
                
                let html='<h1 style="padding-top: 2%;">'+ archivo +'</h1> ';
                html+='<div class="table-responsive">';
                html+='<table class="table table-sm table-dark table-hover">';
                html+='<tr><th></th><th>Nº</th><th class="text-center">Nombre</th><th class="text-center">Numero</th><th class="text-center">Direccion</th>';
                html+='<th class="text-center">Estado</th><th class="text-center">Categoria</th>';
                html+='<th class="text-center">Modificar</th><th class="text-center">Eliminar</th></tr>';
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
                
                html+='<tr><td>Total:</td><td class="text-left" colspan="2">'+total.telefonos+' telefonos</td>';
                html+='<td class="text-center">'+total.estado+'</td></tr></table></div>';            
                //html+='<input type="button" value="Generar Informe" class="btn btn-primary" id="btnInforme">';
                //html+='<div id="divInforme" class="mt-2"></div>';

                $("#tablaTel").html(html);
               // $("#btnInforme").attr("onclick","GenerarInforme("+JSON.stringify(total)+")");
                //GenerarInforme(total);



                
            }
        }


    }).fail(function(jqxhr){
        console.log(jqxhr.responseText);
    });
    
}
function GenerarInforme(total)
{
   // total=JSON.parse(total);
   console.log(total);
    total.minutos=total.horas.split(":")[1];
    total.horas=total.horas.split(":")[0];

    if(total.minutos=="00")
    {
        AlertInforme("<strong>Informe: </strong>"+"</br>"+
        "nombre: " +  total.nombre + "</br>"+
        "numero: " + total.numero + "</br>"+
        "Horas: " + total.horas + "</br>"+
        "direccion: " + total.direccion + "</br>"+
        "estado: " + total.estado);
    }
    else
    {
        AlertInforme("<strong>Informe: </strong>"+"</br>"+
        "nombre: " +  total.nombre + "</br>"+
        "numero: " + total.numero + "</br>"+
        "Horas: " + total.horas + "</br>"+
        "direccion: " + total.direccion + "</br>"+
        "estado: " + total.estado+"</br>"+"</br>"+
        "Le han sobrado "+total.minutos + "min.");
    }
    
                

    
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
    let tel:any={};
    let pagina="BACKEND/telefono/modificar";
    tel.id=id;
    tel.nombre=$("#txtNombre").val();
    tel.numero=$("#txtNumero").val();
    tel.horas=$("#txtHoras").val();
    tel.direccion=$("#txtDireccion").val();
    tel.estado=$("#txtEstado").val();
    let archivo="prueba";//localStorage.getItem("nombreArchivo");
    
//    if(AdministrarValidaciones(tel))
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
            console.log(jqxhr.responseText);
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
/*
function AdministrarValidaciones(tel)
{
    let flagHoras=true;
    let retorno=false;

    if(tel.numero.length==0  || tel.horas=="00:00")
    {
        flagHoras=false;
    }

    if(!flagHoras)
    {
        AlertDanger('<strong>Error!!!</strong> El campo <strong>"Horas"</strong> es obligatorio');
    }
    else
    {
        retorno=true;
    }

    return retorno;
}

*/