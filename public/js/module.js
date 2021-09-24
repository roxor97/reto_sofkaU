class Connection {
  constructor(ruta) {
    this.ruta = ruta;
  }
  get() {
    let texto = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", this.ruta, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      texto = xmlhttp.responseText;
    }
    return JSON.parse(texto);
  }
}

class Pregunta {
  constructor(datos, dificultad) {
    this.datos = datos;
    this.dificultad = dificultad;
  }
  escogerPreguntasAleatoria() {
    let n = Math.floor(Math.random() * 25);
    let p_categorias = this.datos.filter(
      (elemt) => elemt.dificultad == this.dificultad
    );
    let npregunta = p_categorias[n];
    return npregunta;
  }
}

class Persona {
  constructor(name, edad, email) {
    this.nombre = name;
    this.edad = edad;
    this.email = email;
  }
}

class Jugadores extends Persona {
  constructor(nombre,edad, email, puntaje,resultado) {
    super(nombre,edad,email);
    this.puntaje = puntaje;
    this.resultado = resultado;
  }
}

export { Jugadores, Persona, Pregunta, Connection };
