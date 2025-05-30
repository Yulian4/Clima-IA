//  const lat = 6.25184;
// const lon = -75.56359;

document.getElementById("button").addEventListener("click", obtenerClima);

async function obtenerClima() {
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("long").value;
  const api1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const api2 = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
  try {
    const promesa1 = fetch(api1).then(async r => {
      const data = await r.json();
      return {
        fuente: "Open-Meteo",
        temperatura: data.current_weather.temperature,
        viento: data.current_weather.windspeed
      };
    });

    const promesa2 = fetch(api2, {
      headers: { "User-Agent": "mi-aplicacion" }
    }).then(async r => {
      const data = await r.json();
      const datosHoraActual = data.properties.timeseries[0].data.instant.details;
      return {
        fuente: "Met.no",
        temperatura: datosHoraActual.air_temperature,
        viento: datosHoraActual.wind_speed
      };
    });

    const clima = await Promise.race([promesa1, promesa2]);

    const resumen = generarResumen(clima);
    document.getElementById("resultado").textContent = resumen;
    console.log(` Fuente: ${clima.fuente}`);
  } catch (error) {
    console.error(" No se pudo obtener el clima:", error.message);
    document.getElementById("resultado").textContent = "Error obteniendo el clima.";
  }
}

function generarResumen({ temperatura, viento }) {
  const body = document.body;
  const before = document.createElement('style');
  let gradiente = '';

  let descripcion = '';
  if (temperatura > 30) {
    gradiente = "linear-gradient(-45deg, #ff9966, #ff5e62, #f85032, #ffb347)"
    descripcion += 'Hace mucho calor. ';
  }

  else if (temperatura > 20) {
    descripcion += 'El clima está cálido. ';
    gradiente = "linear-gradient(-45deg,rgb(241, 182, 126), #ff5e62,rgb(238, 139, 122),rgb(230, 189, 132))"
  }
  else {
    descripcion += 'Hace algo de frío. ';
    gradiente = "linear-gradient(-45deg,rgb(25, 160, 238),rgb(94, 217, 255),rgb(127, 125, 233),rgb(71, 227, 255))"
  }
  before.innerHTML = `
    body::before {
      background: ${gradiente};
    }
  `;
  document.head.appendChild(before);


  body.classList.add('fondo-cambiando');

  setTimeout(() => {
    body.style.background = gradiente;
    body.classList.remove('fondo-cambiando');
    before.remove(); 
  }, 2000);
  descripcion += `Temperatura: ${temperatura}°C. Viento: ${viento} km/h.`;
  return descripcion;
}
