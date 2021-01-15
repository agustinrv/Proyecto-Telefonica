function SeleccionarFilaPrimary(numero,cantidad)
{

    for(let i=1;i<=cantidad;i++)
    {
        if(i!=numero)
        $("#fila-"+i).removeClass("bg-primary");
    }
///no entra al else
    if(!$("#fila-"+numero).hasClass("bg-primary"))
    {
        $("#fila-"+numero).addClass("bg-primary");
    }
    else
    {
        $("#fila-"+numero).removeClass("bg-primary");
    }

}

function SeleccionarFilaModificar(numero,cantidad)
{

    for(let i=1;i<=cantidad;i++)
    {
        
        $("#fila-"+i).removeClass("bg-warning");
    }
///no entra al else
    if($("#fila-"+numero).hasClass("bg-warning"))
    {
        $("#fila-"+numero).addClass("bg-warning");
    }
    else
    {
        $("#fila-"+numero).removeClass("bg-warning");
    }

}



//#region Alerts
//class=alert-dissmisable
function AlertSuccess(mensaje)
{
    let html='<div class="alert alert-success">'+mensaje+'</div>';
    $("#divAlert").html(html);
}

function AlertDanger(mensaje)
{
    let html='<div class="alert alert-danger alert-dissmisable">'+mensaje+'</div>';
    $("#divAlert").html(html);
}

function AlertWarning(mensaje)
{
    let html='<div class="alert alert-warning alert-dissmisable">'+mensaje+'</div>';
    $("#divAlert").html(html);
}

function AlertInforme(mensaje)
{
    let html='<div class="alert alert-info alert-dissmisable">'+mensaje+'</div>';
    $("#divInforme").html(html);
}


//#endregion