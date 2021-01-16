function SeleccionarFilaPrimary(numero, cantidad) {
    for (var i = 1; i <= cantidad; i++) {
        if (i != numero)
            $("#fila-" + i).removeClass("bg-primary");
    }
    ///no entra al else
    if (!$("#fila-" + numero).hasClass("bg-primary")) {
        $("#fila-" + numero).addClass("bg-primary");
    }
    else {
        $("#fila-" + numero).removeClass("bg-primary");
    }
}
function SeleccionarFilaModificar(numero, cantidad) {
    for (var i = 1; i <= cantidad; i++) {
        $("#fila-" + i).removeClass("bg-warning");
    }
    ///no entra al else
    if ($("#fila-" + numero).hasClass("bg-warning")) {
        $("#fila-" + numero).addClass("bg-warning");
    }
    else {
        $("#fila-" + numero).removeClass("bg-warning");
    }
}
//#region Alerts
//class=alert-dissmisable
function AlertSuccess(mensaje) {
    var html = '<div class="alert alert-success">' + mensaje + '</div>';
    $("#divAlert").html(html);
}
function AlertDanger(mensaje) {
    var html = '<div class="alert alert-danger alert-dissmisable">' + mensaje + '</div>';
    $("#divAlert").html(html);
}
function AlertWarning(mensaje) {
    var html = '<div class="alert alert-warning alert-dissmisable">' + mensaje + '</div>';
    $("#divAlert").html(html);
}
function AlertInforme(mensaje) {
    var html = '<div class="alert alert-info alert-dissmisable">' + mensaje + '</div>';
    $("#divInforme").html(html);
}
//#endregion
///<reference path="node_modules/@types/jquery/index.d.ts" />
///<reference path="./genericas.ts" />
function Agregar() {
    var tel = {};
    var pagina = "BACKEND/telefono/agregar";
    tel.nombre = $("#txtNombre").val();
    tel.numero = $("#txtNumero").val();
    tel.direccion = $("#txtDireccion").val();
    tel.estado = $("#cboEstado").val();
    tel.categoria = $("#cboCategoria").val();
    // if(AdministrarValidaciones(tel))
    {
        //let nombreArchivo=localStorage.getItem("nombreArchivo");
        var form = new FormData();
        form.append("cadenaJson", JSON.stringify(tel));
        form.append("nombreArchivo", "prueba");
        $.ajax({
            url: pagina,
            type: "post",
            data: form,
            dataType: "json",
            contentType: false,
            processData: false,
            async: true
        }).done(function (respuesta) {
            AlertSuccess(respuesta.mensaje);
            CargarTabla();
            ArmarAgregar();
        }).fail(function (jqxhr) {
            console.log(jqxhr.responseText);
            var respuesta = JSON.parse(jqxhr.responseText);
            AlertDanger(respuesta.mensaje);
        });
    }
}
//Deberia verse selecionada la fila que voy a modificar
function CargarTabla() {
    var nombreArchivo = "prueba"; //localStorage.getItem("nombreArchivo");
    var pagina = "BACKEND/telefono/traerTodos/" + nombreArchivo;
    $.ajax({
        url: pagina,
        type: "get",
        dataType: "json",
        //contentType:false,
        //processData:false,
        async: true
    }).done(function (respuesta) {
        if (respuesta.exito) {
            if (respuesta.listaTelefonos == false) {
                AlertWarning(respuesta.mensaje);
            }
            else {
                var fila_1 = 0;
                var listaTelefonos = respuesta.listaTelefonos;
                var total_1 = {};
                total_1.telefonos = listaTelefonos.length;
                total_1.nombre = 0;
                total_1.numero = 0;
                total_1.direccion = 0;
                total_1.estado = 0;
                total_1.categoria = 0;
                var archivo = "prueba"; //localStorage.getItem("nombreArchivo");
                var html_1 = '<h1 style="padding-top: 2%;">' + archivo + '</h1> ';
                html_1 += '<div class="table-responsive">';
                html_1 += '<table class="table table-sm table-dark table-hover">';
                html_1 += '<tr><th></th><th>Nº</th><th class="text-center">Nombre</th><th class="text-center">Numero</th><th class="text-center">Direccion</th>';
                html_1 += '<th class="text-center">Estado</th><th class="text-center">Categoria</th>';
                html_1 += '<th class="text-center">Modificar</th><th class="text-center">Eliminar</th></tr>';
                listaTelefonos.forEach(function (element) {
                    fila_1++;
                    total_1.nombre += parseInt(element.nombre);
                    total_1.numero += parseInt(element.numero);
                    total_1.direccion += parseInt(element.direccion);
                    total_1.estado += parseInt(element.estado);
                    html_1 += '<tr onclick="SeleccionarFilaPrimary(' + fila_1 + "," + total_1.telefonos + ')" id="fila-' + fila_1 + '" ><td></td>';
                    html_1 += '<td class="text-center">' + fila_1 + '</td><td class="text-center">' + element.nombre + '</td>' + '<td class="text-center">' + element.numero + '</td>';
                    html_1 += '<td class="text-center">' + element.direccion + '</td>' + '<td class="text-center">' + element.estado + '</td>';
                    html_1 += '<td class="text-center">' + element.categoria + '</td>';
                    html_1 += "<td><input type='button' value='Modificar' class='btn btn-warning' onclick='ArmarModificar(" + JSON.stringify(element) + "," + fila_1 + ")'></td>";
                    html_1 += '<td><input type="button" value="Eliminar" class="btn btn-danger" onclick="Eliminar(' + element.id + "," + fila_1 + ')"></td></tr>';
                });
                html_1 += '<tr><td>Total:</td><td class="text-left" colspan="2">' + total_1.telefonos + ' telefonos</td>';
                html_1 += '<td class="text-center">' + total_1.estado + '</td></tr></table></div>';
                //html+='<input type="button" value="Generar Informe" class="btn btn-primary" id="btnInforme">';
                //html+='<div id="divInforme" class="mt-2"></div>';
                $("#tablaTel").html(html_1);
                // $("#btnInforme").attr("onclick","GenerarInforme("+JSON.stringify(total)+")");
                //GenerarInforme(total);
            }
        }
    }).fail(function (jqxhr) {
        console.log(jqxhr.responseText);
    });
}
function GenerarInforme(total) {
    // total=JSON.parse(total);
    console.log(total);
    total.minutos = total.horas.split(":")[1];
    total.horas = total.horas.split(":")[0];
    if (total.minutos == "00") {
        AlertInforme("<strong>Informe: </strong>" + "</br>" +
            "nombre: " + total.nombre + "</br>" +
            "numero: " + total.numero + "</br>" +
            "Horas: " + total.horas + "</br>" +
            "direccion: " + total.direccion + "</br>" +
            "estado: " + total.estado);
    }
    else {
        AlertInforme("<strong>Informe: </strong>" + "</br>" +
            "nombre: " + total.nombre + "</br>" +
            "numero: " + total.numero + "</br>" +
            "Horas: " + total.horas + "</br>" +
            "direccion: " + total.direccion + "</br>" +
            "estado: " + total.estado + "</br>" + "</br>" +
            "Le han sobrado " + total.minutos + "min.");
    }
}
//Cambiar confirm por ventana Modal
function Eliminar(id, fila) {
    var pagina = "BACKEND/telefono/borrar";
    if (confirm("Desea eliminar la fila nº" + fila)) {
        var archivo = "prueba"; //localStorage.getItem("nombreArchivo");
        $.ajax({
            url: pagina,
            type: "delete",
            data: { "id": id, "nombreArchivo": archivo },
            dataType: "json",
            async: true
        }).done(function (resultado) {
            CargarTabla();
            AlertSuccess(resultado.mensaje);
        }).fail(function (jqxhr) {
            var respuesta = JSON.parse(jqxhr.responseText);
            AlertDanger(respuesta.mensaje);
        });
    }
}
function Modificar(id) {
    var tel = {};
    var pagina = "BACKEND/telefono/modificar";
    tel.id = id;
    tel.nombre = $("#txtNombre").val();
    tel.numero = $("#txtNumero").val();
    tel.horas = $("#txtHoras").val();
    tel.direccion = $("#txtDireccion").val();
    tel.estado = $("#txtEstado").val();
    var archivo = "prueba"; //localStorage.getItem("nombreArchivo");
    //    if(AdministrarValidaciones(tel))
    {
        var json = { "cadenaJson": JSON.stringify(tel), "nombreArchivo": archivo };
        $.ajax({
            url: pagina,
            type: "put",
            data: json,
            dataType: "json",
            // contentType:false,
            // processData:false,
            async: true
        }).done(function (respuesta) {
            AlertSuccess(respuesta.mensaje);
            CargarTabla();
            ArmarAgregar();
        }).fail(function (jqxhr) {
            console.log(jqxhr.responseText);
            var respuesta = JSON.parse(jqxhr.responseText);
            AlertDanger(respuesta.mensaje);
        });
    }
}
function ArmarAgregar() {
    $("#txtNombre").val("");
    $("#txtNumero").val("");
    $("#txtDireccion").val("");
    $("#cboEstado").val("");
    $("#cboCategoria").val("");
    $("#btnAgregar").val("Agregar");
    $("#btnAgregar").attr("onclick", "Agregar()");
}
function ArmarModificar(elemento, fila) {
    $("#txtNombre").val(elemento.nombre);
    $("#txtNumero").val(elemento.numero);
    $("#txtDireccion").val(elemento.direccion);
    $("#cboEstado").val(elemento.estado);
    $("#cboCategoria").val(elemento.categoria);
    $("#btnAgregar").val("Modificar");
    $("#btnAgregar").attr("onclick", "Modificar(" + elemento.id + ")");
    AlertWarning("<strong>Cuidado!!!</strong> Fila nº " + fila + " seleccionada para modificar");
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
