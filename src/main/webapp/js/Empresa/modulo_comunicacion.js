/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global RequestPOST, DEPENDENCIA, Vue, perfil, sesion_cookie, Swal, directorio_completo */

let array_llamar = new Array();
agregar_menu("Comunicación");
Vue.component("multiselect", window.VueMultiselect.default);

if (perfil !== "" && perfil !== null && perfil !== undefined) {
    $("#profile-nombre").text(perfil.nombre + " " + perfil.apellido_paterno + " " + perfil.apellido_materno);
    $("#profile-img").css({
        "background": "url('" + perfil.img + "')",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
} else {
    RequestPOST("/API/cuenta360/empresas360/perfil/empleado", {
        "id360": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).id_usuario
    }).then(function (response) {
        if (response.success) {
            perfil = response;
            $("#profile-nombre").text(perfil.nombre + " " + perfil.apellido_paterno + " " + perfil.apellido_materno);
            $("#profile-img").css({
                "background": "url('" + perfil.img + "')",
                "background-size": "cover",
                "background-position": "center",
                "background-repeat": "no-repeat"
            });
        }
    });
}
function agregar_chat_enviado(mensaje) {
    console.log("mensaje empresarial para: " + mensaje.to_id360);
    /*
     * 
     * revisar que tengamos el chat del usuario que nos escribe
     */

    if (!$("#profile_chat" + mensaje.to_id360).length) {
        RequestPOST("/API/get/perfil360", {
        id360:mensaje.to_id360
        }).then((response) => {
            console.log(response);
            contacto_chat(response);
            agregar_chat(mensaje, response,"replies");
        });
    } else {
        let user = null;
        $.each(directorio_completo, (i) => {
            if (mensaje.to_id360 === directorio_completo[i].id360) {
                user = directorio_completo[i];
                return false;
            }
        });
        agregar_chat(mensaje,user,"replies");
    }

}
function recibir_chat(mensaje) {
    console.log("mensaje empresarial para: " + mensaje.to_id360);
    /*
     * 
     * revisar que tengamos el chat del usuario que nos escribe
     */

    if (!$("#profile_chat" + mensaje.id360).length) {
        RequestPOST("/API/get/perfil360", mensaje).then((response) => {
            console.log(response);
            contacto_chat(response);
            agregar_chat(mensaje, response,"send");
        });
    } else {
        let user = null;
        $.each(directorio_completo, (i) => {
            if (mensaje.id360 === directorio_completo[i].id360) {
                user = directorio_completo[i];
                return false;
            }
        });
        agregar_chat(mensaje,user,"send");
    }

}
function agregar_chat(msj,user,type) {
    console.log(msj);
    console.log(user);
    let mensaje = msj.message;
    let li = $("<li></li>").addClass(type);
    let img_message = $("<div></div>").addClass("img");
    img_message.css({
        "background": "url('" + user.img + "')",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let message = $("<p></p>");
    message.text(mensaje);
    li.append(img_message);
    li.append(message);
    $("#contact_messaging" + msj.id360).append(li);
    $("#preview_"+msj.id360).text(user.nombre + ": " + mensaje);
    $("#messages_"+msj.id360).animate({scrollTop: $(document).height()}, "fast");
}
//traer el directorio 
RequestPOST("/API/ConsultarDirectorio", {
    "fecha": getFecha(),
    "hora": getHora(),
    "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
    "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
//    "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area,
    "tipo_area": "0"
}).then((response) => {
    console.log(response);
    let directorio = response.directorio;
    console.log(directorio);
    new Vue({
        el: "#app",
        data() {
            return {
                value: [],
                options: directorio
            }
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                //console.log(value);
            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                console.log(value);
                array_llamar = value;
            }
        }
    });
    new Vue({
        el: "#buscarContactos",
        data() {
            return {
                value: [],
                options: directorio
            }
        },
        methods: {
            customLabel(option) {
                return option.nombre + " " + option.apellido_paterno + " " + option.apellido_materno + " ";
            },
            onClosed(value) {
                //console.log(value);

            },

            onTag(value) {
                //console.log(value);
            },

            onRemove(value) {
                //console.log(value);
            },

            onInput(value) {
                console.log(value);
                $("#profile_chat" + value.id360).click();
            }
        }
    });

    for (var i = 0; i < directorio.length; i++) {
        let user = directorio[i];


        contacto_chat(user);

    }
    RequestPOST("/API/empresas360/backup_chat",{
        id360:sesion_cookie.id_usuario
    }).then((response)=>{
        console.log(response);
        for (var i = 0; i < response.length; i++) {
            if (response[i].id360 === sesion_cookie.id_usuario) {
                agregar_chat_enviado(response[i]);
            } else {
                recibir_chat(response[i]);
            }
        }
    });
});
function contacto_chat(user) {
    let li = $("<li></li>").addClass("contact");
    li.attr("id", "profile_chat" + user.id360);
    let div = $("<div></div>").addClass("wrap");
    let span = $("<span></span>").addClass("contact-status");
    span.addClass("online");
    let img = $("<div></div>");
    img.addClass("img");
    img.css({
        "background": "url('" + user.img + "')",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let meta = $("<div></div>").addClass("meta");
    let name = $("<p></p>").addClass("name");
    name.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);
    let preview = $("<p></p>").addClass("preview");
    preview.attr("id","preview_"+user.id360);
    meta.append(name);
    meta.append(preview);

    div.append(span);
    div.append(img);
    div.append(meta);

    li.append(div);

    $("#message_contacts").append(li);

    let content = $("<div></div>").addClass("content");
    content.addClass("d-none");
    let contact_profile = $("<div></div>").addClass("contact-profile");
    let img_profile = $("<div></div>").addClass("img");
    img_profile.css({
        "background": "url('" + user.img + "')",
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat"
    });
    let nombre = $("<p></p>");
    nombre.text(user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno);
    let social_media = $("<div></div>").addClass("social-media");
    let div_llamar = $("<div></div>");
    let llamar = $("<i class=\"fas fa-phone-alt\"></i>");
    llamar.attr("id", "llamar_" + user.id360);
    llamar.css({
        "background": "#40474f",
        "padding": "17px",
        "font-size": "60px",
        "width": "50px",
        "cursor": "pointer"
    });
    let messages = $("<div></div>").addClass("messages");
    messages.attr("id","messages_"+user.id360);
    let ul = $("<ul></ul>").addClass("p-0");
//    ul.id = "contact_messaging" + user.id360;
    ul.attr("id",  "contact_messaging" + user.id360);
//    let div = $("<div></div>").addClass("wrap")
    let message_input = $("<div></div>").addClass("message-input");
    let wrap = $("<div></div>").addClass("wrap");
    let input = $("<input>").addClass("wrap");
    input.attr("id", "message_input_" + user.id360);
    input.attr("type", "text");
    input.attr("placeholder", "Escribe un mensaje aqui....");
    input.attr("maxlength", "400");
    let paperclip = $(" <i class=\"fa fa-paperclip attachment\" aria-hidden=\"true\"></i>");
    let button = $("<button></button>").addClass("submit");
    /*Cambios fernando*/
    button.attr("id", "btn_enviar");
    /******************************/
    let paper_plane = $("<i class=\"fa fa-paper-plane\" aria-hidden=\"true\"></i>").addClass("wrap");

    button.append(paper_plane);
    wrap.append(input);
    wrap.append(paperclip);
    wrap.append(button);

    message_input.append(wrap);
    messages.append(ul);

    div_llamar.append(llamar);
    social_media.append(div_llamar);
    contact_profile.append(img_profile);
    contact_profile.append(nombre);
    contact_profile.append(social_media);
    content.append(contact_profile);
    content.append(messages);
    content.append(message_input);
    $("#content_messaging").append(content);

    button.click(() => {
        send_chat_messages(input, ul, preview, user, messages);
    });

    input.on('keydown', function (e) {
        if (e.which == 13) {
            send_chat_messages(input, ul, preview, user, messages);
            return false;
        }
    });

    li.click(() => {
        console.log(user);
        $(".content").addClass("d-none");
        content.removeClass("d-none");
    });

    div_llamar.click(() => {
        Swal.fire({
            text: "Iniciar una llamada con: " + user.nombre + " " + user.apellido_paterno + " " + user.apellido_materno,
            showCancelButton: true,
            focusConfirm: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: '<i class="fas fa-phone-volume"></i>Continuar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let id360 = {
                    id360: sesion_cookie.id_usuario
                };
                let to_id360 = new Array();
                to_id360.push({
                    id360: user.id360
                });
                id360.to_id360 = to_id360;
                console.log(id360);
                RequestPOST("/API/notificacion/llamada360", id360).then((msj) => {
                    console.log(msj);
                    window.open('https://empresas360.ml/plataforma360/Llamada/' + msj.registro_llamada.idLlamada + '/' + msj.credenciales.apikey + '/' + msj.credenciales.idsesion + '/' + msj.credenciales.token + '', '_blank');

                });
            }
        });
    });
}

function send_chat_messages(input, ul, preview, user, messages) {
    let mensaje = input.val();
    if ($.trim(mensaje) == '') {
        return false;
    } else {
        let json = {
            "id360": sesion_cookie.id_usuario,
            "to_id360": user.id360,
            "fecha": getFecha(),
            "hora": getHora(),
            "message": mensaje,
            "type": "text",
            "tipo_usuario": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_usuario,
            "tipo_servicio": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_servicio,
            "tipo_area": JSON.parse(getCookie("username_v3.1_" + DEPENDENCIA)).tipo_area
        };
        console.log(json);
        RequestPOST("/API/empresas360/chat", json).then((response) => {
            if (response.success) {
//                let li = $("<li></li>").addClass("sent");
                let li = $("<li></li>").addClass("replies");
                let img_message = $("<div></div>").addClass("img");
                img_message.css({
                    "background": "url('" + perfil.img + "')",
                    "background-size": "cover",
                    "background-position": "center",
                    "background-repeat": "no-repeat"
                });
                let message = $("<p></p>");
                message.text(mensaje);
                li.append(img_message);
                li.append(message);
                ul.append(li);
                input.val("");
                preview.text(user.nombre + ": " + mensaje);
                messages.animate({scrollTop: $(document).height()}, "fast");

            }
        });
    }

}
function contact_messaging(user) {


}

/*
 div class="contact-profile">
 <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
 <p>Harvey Specter</p>
 <div class="social-media">
 i
 </div>
 </div>
 <div class="messages">
 <ul  class="p-0">
 <li class="sent">
 <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">
 <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
 </li>
 <li class="replies">
 <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
 <p>When you're backed against the wall, break the god damn thing down.</p>
 </li>
 </ul>
 </div>
 <div class="message-input">
 <div class="wrap">
 <input type="text" placeholder="Write your message...">
 <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
 <button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
 </div>
 </div>
 */

$("#iniciar_llamada").click(() => {
    console.log(array_llamar);
    let id360 = {
        id360: sesion_cookie.id_usuario
    };
    let to_id360 = new Array();
    for (var i = 0; i < array_llamar.length; i++) {
        to_id360.push({
            id360: array_llamar[i].id360
        });
    }
    id360.to_id360 = to_id360;
    console.log(id360);
    RequestPOST("/API/notificacion/llamada360", id360).then((mensaje) => {
        console.log(mensaje);
        window.open('https://empresas360.ml/plataforma360/Llamada/' + mensaje.registro_llamada.idLlamada + '/' + mensaje.credenciales.apikey + '/' + mensaje.credenciales.idsesion + '/' + mensaje.credenciales.token + '', '_blank');

    });
});


$(".messages").animate({scrollTop: $(document).height()}, "fast");

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});



$("#status-options ul li").click(function () {
    $("#profile-img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");

    if ($("#status-online").hasClass("active")) {
        $("#profile-img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
        $("#profile-img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
        $("#profile-img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
        $("#profile-img").addClass("offline");
    } else {
        $("#profile-img").removeClass();
    }
    ;

    $("#status-options").removeClass("active");
});

function newMessage() {
    message = $(".message-input input").val();
    if ($.trim(message) == '') {
        return false;
    }
    $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
    $(".messages").animate({scrollTop: $(document).height()}, "fast");
}
;

$('.submit').click(function () {
    newMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        newMessage();
        return false;
    }
});

$(".expand-button").click(function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});