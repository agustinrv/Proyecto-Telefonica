///<reference path="node_modules/@types/jquery/index.d.ts" />
///<reference path="./genericas.ts" />





function CargarTabla()
{    
    let pagina="BACKEND/territorio/traerTodos";
    $.ajax({
        url:pagina,
        type:"get",
        dataType:"json",
        //contentType:false,
      //  processData:false,
        async:true
    }).done(function(respuesta){

        let fila=0;       
        //let listaArchivos=OrdenarPorID(respuesta,true);
        let listaArchivos=respuesta;
        let total:any={};

        CargarCbo(listaArchivos);
        
        
        total.archivos=listaArchivos.length;
        let nombreArchivo;
        let html='<h1 style="padding-top: 2%;" class="text-white">Archivos</h1> ';
        html+='<div class="table-responsive">';
        html+='<table class="table table-sm table-dark table-hover">';
        html+='<tr><th></th><th>Nº</th><th class="text-center">Territorio</th><th>Fecha Mod.</th>';
        html+='<th class="text-center">Abrir</th><th class="pl-3">Eliminar</th><th class="pl-3">Descargar</th></tr>';
        listaArchivos.forEach(element => {
            fila++;
            nombreArchivo=element.nombre + ".json";
            html+='<tr onclick="SeleccionarFilaPrimary('+fila+','+total.archivos+')" id="fila-'+ fila +'"><td></td><td>'+fila+'</td><td class="text-center">'+element.nombre+'</td><td>'+element.fecha+'</td>';
            html+='<td><input type="button" value="Abrir" class="btn btn-success btn-block" onclick=Abrir("'+element.nombre+'")></td>';
            html+='<td><input type="button" value="Eliminar" class="btn btn-danger " onclick=Eliminar("'+element.nombre+'")></td>';
            html+='<td><a href="BACKEND/archivos/'+nombreArchivo+'" class="btn btn-info" download="'+nombreArchivo+'">Descargar</a></td></tr>';
        });
        html+='<tr><td>Total:</td><td class="text-left" colspan="2">'+total.archivos+' Territorios</td>';
        html+='</table></div>';
        html+='<input type="button" value="Generar PDF" class="btn btn-primary" id="btnPdf">';
        $("#tablaTerri").html(html);

        //GenerarInforme(total);
    }).fail(function(jqxhr){
        let respuesta=JSON.parse(jqxhr.responseText);
        AlertDanger(respuesta.mensaje);
    });
    
}

function AgregarTelefono()
{
    let tel:any={};
    let pagina="BACKEND/telefono/agregar";

    tel.nombre=$("#txtNombre").val();
    tel.numero=$("#txtNumero").val();
    tel.direccion=$("#txtDireccion").val();
    tel.estado=$("#cboEstado").val();
    tel.categoria=$("#cboCategoria").val();
    let nombreArchivo:any=$("#cboTerritorios").val();

    
    if(AdministrarValidaciones(tel))
    {
        let form = new FormData();
        form.append("cadenaJson",JSON.stringify(tel));
        form.append("nombreArchivo",nombreArchivo);

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

function ArmarAgregar()
{    

    $("#txtNombre").val("");
    $("#txtNumero").val("");
    $("#txtDireccion").val("");
    $("#cboEstado").val("---");
    $("#cboCategoria").val("---");
    $("#btnAgregar").val("Agregar");
    $("#btnAgregar").attr("onclick","Agregar()");
}


function AdministrarValidaciones(tel)
{
    let aux:string="";
    let mensaje:string="";
    let contador=0;
    let flagError=false;
    let retorno=true;

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
        else if(contador==1)
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

function CargarCbo(array){


    let listaArchivos=new Array();
    let cadena="";

    for (var i = 0; i < array.length; i++) {

        let repetido = false;
        for (var z = 0; z < listaArchivos.length; z++) {
            if (listaArchivos[z].nombre == array[i].nombre) {
                repetido = true;
                break;
            }
        }

        if (!repetido) {
            listaArchivos.push(array[i]);
            cadena += '<option value="'+array[i].nombre+'">' + array[i].nombre + '</opcion>';
        }
    }
    
    $("#cboTerritorios").html(cadena);
}



function Agregar()
{
    let nuevoTerri:any=$("#txtNuevo").val();
    let pagina="BACKEND/territorio/agregar";
    
    let form = new FormData();
    form.append("cadenaJson",nuevoTerri);

    $.ajax({
        url:pagina,
        type:"post",
        data:form,
        dataType:"json",
        contentType:false,
        processData:false,
        async:true
    }).done(function(respuesta){
        CargarTabla();
        AlertSuccess(respuesta.mensaje);
    }).fail(function(jqxhr){
        let respuesta=JSON.parse(jqxhr.responseText);
        AlertDanger(respuesta.mensaje);
    });
}

function Eliminar(nombreArchivo)
{
    let pagina="./BACKEND/territorio/borrar";
    if(confirm("Desea eliminar el territorio: "+nombreArchivo))
    {
        $.ajax({
            url:pagina,
            type:"delete",
            data:{"nombreArchivo":nombreArchivo},
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

function Abrir(nombreArchivo)
{

    $("#archivo").val(nombreArchivo);
    let form:HTMLFormElement=<HTMLFormElement>document.getElementById("formArchivo");
    localStorage.setItem("nombreArchivo",nombreArchivo);
    form.submit();
}




function OrdenarPorID(lista,asendente:boolean)
{
    let i=0;
    let j=0;
    let aux=0;

    if(asendente)
    {
        for(i=0;i<lista.length-1;i++)
        {
            for(j=i+1;j<lista.length;j++)
            {
                if(lista[i].id>lista[j].id)
                {
                    aux=lista[i];
                    lista[i]=lista[j];
                    lista[j]=aux;
                }
            }
        }
    }
    else
    {
        for(i=0;i<lista.length-1;i++)
        {
            for(j=i+1;j<lista.length;j++)
            {
                if(lista[i].id<lista[j].id)
                {
                    aux=lista[i];
                    lista[i]=lista[j];
                    lista[j]=aux;
                }
            }
        }
    }

    return lista;
}



