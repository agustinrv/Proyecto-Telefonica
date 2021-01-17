///<reference path="node_modules/@types/jquery/index.d.ts" />
///<reference path="./genericas.ts" />
//Falta boton descargar

///NO AVABZAR HASTA ARMAR ALGO EN EL BACKEND
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
        //let listaMeses=OrdenarPorID(respuesta,true);
        let total:any={};

        total.meses=listaMeses.length;

        let html='<h1 style="padding-top: 2%;">Año Actual</h1> ';
        html+='<div class="table-responsive">';
        html+='<table class="table table-sm table-dark table-hover">';
        html+='<tr><th ></th><th>Nº</th><th>Mes</th><th class="h6">Fecha Mod.</th>';
        html+='<th class="text-center">Abrir</th><th class="pl-3">Eliminar</th><th class="pl-3">Descargar</th></tr>';
        listaMeses.forEach(element => {
            fila++;
            html+='<tr onclick="SeleccionarFilaPrimary('+fila+','+total.meses+')" id="fila-'+ fila +'"><td></td><td>'+fila+'</td><td>'+element.nombre+'</td><td>'+element.fecha+'</td>';
            html+='<td><input type="button" value="Abrir" class="btn btn-success btn-block" onclick=Abrir("'+element.nombre+'")></td>';
            html+='<td><input type="button" value="Eliminar" class="btn btn-danger " onclick=Eliminar("'+element.nombre+'")></td>';
            html+='<td><a href="BACKEND/Meses/'+element.nombre+'" class="btn btn-info" download="'+element.nombre+'">Descargar</a></td></tr>';
        });
        html+='<tr><td>Total:</td><td class="text-left" colspan="2">'+total.meses+' Meses</td>';
        html+='</table></div>';
        html+='<input type="button" value="Generar PDF" class="btn btn-primary" id="btnPdf">';
        $("#tablaMes").html(html);
    
        //GenerarInforme(total);
    }).fail(function(jqxhr){
        let respuesta=JSON.parse(jqxhr.responseText);
        AlertDanger(respuesta.mensaje);
    });
    
}

function Agregar()
{
    let nuevoMes:any=$("#cboMeses").val();
    let pagina="BACKEND/mes/agregar";
    
    let form = new FormData();
    form.append("cadenaJson",nuevoMes);

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
    let pagina="./BACKEND/mes/borrar";
    if(confirm("Desea eliminar el archivo: "+nombreArchivo))
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
    form.submit();
    localStorage.setItem("nombreArchivo",nombreArchivo);
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



