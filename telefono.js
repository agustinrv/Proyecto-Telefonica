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
    if (AdministrarValidaciones(tel)) {
        var nombreArchivo = localStorage.getItem("nombreArchivo");
        var form = new FormData();
        form.append("cadenaJson", JSON.stringify(tel));
        form.append("nombreArchivo", nombreArchivo);
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
    var nombreArchivo = localStorage.getItem("nombreArchivo");
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
                var total_1 = CalcularTotales(listaTelefonos);
                var archivo = localStorage.getItem("nombreArchivo");
                var color_1 = "";
                var html_1 = '<h1 class="text-white pt-2"">' + archivo + '</h1>';
                html_1 += '<span class="fas fa-circle text-success ">"Se Puede"</span>';
                html_1 += '<span class="fas fa-circle text-warning ml-2">"Revisita"</span>';
                html_1 += '<span class="fas fa-circle text-danger ml-2">"No llamar"</span>';
                html_1 += '<div class="table-responsive">';
                html_1 += '<table class="table table-sm table-dark table-hover">';
                html_1 += '<tr><th></th><th class="pl-4">Nº</th><th class="text-center">Nombre</th><th class="text-center">Numero</th><th class="text-center">Direccion</th>';
                html_1 += '<th class="text-center">Estado</th><th class="text-center">Categoria</th>';
                html_1 += '<th class="pl-3">Modificar</th><th class="pl-3">Eliminar</th></tr>';
                listaTelefonos.forEach(function (element) {
                    fila_1++;
                    total_1.nombre += parseInt(element.nombre);
                    total_1.numero += parseInt(element.numero);
                    total_1.direccion += parseInt(element.direccion);
                    total_1.estado += parseInt(element.estado);
                    color_1 = PrepararColor(element.estado);
                    html_1 += '<tr onclick="SeleccionarFilaPrimary(' + fila_1 + "," + total_1.telefonos + ')" id="fila-' + fila_1 + '" ><td></td>';
                    html_1 += '<td class="text-center">' + fila_1 + '</td><td class="text-center">' + element.nombre + '</td>' + '<td class="text-center">' + element.numero + '</td>';
                    html_1 += '<td class="text-center">' + element.direccion + '</td>';
                    html_1 += '<td class="text-center"><span class="fas fa-circle ' + color_1 + '"></span></td>';
                    html_1 += '<td class="text-center">' + element.categoria + '</td>';
                    html_1 += "<td><input type='button' value='Modificar' class='btn btn-warning' onclick='ArmarModificar(" + JSON.stringify(element) + "," + fila_1 + ")'></td>";
                    html_1 += '<td><input type="button" value="Eliminar" class="btn btn-danger" onclick="Eliminar(' + element.id + "," + fila_1 + ')"></td></tr>';
                });
                html_1 += '<tr><td>Total:</td><td class="text-left pl-3" colspan="2">' + total_1.telefonos + ' telefonos</td></tr></table></div>';
                html_1 += "<input type='button' value='Generar Informe' class='btn btn-primary' id='btnInforme' onclick='GenerarInforme(" + JSON.stringify(total_1) + ")'>";
                html_1 += '<div id="divInforme" class="mt-2"></div>';
                $("#tablaTel").html(html_1);
            }
        }
    }).fail(function (jqxhr) {
        console.log(jqxhr.responseText);
    });
}
function PrepararColor(estado) {
    var retorno = 'text-dark';
    switch (estado.toLowerCase()) {
        case "se puede":
            retorno = 'text-success';
            break;
        case "no llamar":
            retorno = 'text-danger';
            break;
        case "revisita":
            retorno = 'text-warning';
            break;
        default:
            break;
    }
    return retorno;
}
function CalcularTotales(listaTelefonos) {
    var total = {};
    total.telefonos = listaTelefonos.length;
    total.casas = 0;
    total.edificios = 0;
    total.negocios = 0;
    total.sePuede = 0;
    total.noLlamar = 0;
    total.revisitas = 0;
    ///Categoria
    var categorias = listaTelefonos.map(function (value, index, array) {
        return value.categoria;
    });
    total.casas = categorias.filter(function (value, index, array) {
        return value.toLowerCase() == "casa";
    }).length;
    total.edificios = categorias.filter(function (value, index, array) {
        return value.toLowerCase() == "edificio";
    }).length;
    total.negocios = categorias.filter(function (value, index, array) {
        return value.toLowerCase() == "negocio";
    }).length;
    ///Estado
    var estados = listaTelefonos.map(function (value, index, array) {
        return value.estado;
    });
    total.sePuede = estados.filter(function (value, index, array) {
        return value.toLowerCase() == "se puede";
    }).length;
    total.noLlamar = estados.filter(function (value, index, array) {
        return value.toLowerCase() == "no llamar";
    }).length;
    total.revisitas = estados.filter(function (value, index, array) {
        return value.toLowerCase() == "revisita";
    }).length;
    return total;
}
function GenerarInforme(total) {
    // total=JSON.parse(total);
    console.log(total);
    AlertInforme("<strong>Informe: </strong>" + "</br>" +
        "Total de Numeros: " + total.telefonos + "</br>" +
        "Total de Casas: " + total.casas + "</br>" +
        "Total de Edificios: " + total.edificios + "</br>" +
        "Total de Negocios: " + total.negocios + "</br>" +
        "Total de Numeros que se pueden llamar: " + total.sePuede + "</br>" + //"total de 'se puede' "
        "Total de No Llamar: " + total.noLlamar + "</br>" +
        "Total de Revisitas: " + total.revisitas + "</br>" + "</br>");
}
//Cambiar confirm por ventana Modal
function Eliminar(id, fila) {
    var pagina = "BACKEND/telefono/borrar";
    if (confirm("Desea eliminar la fila nº" + fila)) {
        var archivo = localStorage.getItem("nombreArchivo");
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
    var pagina = "BACKEND/telefono/modificar";
    var tel = {};
    tel.id = id;
    tel.nombre = $("#txtNombre").val();
    tel.numero = $("#txtNumero").val();
    tel.direccion = $("#txtDireccion").val();
    tel.estado = $("#cboEstado").val();
    tel.categoria = $("#cboCategoria").val();
    var nombreArchivo = localStorage.getItem("nombreArchivo");
    if (AdministrarValidaciones(tel)) {
        var json = { "cadenaJson": JSON.stringify(tel), "nombreArchivo": nombreArchivo };
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
            var respuesta = JSON.parse(jqxhr.responseText);
            AlertDanger(respuesta.mensaje);
        });
    }
}
function ArmarAgregar() {
    $("#txtNombre").val("");
    $("#txtNumero").val("");
    $("#txtDireccion").val("");
    $("#cboEstado").val("---");
    $("#cboCategoria").val("---");
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
function AdministrarValidaciones(tel) {
    var aux = "";
    var mensaje = "";
    var contador = 0;
    var flagError = false;
    var retorno = true;
    if (tel.numero != null && tel.numero.length > 0) {
        if (tel.nombre == null || tel.nombre.length == 0) {
            aux += "El Nombre\n";
            contador++;
        }
        if (tel.direccion == null || tel.direccion.length == 0) {
            aux += "La Direccion\n";
            contador++;
        }
        if (tel.estado == null || tel.estado.length == 0) {
            aux += "El Estado\n";
            contador++;
        }
        if (tel.categoria == null || tel.categoria.length == 0) {
            aux += "La Categoria\n";
            contador++;
        }
        if (contador > 1) {
            mensaje += 'No se han ingresado:\n\n' + aux + '\n\nDesea continuar?\n\n(Se colocara "Desconocido" en los espacios vacios)';
            flagError = true;
        }
        else if (contador == 1) {
            mensaje += 'No se a ingresado:\n\n' + aux + '\n\nDesea continuar?\n\n(Se colocara "Desconocido" en el espacio vacio)';
            flagError = true;
        }
    }
    else {
        AlertDanger("<strong>Error!!!</strong> No se puede ingresar un Telefono sin numero");
        retorno = false;
    }
    if (flagError) {
        retorno = confirm(mensaje);
    }
    return retorno;
}
