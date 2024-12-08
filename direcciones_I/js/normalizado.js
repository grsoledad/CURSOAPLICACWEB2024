"use strict";
// Referencias a elementos del DOM
const formatoEntrada = document.getElementById("formatoEntrada");
const camposEntrada = document.getElementById("camposEntrada");
const mensajeResultado = document.getElementById("mensajeResultado");

// Función para actualizar el formulario según el formato seleccionado
function actualizarFormulario() {
    const formato = formatoEntrada.value;
    let html = "";

    if (formato === "calle_altura") {
        html = `
            <div class="mb-3">
                <label for="calle" class="form-label">Calle</label>
                <input type="text" id="calle" class="form-control" placeholder="Ej: Loria" required>
            </div>
            <div class="mb-3">
                <label for="altura" class="form-label">Altura</label>
                <input type="text" id="altura" class="form-control" placeholder="Ej: 300" required>
            </div>
            <div class="mb-3">
                <label for="partido" class="form-label">Partido</label>
                <input type="text" id="partido" class="form-control" placeholder="Ej: Lomas" required>
            </div>
        `;
    } else if (formato === "calle_y_calle") {
        html = `
            <div class="mb-3">
                <label for="calle1" class="form-label">Primera Calle</label>
                <input type="text" id="calle1" class="form-control" placeholder="Ej: Callao" required>
            </div>
            <div class="mb-3">
                <label for="calle2" class="form-label">Segunda Calle</label>
                <input type="text" id="calle2" class="form-control" placeholder="Ej: Corrientes" required>
            </div>
            <div class="mb-3">
                <label for="partido" class="form-label">Partido</label>
                <input type="text" id="partido" class="form-control" placeholder="Ej: CABA" required>
            </div>
        `;
    } else if (formato === "lat_lng") {
        html = `
            <div class="mb-3">
                <label for="latitud" class="form-label">Latitud</label>
                <input type="text" id="latitud" class="form-control" placeholder="Ej: -34.762920" required>
            </div>
            <div class="mb-3">
                <label for="longitud" class="form-label">Longitud</label>
                <input type="text" id="longitud" class="form-control" placeholder="Ej: -58.402165" required>
            </div>
        `;
    }

    camposEntrada.innerHTML = html;
}

// Función "Buscar Dirección" onclick
function buscarDireccion() {
    const formato = formatoEntrada.value;
    let calle1, calle2, latitud, longitud;

    // Calle y altura
    if (formato === "calle_altura") {
        calle1 = document.getElementById("calle").value.trim();
        calle2 = document.getElementById("altura").value.trim();
        const partido = document.getElementById("partido").value.trim();

        if (!calle1 || !calle2 || !partido) {
            alert("Por favor ingrese todos los campos.");
            return;
        }

        obtenerPorCalleYAltura(calle1, calle2, partido);
    }
    // Intersección de calles
    else if (formato === "calle_y_calle") {
        calle1 = document.getElementById("calle1").value.trim();
        calle2 = document.getElementById("calle2").value.trim();
        const partido = document.getElementById("partido").value.trim();

        if (!calle1 || !calle2 || !partido) {
            alert("Por favor ingrese todos los campos.");
            return;
        }

        obtenerPorInterseccion(calle1, calle2, partido);
    }
    // Latitud y Longitud
    else if (formato === "lat_lng") {
        latitud = document.getElementById("latitud").value.trim();
        longitud = document.getElementById("longitud").value.trim();

        if (!esCoordenada(latitud) || !esCoordenada(longitud)) {
            alert("Por favor ingrese coordenadas válidas.");
            return;
        }

        obtenerPorCoordenadas(latitud, longitud);
    } else {
        alert("Por favor selecciona un formato de entrada válido.");
    }
}


// Función que determina si un valor es una coordenada válida (latitud o longitud)
function esCoordenada(valor) {
    return !isNaN(valor) && valor.indexOf('.') !== -1;
}

// Función que determina si un valor es un número (altura)
function esNumero(valor) {
    return !isNaN(valor) && valor.indexOf('.') === -1;
}

// Función que busca por intersección de calles
function obtenerPorInterseccion(calle1, calle2, partido) {
    let url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(calle1)}%20y%20${encodeURIComponent(calle2)},${encodeURIComponent(partido)}`;

    document.getElementById("resultado").innerHTML = "Buscando...";

    axios.get(url)
        .then(function(response) {
            console.log(response);

            if (response.data.direccionesNormalizadas && response.data.direccionesNormalizadas.length > 0) {
                let resultadoHTML = "";

                response.data.direccionesNormalizadas.forEach(function(resultado) {
                    const detalles = `
                        <ul>
                            <li><strong>Dirección:</strong> ${resultado.direccion}</li>
                            <li><strong>Calle:</strong> ${resultado.nombre_calle}</li>
                            <li><strong>Calle de cruce:</strong> ${resultado.nombre_calle_cruce}</li>
                            <li><strong>Localidad:</strong> ${resultado.nombre_localidad}</li>
                            <li><strong>Partido:</strong> ${resultado.nombre_partido}</li>
                            <li><strong>Tipo de búsqueda:</strong> ${resultado.tipo}</li>
                        </ul>
                    `;
                    resultadoHTML += detalles;
                    // Concatenamos los campos en un texto para ser leído
                    const texto = `Dirección: ${resultado.direccion}, Calle: ${resultado.nombre_calle}, Calle de cruce: ${resultado.nombre_calle_cruce}, Localidad: ${resultado.nombre_localidad}, Partido: ${resultado.nombre_partido}, Tipo de búsqueda: ${resultado.tipo}`;
                    
                    // Llamamos a la función hablar con el texto
                    hablar(texto);
                });

                document.getElementById("resultado").innerHTML = `Direcciones encontradas: ${resultadoHTML}`;
            } else {
                document.getElementById("resultado").innerHTML = "No se encontraron resultados para esta intersección de calles.";
            }
        })
        .catch(function(error) {
            console.error("Error al realizar la solicitud:", error);
            document.getElementById("resultado").innerHTML = "La API no está disponible en este momento. Intenta más tarde.";
        });
}

// Función que busca por calle y altura
function obtenerPorCalleYAltura(calle, altura, partido) {
    let url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(calle)}%20${encodeURIComponent(altura)},${encodeURIComponent(partido)}`;

    document.getElementById("resultado").innerHTML = "Buscando...";

    axios.get(url)
        .then(function(response) {
            console.log(response);

            if (response.data.direccionesNormalizadas && response.data.direccionesNormalizadas.length > 0) {
                let resultadoHTML = "";

                response.data.direccionesNormalizadas.forEach(function(resultado) {
                    const detalles = `
                        <ul>
                            <li><strong>Dirección:</strong> ${resultado.direccion}</li>
                            <li><strong>Calle:</strong> ${resultado.nombre_calle}</li>
                            <li><strong>Calle de cruce:</strong> ${resultado.nombre_calle_cruce}</li>
                            <li><strong>Localidad:</strong> ${resultado.nombre_localidad}</li>
                            <li><strong>Partido:</strong> ${resultado.nombre_partido}</li>
                            <li><strong>Tipo de búsqueda:</strong> ${resultado.tipo}</li>
                        </ul>
                    `;
                    resultadoHTML += detalles;

                     // Concatenamos los campos en un texto para ser leído
                     const texto = `Dirección: ${resultado.direccion}, Calle: ${resultado.nombre_calle}, Calle de cruce: ${resultado.nombre_calle_cruce}, Localidad: ${resultado.nombre_localidad}, Partido: ${resultado.nombre_partido}, Tipo de búsqueda: ${resultado.tipo}`;
                    
                     // Llamamos a la función hablar con el texto
                     hablar(texto);
                });

                document.getElementById("resultado").innerHTML = `Direcciones encontradas: ${resultadoHTML}`;
            } else {
                document.getElementById("resultado").innerHTML = "No se encontraron resultados para esta calle y altura.";
            }
        })
        .catch(function(error) {
            console.error("Error al realizar la solicitud:", error);
            document.getElementById("resultado").innerHTML = "La API no está disponible en este momento. Intenta más tarde.";
        });
}

// Función que obtiene la ubicación actual del usuario con más precisión
function obtenerUbicacionActual() {
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy: true,  // Aumenta la precisión
            timeout: 10000,            // Tiempo de espera máximo en milisegundos (10 segundos)
            maximumAge: 0              // No usar la ubicación almacenada en caché
        };

        navigator.geolocation.getCurrentPosition(function(position) {
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;
            console.log("Ubicación actual:", latitud, longitud);
            
            // Llamar a la función para obtener la dirección usando las coordenadas
            obtenerPorCoordenadas(latitud, longitud);

            // Mostrar en el mapa la ubicación obtenida
            inicializarMapa(latitud, longitud);
        }, function(error) {
            // Manejar el error si no se puede obtener la ubicación
            alert("No se pudo obtener la ubicación. Por favor, asegúrese de haber permitido el acceso a la ubicación.");
        }, options); // Se pasan las opciones aquí
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }
}


// Función que busca por latitud y longitud
function obtenerPorCoordenadas(latitud, longitud) {
    let url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?lng=${longitud}&lat=${latitud}`;

    document.getElementById("resultado").innerHTML = "Buscando...";

    axios.get(url)
        .then(function(response) {
            if (response.data.error) {
                document.getElementById("resultado").innerHTML = "No se encontró ninguna dirección para estas coordenadas.";
            } else {
                // Obtenemos los datos de la respuesta
                const direccion = response.data.direccion || "Dirección no disponible";
                const altura = response.data.altura || "No disponible";
                const nombreCalle = response.data.nombre_calle || "No disponible";
                const nombreCalleCruce = response.data.nombre_calle_cruce || "No disponible";
                const nombreLocalidad = response.data.nombre_localidad || "No disponible";
                const nombrePartido = response.data.nombre_partido || "No disponible";

                // Generamos el HTML para mostrar en la página
                const resultado = `
                    Dirección: ${direccion} <br>
                    Calle: ${nombreCalle} <br>
                    Cruce: ${nombreCalleCruce} <br>
                    Localidad: ${nombreLocalidad} <br>
                    Partido: ${nombrePartido} <br>
                    Altura: ${altura} <br>
                `;
                document.getElementById("resultado").innerHTML = resultado;

                // Generamos el texto para la síntesis de voz
                const texto = `
                    Dirección: ${direccion}, 
                    Calle: ${nombreCalle}, 
                    Calle de cruce: ${nombreCalleCruce}, 
                    Localidad: ${nombreLocalidad}, 
                    Partido: ${nombrePartido}, 
                    Altura: ${altura}.
                `;

                // Llamamos a la función hablar con el texto generado
                hablar(texto);
            }
        })
        .catch(function(error) {
            console.error("Error al realizar la solicitud:", error);
            document.getElementById("resultado").innerHTML = "La API no está disponible en este momento. Intenta más tarde.";
        });
}


// Variable para controlar el estado de mute
let muteado = false;

// Función para hablar
function hablar(texto) {
    if (muteado) return; // Si está muteado, no hacer nada

    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES"; // Establece el idioma a español
    window.speechSynthesis.speak(mensaje);
}

// Función para manejar el mute/unmute con el checkbox
document.getElementById("checkboxInput").addEventListener("change", function() {
    muteado = this.checked; // Cambiar el estado de mute según si el checkbox está marcado

    if (muteado) {
        // Si está muteado, cancelamos cualquier síntesis de voz en curso
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel(); // Detener la síntesis de voz
        }
    }
});

