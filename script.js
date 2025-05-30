
//latirud son cordenadas
const lat = 4.53389;
//longitud
const lon = -75.68111;
const URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

async function obtenerClima() {
  try {
    //se hara una peticio http
    const respuesta = await fetch(URL);
    // si la respuesta no fue exitosa el estado sera de 400
    if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
    //asi se convertirala respuestaen formato json
    const datos = await respuesta.json();
    //la funcion current_weather obtiene el climaactual es una funcion
    const clima = datos.current_weather;
    //mediante la funion generar resumen hacmos un resumen del clima
    const resumen = generarResumen(clima);
    //un console.log
    console.log('Resumen del clima:');
    //aquí mostramos el resumen
    console.log(resumen);
    //y acontinuación manejamos el errorr con un catch 
  } catch (error) {
    //no selogro obtener el cclima
    console.error('No se pudo obtener el clima:', error.message);
  }
}
//generaremos un resumen del clima y tenemos como parametro el clima ya obtenido
function generarResumen(clima) {
    // de esta manera se obtiene la temperatura y el viento de la variable clima
  const { temperature, windspeed } = clima;

  let descripcion = '';
  if (temperature > 30) descripcion += 'Hace mucho calor. ';
  else if (temperature > 20) descripcion += 'El clima está cálido. ';
  else descripcion += 'Hace algo de frío. ';

  descripcion += `Temperatura: ${temperature}°C. Viento: ${windspeed} km/h.`;

  return descripcion;
}
//ejecutamos lo de obtener un clima
obtenerClima();
