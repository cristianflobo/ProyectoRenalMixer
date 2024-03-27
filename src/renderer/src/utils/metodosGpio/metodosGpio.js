/*
+------+-----+----------+--------+---+  ZERO2W  +---+--------+----------+-----+------+
| GPIO | wPi |   Name   |  Mode  | V | Physical | V |  Mode  | Name     | wPi | GPIO |
+------+-----+----------+--------+---+----++----+---+--------+----------+-----+------+
|      |     |     3.3V |        |   |  1 || 2  |   |        | 5V       |     |      |
|  264 |   0 |    SDA.1 |   ALT5 | 0 |  3 || 4  |   |        | 5V       |     |      |
|  263 |   1 |    SCL.1 |   ALT5 | 0 |  5 || 6  |   |        | GND      |     |      |
|  269 |   2 |     PWM3 |    OFF | 0 |  7 || 8  | 0 | ALT2   | TXD.0    | 3   | 224  |
|      |     |      GND |        |   |  9 || 10 | 0 | ALT2   | RXD.0    | 4   | 225  |
|  226 |   5 |    TXD.5 |    OFF | 0 | 11 || 12 | 0 | OFF    | PI01     | 6   | 257  |
|  227 |   7 |    RXD.5 |    OFF | 0 | 13 || 14 |   |        | GND      |     |      |
|  261 |   8 |    TXD.2 |    OFF | 0 | 15 || 16 | 0 | OFF    | PWM4     | 9   | 270  |
|      |     |     3.3V |        |   | 17 || 18 | 0 | OFF    | PH04     | 10  | 228  |
|  231 |  11 |   MOSI.1 |    OFF | 0 | 19 || 20 |   |        | GND      |     |      |
|  232 |  12 |   MISO.1 |    OFF | 0 | 21 || 22 | 0 | OFF    | RXD.2    | 13  | 262  |
|  230 |  14 |   SCLK.1 |    OFF | 0 | 23 || 24 | 0 | OFF    | CE.0     | 15  | 229  |
|      |     |      GND |        |   | 25 || 26 | 0 | OFF    | CE.1     | 16  | 233  |
|  266 |  17 |    SDA.2 |    OFF | 0 | 27 || 28 | 0 | OFF    | SCL.2    | 18  | 265  |
|  256 |  19 |     PI00 |    OFF | 0 | 29 || 30 |   |        | GND      |     |      |
|  271 |  20 |     PI15 |    OFF | 0 | 31 || 32 | 0 | OFF    | PWM1     | 21  | 267  |
|  268 |  22 |     PI12 |    OFF | 0 | 33 || 34 |   |        | GND      |     |      |
|  258 |  23 |     PI02 |    OFF | 0 | 35 || 36 | 0 | OFF    | PC12     | 24  | 76   |
|  272 |  25 |     PI16 |    OFF | 0 | 37 || 38 | 0 | OFF    | PI04     | 26  | 260  |
|      |     |      GND |        |   | 39 || 40 | 0 | OFF    | PI03     | 27  | 259  |
+------+-----+----------+--------+---+----++----+---+--------+----------+-----+------+
| GPIO | wPi |   Name   |  Mode  | V | Physical | V |  Mode  | Name     | wPi | GPIO |
+------+-----+----------+--------+---+  ZERO2W  +---+--------+----------+-----+------+
*/

const Gpio = require("onoff").Gpio;


const configPines = [
  {
    nombre: "valvula 1",
    pin: 257,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "valvula 2",
    pin: 228,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "valvula 3",
    pin: 262,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "valvula 4",
    pin: 229,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "valvula 5",
    pin: 233,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "valvula 6",
    pin: 265,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "bomba 1",
    pin: 267,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "bomba 2",
    pin: 76,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "bomba 3",
    pin: 260,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
  {
    nombre: "buzzer",
    pin: 259,
    accion: "out",
    argEntrada: "none",
    instancia: "",
  },
];

//configuracion de pines e instansiacion
configPines.forEach((item) => {
  item.instancia = new Gpio(item.pin, `${item.accion}`, `${item.argEntrada}`);
});

const pinesSalidas = configPines.filter((item) => item.accion === "out");
const pinesEntradass = configPines.filter((item) => item.accion !== "out");

//Iniciar pines en 0
pinesSalidas.forEach((item) => {
  item.instancia.writeSync(0);
});

export const procesoActualPines = (proceso) => {
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

