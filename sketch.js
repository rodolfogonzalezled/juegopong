let anchoCanvas = 800;
let altoCanvas = 400;

let jugadorX = 15;
let jugadorY;
let anchoRaqueta = 10;
let altoRaqueta = 100;

let computadoraX = anchoCanvas - 25;
let computadoraY;

let pelotaX, pelotaY;
let diametroPelota = 20;
let velocidadPelotaX = 5;
let velocidadPelotaY = 5;

let grosorMarco = 10;

let jugadorScore = 0;
let computadoraScore = 0;
let maxScore = 5; // Puntaje máximo para terminar el juego

let fondoImagen;
let barraJugador;
let barraComputadora;
let bolaImagen;

let anguloPelota = 0;

let sonidoBounce;
let sonidoGol;
let sonidoGameOver;
let juegoPausado = false;
let juegoIniciado = false;

let sonidoActivo = true;
let iconoSonidoCon;
let iconoSonidoSin;

function preload() {
    fondoImagen = loadImage("/sprite/fondo1.png");
    barraJugador = loadImage("/sprite/barra1.png");
    barraComputadora = loadImage("/sprite/barra2.png");
    bolaImagen = loadImage("/sprite/bola.png");

    sonidoBounce = loadSound("/sprite/bounce.wav");
    sonidoGol = loadSound("/sprite/gol.ogg");
    sonidoGameOver = loadSound("/sprite/game_over.wav")

    iconoSonidoCon = loadImage("/sprite/con-sonido.png");
    iconoSonidoSin = loadImage("/sprite/sin-sonido.png");
}

function setup() {
    createCanvas(anchoCanvas, altoCanvas);
    jugadorY = height / 2 - altoRaqueta / 2 + 25;
    computadoraY = height / 2 - altoRaqueta / 2 + 25;
    resetPelota();
}

function draw() {
    if (!juegoIniciado) {
        background(0); // Fondo oscuro para el mensaje inicial
        textSize(24);
        textAlign(CENTER, CENTER);
        fill(255);
        text("Presiona Enter para empezar", width / 2, height / 2);
        return; // Detener el juego hasta que se presione Enter
    }

    if (juegoPausado) {
        return; // Salir de la función si el juego está en pausa
    }

    if (jugadorScore >= maxScore || computadoraScore >= maxScore) {
        finalizarJuego();
        noLoop(); // Detener el loop de juego
        return;
    }

    image(fondoImagen, 0, 50, anchoCanvas, altoCanvas - 50);

    dibujarMarcador();
    dibujarMarcos();
    dibujarRaquetas();
    dibujarPelota();
    moverPelota();
    moverComputadora();
    verificarColisiones();

    // Mostrar ícono de sonido en la esquina superior derecha del marcador
    image(sonidoActivo ? iconoSonidoCon : iconoSonidoSin, width - 40, 10, 30, 30);
}

function dibujarMarcador() {
    fill(50);
    rect(0, 0, width, 50);

    textSize(20);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Jugador", width / 4, 15);
    text("Computadora", (3 * width) / 4, 15);

    textSize(24);
    text(jugadorScore, width / 4, 35);
    text(computadoraScore, (3 * width) / 4, 35);
}

function dibujarMarcos() {
    fill("#3B1E54");
    rect(0, 50, width, grosorMarco);
    rect(0, height - grosorMarco, width, grosorMarco);
}

function dibujarRaquetas() {
    image(barraJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta);
    image(barraComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta);
}

function dibujarPelota() {
    let velocidadMagnitud = dist(0, 0, velocidadPelotaX, velocidadPelotaY);
    anguloPelota += velocidadMagnitud * 0.05;

    push();
    translate(pelotaX, pelotaY);
    rotate(anguloPelota);
    imageMode(CENTER);
    image(bolaImagen, 0, 0, diametroPelota, diametroPelota);
    pop();
}

function moverPelota() {
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    if (pelotaY - diametroPelota / 2 < 50 + grosorMarco ||
        pelotaY + diametroPelota / 2 > height - grosorMarco) {
        velocidadPelotaY *= -1;
    }
}

function moverComputadora() {
    if (pelotaY > computadoraY + altoRaqueta / 2) {
        computadoraY += 4;
    } else if (pelotaY < computadoraY + altoRaqueta / 2) {
        computadoraY -= 4;
    }
    computadoraY = constrain(computadoraY, 50 + grosorMarco, height - grosorMarco - altoRaqueta);
}

function verificarColisiones() {
    if (pelotaX - diametroPelota / 2 < jugadorX + anchoRaqueta &&
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3;
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;

        if (sonidoActivo) {
            sonidoBounce.play();
        }
    }

    if (pelotaX + diametroPelota / 2 > computadoraX &&
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3;
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;

        if (sonidoActivo) {
            sonidoBounce.play();
        }
    }

    if (pelotaX < 0) {
        computadoraScore++;
        resetPelota();
        narrarMarcador();
        if (sonidoActivo) {
            sonidoGol.play();
        }
    } else if (pelotaX > width) {
        jugadorScore++;
        resetPelota();
        narrarMarcador();
        if (sonidoActivo) {
            sonidoGol.play();
        }
    }
}

function resetPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    velocidadPelotaX = 5 * (Math.random() > 0.5 ? 1 : -1);
    velocidadPelotaY = 5 * (Math.random() > 0.5 ? 1 : -1);
    anguloPelota = 0;
}

function narrarMarcador() {
    if (sonidoActivo) { // Solo narrar si el sonido está activo
        let narracion = `El marcador es, Jugador ${jugadorScore}, Computadora ${computadoraScore}.`;
        let speech = new SpeechSynthesisUtterance(narracion);
        speech.lang = "es-AR";
        window.speechSynthesis.speak(speech);
    }
}

function finalizarJuego() {
    let mensaje = `El juego ha terminado. Resultado final: Jugador ${jugadorScore} - Computadora ${computadoraScore}.\n¿Deseas jugar de nuevo?`;
    if (confirm(mensaje)) {
        jugadorScore = 0;
        computadoraScore = 0;
        resetPelota();
        window.location.reload()
    } else {
        sonidoGameOver.play();
        jugadorScore = 0;
        computadoraScore = 0;
        resetPelota();
        window.location.reload()
    }
}

function keyPressed() {
    if (key === 'S' || key === 's') { // Alterna el estado de sonido
        sonidoActivo = !sonidoActivo;
    } else if (keyCode === ENTER) {
        juegoIniciado = true;
    } else if (key === ' ') {
        juegoPausado = !juegoPausado;
    } else if (keyCode === UP_ARROW) {
        jugadorY -= 50;
    } else if (keyCode === DOWN_ARROW) {
        jugadorY += 50;
    }

    jugadorY = constrain(jugadorY, 50 + grosorMarco, height - grosorMarco - altoRaqueta);
}