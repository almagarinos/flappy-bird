// Variables globales y configuración

// Configuración de la partida
const GAME_CONFIG = {
    gravity: 0.2, // Velocidad de caída. Cuanto más baja sea, más despacio cae el pájaro.
    jumpForce: -3, // Longitud del salto, puede ser decimal. Cuanto más corto, más manejable.
    pipeGap: 250, // Espacio vertical en cada columna de tuberías. Cuanto mayor: más fácil.
    pipeSpeed: 0.9 // Velocidad del movimiento de las tuberías. Cuanto menor: más lentas.
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

if (window.innerWidth < 450) {
    canvas.width = window.innerWidth;
} else {
    canvas.width = 450;
}

if (window.innerHeight < 800) {
    canvas.height = window.innerHeight;
} else {
    canvas.height = 800;
}

const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");



// Estado global
const bird = {
    x: 80,
    y: 120,
    radius: 16,
    velocity: 0,
    gravity: GAME_CONFIG.gravity,
    jumpForce: GAME_CONFIG.jumpForce
};

const pipes = [];

let score = 0;
let started = false;
let gameOver = false;
// Fin del estado global



// Funciones de la aplicación

// Crear nueva partida con sus valores iniciales
function restart() {
    bird.y = 120; // Mismo valor que al iniciarlo en el estado global
    bird.velocity = 0; // Mismo valor que al iniciarlo en el estado global

    pipes.length = 0;

    score = 0; // Contador de puntos a cero
    scoreElement.textContent = 0;

    started = false;
    gameOver = false;

    messageElement.classList.remove("hidden");
}



// Salto del pájaro gracias a su aleteo
function jump() {
    if (gameOver) {
        restart();
        return;
    }

    started = true;
    messageElement.classList.add("hidden");

    bird.velocity = bird.jumpForce;
}



// Crear cada tubería
function createPipe() {
    pipes.push({
        /*
         * Esta variable x es el espacio horizontal entre columnas de tuberías.
         * Mínimo (más difícil): canvas.width; máximo (más fácil): canvas.width * 2
         * Aleatorio medio difícil: canvas.width + Math.random() * ( canvas.width / 2 )
         * Se deja un promedio fijo medio fácil, donde máximo habrá 2 tuberías a la vez.
         */
        x: canvas.width + ( canvas.width / 2 ),
        width: 60, // Ancho de cada tubería, cuando mayor sea, más difícil el juego 
        // A continuación se garantiza que mínimo tendrá 50 px arriba o 50 px abajo
        topHeight: 50 + Math.random() * (canvas.height - 100 - GAME_CONFIG.pipeGap),
        gap: GAME_CONFIG.pipeGap,
        passed: false
    });
}



// Física del pájaro
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0 || bird.y > canvas.height) {
        gameOver = true;
    }
}

// Física de las tuberías
function updatePipes() {
    pipes.forEach(pipe => {

        pipe.x -= GAME_CONFIG.pipeSpeed;

        const insideX =
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width;

        const hitTop =
            bird.y - bird.radius < pipe.topHeight;

        const hitBottom =
            bird.y + bird.radius > pipe.topHeight + pipe.gap;

        if (insideX && (hitTop || hitBottom)) {
            gameOver = true;
        }

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;

            scoreElement.textContent = score;
        }
    });

    while (
        pipes.length &&
        pipes[0].x + pipes[0].width < 0
    ) {
        pipes.shift();
    }

    const lastPipe = pipes.at(-1);

    if (!lastPipe || lastPipe.x < 220) {
        createPipe();
    }
}



// Dibuja y colorea el pájaro
function drawBird() {
    ctx.save();

    // Mover el origen al centro del pájaro
    ctx.translate(
        bird.x,
        bird.y
    );

    // Inclinación según la velocidad
    ctx.rotate(bird.velocity * 0.05);



    // Cuerpo del pájaro
    ctx.fillStyle = "#ffdd55";

    ctx.beginPath();
        ctx.roundRect(
            -18,
            -12,
            36,
            24,
            8
        );
    ctx.fill();



    // Ojo del pájaro
    ctx.fillStyle = "#222222";

    ctx.beginPath();
        ctx.arc(
            5,
            -3,
            2,
            0,
            Math.PI * 2
        );
    ctx.fill();



    // Pico del pájaro
    ctx.fillStyle = "#f06f06";

    ctx.beginPath();
        ctx.moveTo(+0, +2);
        ctx.lineTo(+22, -2);
        ctx.lineTo(+22, +6);
    ctx.fill();

    ctx.restore();
}

// Dibuja y colorea las tuberías
function drawPipes() {
    ctx.fillStyle = "#008866";

    pipes.forEach(pipe => {

        ctx.fillRect(
            pipe.x,
            0,
            pipe.width,
            pipe.topHeight
        );

        ctx.fillRect(
            pipe.x,
            pipe.topHeight + pipe.gap,
            pipe.width,
            canvas.height
        );
    });
}



// Render del canvas
function renderGame() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBird();
    drawPipes();
}



// Game loop de la aplicación
function gameLoop() {
    if (started && !gameOver) {
        updateBird();
        updatePipes();
    }

    renderGame();

    requestAnimationFrame(gameLoop);
}
// Fin del game loop



// Eventos de la aplicación

// Listener de teclado
window.addEventListener("keydown", event => {
    if (event.code === "Space") {
        jump();
    }
});

// Listener de ratón
window.addEventListener('mousedown', function(e) {
    // Evita la selección de texto y el comportamiento de arrastre por defecto
    e.preventDefault();
    
    // Acción de ratón
    jump();
});

// Listener de pantalla táctil
window.addEventListener('touchstart', function(e) {
    // Evita el comportamiento por defecto (scroll, zoom o selección)
    e.preventDefault();

    // Acción táctil
    jump();
}, { passive: false });



// Iniciar la aplicación
gameLoop();