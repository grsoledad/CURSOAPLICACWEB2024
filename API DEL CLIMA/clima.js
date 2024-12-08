function buscarClima() {
    const ubicacion = document.getElementById('ubicacion').value;
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;

    // Aquí iría tu API call (por ejemplo, con Axios)
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&lat=${lat}&lon=${lon}&appid=9e122cd782b2d0333f5fe4e7fa192062&units=metric&lang=es`)
        .then(function (response) {
            const datos = response.data;
            
            // Obtener la descripción del clima
            const descripcion = datos.weather[0].description;
            const icono = datos.weather[0].icon; // Código del ícono (por ejemplo, "01d" para un sol)

            // Asignar la descripción al HTML
            document.getElementById('textoDescripcion').textContent = descripcion;

            // Asignar el ícono del clima
            const iconoClima = document.getElementById('iconoClima');
            iconoClima.innerHTML = `<img src="https://openweathermap.org/img/wn/${icono}.png" alt="${descripcion}">`;

            // Rellenar el resto de la información del clima
            document.getElementById('temperatura').textContent = datos.main.temp + '°C';
            document.getElementById('temp-max').textContent = datos.main.temp_max + '°C';
            document.getElementById('temp-min').textContent = datos.main.temp_min + '°C';
            document.getElementById('sensTerm').textContent = 'Sensación Térmica: ' + datos.main.feels_like + '°C';
            document.getElementById('humedad').textContent = datos.main.humidity + '%';
            document.getElementById('pais').textContent = datos.sys.country;
            document.getElementById('fecha').textContent = new Date().toLocaleDateString();
        })
        .catch(function (error) {
            console.error(error);
        });
}
