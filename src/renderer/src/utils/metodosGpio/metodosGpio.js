const { configPines } = require("../salidasEntradas/salidasEntradas");
const Gpio = require("onoff").Gpio;


configPines.forEach((item) => {
  item.instancia = new Gpio(item.pin, `${item.accion}`, `${item.argEntrada}`);
});

const pinesSalidas = configPines.filter((item) => item.accion === "out");
const pinesEntradass = configPines.filter((item) => item.accion !== "out");

//Iniciar pines en 0
pinesSalidas.forEach((item) => {
  item.instancia.writeSync(0);
});

const procesoActualPinesSalida = (proceso) => {
  for (let i = 0; i < proceso.length; i++) {
    let cambioEstadoPin = pinesSalidas.find((item) => item.nombre === proceso[i].nombre)
    if(cambioEstadoPin !== undefined) cambioEstadoPin.instancia.writeSync(proceso[i].estado)   
  }
}

// Manejador de eventos para asegurar que el LED se apague correctamente al salir del programa
process.on("SIGINT", () => {
  configPines.forEach((item) => {
    item.instancia.unexport();
  });
  process.exit();
});


module.exports = {
  procesoActualPinesSalida,
}