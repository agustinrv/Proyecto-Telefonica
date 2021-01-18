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



