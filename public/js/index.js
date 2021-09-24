import { Connection, Pregunta, Jugadores } from "./module.js";
window.onload = function () {
  inicioronda();
};

let nombre = prompt("ingrese su nombre: ");
let edad_S = prompt("ingrese su edad: ");
let edad = parseInt(edad_S);
let email = prompt("ingrese su email: ");
let pregunta;
let posibles_respuestas = [];
let btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4"),
];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

async function registrar(data) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json","Access-Control-Allow-Origin': '*'");

  var raw = JSON.stringify({
    nombre: data.nombre,
    edad: data.edad,
    email: data.email,
    puntaje: data.puntaje,
    resultado: data.resultado,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    mode: 'cors'
  };

  fetch("http://localhost:3535/registros/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function enviardatos(result) {
  let Jugador = new Jugadores(nombre, edad, email, preguntas_correctas, result);
  registrar(Jugador);
  location.reload(true);
}
function inicioronda() {
  let datos = new Connection("../data/base-preguntas.json");
  let interprete = datos.get();
  console.log(interprete);
  let question = new Pregunta(interprete, preguntas_hechas);
  imprimir(question.escogerPreguntasAleatoria(), preguntas_hechas);
}

function imprimir(question, n) {
  pregunta = question;
  select_id("numero").innerHTML = n;
  select_id("categoria").innerHTML = `Categoria: ${question.categoria}`;
  select_id("dificultad").innerHTML = `Dificultad: ${question.dificultad + 1}`;
  select_id("pregunta").innerHTML = question.pregunta;
  let pc = preguntas_correctas;
  if (preguntas_hechas >= 1) {
    select_id("puntaje").innerHTML = `Tu puntaje: ${pc}`;
  } else {
    select_id("puntaje").innerHTML = `Tu puntaje: 0`;
  }

  style("imagen").objectFit = question.objectFit;

  if (question.imagen) {
    select_id("imagen").setAttribute("src", question.imagen);
    style("imagen").height = "120px";
    style("imagen").width = "45%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
  desordenarRespuestas(question);
  preguntas_hechas++;
}

function desordenarRespuestas(respuesta) {
  posibles_respuestas = [
    respuesta.respuesta,
    respuesta.incorrecta1,
    respuesta.incorrecta2,
    respuesta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];

  select_id("btn1").addEventListener("click", () => {
    oprimir_btn(0);
  });
  select_id("btn2").addEventListener("click", () => {
    oprimir_btn(1);
  });
  select_id("btn3").addEventListener("click", () => {
    oprimir_btn(2);
  });
  select_id("btn4").addEventListener("click", () => {
    oprimir_btn(3);
  });
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "lightgreen";
    let eleccion = prompt("¿desea retirarse con su acumulado? responda si o no ");
    if(eleccion=="si"){
      enviardatos("gano");
    }
  } else {
    btn_correspondiente[i].style.background = "red";
    alert(`Te haz equivocado tu puntaje fue 0`);
    enviardatos("no gano");
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
  if (preguntas_correctas == 5) {
    enviardatos("gano");
    alert(`Haz ganado tu puntaje fue ${5}`);
    select_id("puntaje").innerHTML = `Tu puntaje: ${5}`;
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 2000);
}

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  inicioronda();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}
