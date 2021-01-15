///<reference path="node_modules/@types/jquery/index.d.ts" />
///<reference path="./genericas.ts" />





function Agregar()
{
    let dia:any={};
    let pagina="BACKEND/dia/agregar";
    dia.fecha=$("#dateFecha").val();
    dia.publicaciones=$("#txtPublicaciones").val();
    dia.videos=$("#txtVideos").val();
    dia.horas=$("#txtHoras").val();
    dia.revisitas=$("#txtRevisitas").val();
    dia.estudios=$("#txtEstudios").val();

    
    if(AdministrarValidaciones(dia))
    {
        let nombreArchivo=localStorage.getItem("nombreArchivo");
        let form = new FormData();
        form.append("cadenaJson",JSON.stringify(dia));
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


//Deberia verse selecionada la fila que voy a modificar

function CargarTabla()
{
    let nombreArchivo=localStorage.getItem("nombreArchivo");

    let pagina="BACKEND/dia/traerTodos/" + nombreArchivo;
    
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
            if(respuesta.listaDias==false)
            {
                AlertWarning(respuesta.mensaje)
            }
            else
            {
                let fila=0;
                let listaDias=respuesta.listaDias;
                let total:any={};
                let arrayHoras=Array();

                total.dias=listaDias.length;
                total.publicaciones=0;
                total.videos=0;
                total.revisitas=0;
                total.estudios=0;
                let archivo= localStorage.getItem("nombreArchivo");
                
                let html='<h1 style="padding-top: 2%;">'+ archivo +'</h1> ';
                html+='<div class="table-responsive">';
                html+='<table class="table table-sm table-dark table-hover">';
                html+='<tr><th></th><th>Nº</th><th class="text-center">Fecha</th><th class="text-center">Publicaciones</th><th class="text-center">Videos</th><th class="text-center">Horas</th>';
                html+='<th class="text-center">Revisitas</th><th class="text-center">Estudios</th><th>Modificar</th><th>Eliminar</th></tr>';
                listaDias.forEach(element => {
                    fila++;
                    total.publicaciones+=parseInt(element.publicaciones);
                    total.videos+=parseInt(element.videos);
                    arrayHoras.push(element.horas);
                    total.revisitas+=parseInt(element.revisitas);
                    total.estudios+=parseInt(element.estudios);

                    html+='<tr onclick="SeleccionarFilaPrimary('+fila+","+total.dias+')" id="fila-'+fila+'" ><td></td>';
                    html+='<td class="text-center">'+fila+'</td><td class="text-center">'+element.fecha+'</td>'+'<td class="text-center">'+element.publicaciones+'</td>';
                    html+='<td class="text-center">'+element.videos+'</td>'+'<td class="text-center">'+element.horas+'</td>';
                    html+='<td class="text-center">'+element.revisitas+'</td><td class="text-center">'+element.estudios+'</td>';    
                    html+="<td><input type='button' value='Modificar' class='btn btn-warning' onclick='ArmarModificar("+JSON.stringify(element) +","+fila+")'></td>";
                    html+='<td><input type="button" value="Eliminar" class="btn btn-danger" onclick="Eliminar('+element.id+","+fila+')"></td></tr>';
                });
                total.horas=CalcularTotalHoras(arrayHoras);
                html+='<tr><td>Total:</td><td class="text-left" colspan="2">'+total.dias+' Dias</td><td class="text-center">'+total.publicaciones+'</td>';
                html+='<td class="text-center">'+total.videos+'</td><td class="text-center">'+total.horas+'</td>';
                html+='<td class="text-center">'+total.revisitas+'</td><td class="text-center">'+total.estudios+'</td></tr></table></div>';            
                html+='<input type="button" value="Generar Informe" class="btn btn-primary" id="btnInforme">';
                html+='<div id="divInforme" class="mt-2"></div>';

                $("#tablaMes").html(html);
                $("#btnInforme").attr("onclick","GenerarInforme("+JSON.stringify(total)+")");
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
        "Publicaciones: " +  total.publicaciones + "</br>"+
        "Videos: " + total.videos + "</br>"+
        "Horas: " + total.horas + "</br>"+
        "Revisitas: " + total.revisitas + "</br>"+
        "Estudios: " + total.estudios);
    }
    else
    {
        AlertInforme("<strong>Informe: </strong>"+"</br>"+
        "Publicaciones: " +  total.publicaciones + "</br>"+
        "Videos: " + total.videos + "</br>"+
        "Horas: " + total.horas + "</br>"+
        "Revisitas: " + total.revisitas + "</br>"+
        "Estudios: " + total.estudios+"</br>"+"</br>"+
        "Le han sobrado "+total.minutos + "min.");
    }
    
                

    
}


function CalcularTotalHoras(arrayHoras)
{
    let aux=new Date();
        aux.setHours(0,0);
    let horas=0;
    let minutos=0;
    let retorno="00:00";

    horas=arrayHoras.map(function(element,index,array){
        return parseInt(element.split(":")[0]);
    }).reduce(function(anterior,siguiente,index,array){
        return anterior+ siguiente;
    });

    minutos=arrayHoras.map(function(element,index,array){
        return parseInt(element.split(":")[1]);
    }).reduce(function(anterior,siguiente,index,array){
        return anterior+ siguiente;
    });

    aux.setMinutes(minutos);
    if(aux.getMinutes().toString().length==1)
    {
        retorno=horas+aux.getHours() + ":0" + aux.getMinutes();
    }
    else
    {
        retorno=horas+aux.getHours() + ":" + aux.getMinutes();
    }

    return retorno;
}


//Cambiar confirm por ventana Modal

function Eliminar(id,fila)
{
    let pagina="BACKEND/dia/borrar";

    if(confirm("Desea eliminar la fila nº" + fila))
    {
        let archivo= localStorage.getItem("nombreArchivo");
        $.ajax({
            url:pagina,
            type:"delete",
            data:{"id":id,"archivo":archivo},
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
    let dia:any={};
    let pagina="BACKEND/dia/modificar";
    dia.id=id;
    dia.fecha=$("#dateFecha").val();
    dia.publicaciones=$("#txtPublicaciones").val();
    dia.videos=$("#txtVideos").val();
    dia.horas=$("#txtHoras").val();
    dia.revisitas=$("#txtRevisitas").val();
    dia.estudios=$("#txtEstudios").val();
    dia.archivo=localStorage.getItem("nombreArchivo");
    
    if(AdministrarValidaciones(dia))
    {
        let json={"cadenaJson":dia}
        
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
    $("#dateFecha").val("");
    $("#txtPublicaciones").val("");
    $("#txtVideos").val("");
    $("#txtHoras").val("00:00");
    $("#txtRevisitas").val("");
    $("#txtEstudios").val("");
    $("#btnAgregar").val("Agregar");
    $("#btnAgregar").attr("onclick","Agregar()");
}

function ArmarModificar(elemento,fila)
{ 
    $("#dateFecha").val(elemento.fecha);
    $("#txtPublicaciones").val(elemento.publicaciones);
    $("#txtVideos").val(elemento.videos);
    $("#txtHoras").val(elemento.horas);
    $("#txtRevisitas").val(elemento.revisitas);
    $("#txtEstudios").val(elemento.estudios);
    $("#btnAgregar").val("Modificar");
    $("#btnAgregar").attr("onclick","Modificar("+elemento.id+")");
    AlertWarning("<strong>Cuidado!!!</strong> Fila nº "+fila+" seleccionada para modificar");
}

function AdministrarValidaciones(dia)
{
    let flagHoras=true;
    let retorno=false;

    if(dia.horas.length==0 || dia.horas=="00:00")
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

