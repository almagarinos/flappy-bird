// Variables globales y configuración

// Niveles de dificultad de la partida
const DIFFICULTIES = {

    easy: {
        levelName: "nivel fácil", // Nombre del nivel de dificultad. Se usará en el ranking.
        gravity: 0.2, // Velocidad de caída. Cuanto más baja sea, más despacio cae el pájaro.
        jumpForce: -3, // Longitud del salto, puede ser decimal. Cuanto más corto, más manejable.
        pipeGap: 250, // Espacio vertical en cada columna de tuberías. Cuanto mayor: más fácil.
        pipeSpeed: 0.9 // Velocidad del movimiento de las tuberías. Cuanto menor: más lentas.
    },

    normal: {
        levelName: "nivel normal",
        gravity: 0.25,
        jumpForce: -4.5,
        pipeGap: 210,
        pipeSpeed: 1.8
    },

    hard: {
        levelName: "nivel difícil",
        gravity: 0.30,
        jumpForce: -6,
        pipeGap: 180,
        pipeSpeed: 3
    }
};

// Configuración de la partida
let GAME_CONFIG = DIFFICULTIES.easy; // Por defecto es el nivel fácil

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
const dialogRanking = document.getElementById("dialogoRanking");
const dialogOrientacion = document.getElementById("dialogoOrientacion");



// Estado global
const gameState = {
    screen: "menu",
    difficulty: null,
    score: 0,
    bird: {
        x: 80,
        y: 120,
        radius: 16,
        velocity: 0
    },
    pipes: []
};
// Fin del estado global



// Funciones de la aplicación

// Se comprueba que la pantalla del dispositivo es suficiente en altura
function visualizacionCorrecta() {
    // Si está en la orientación horizontal en un dispositivo móvil pequeño, lo indica
    if (window.innerHeight < window.innerWidth && window.innerHeight < 450) {
        dialogOrientacion.showModal();
        return false;
    } else {
        return true;
    }
}



// Gestión de localStorage
function getScores() {
    // Si no hay datos, se devuelve un objeto vacío
    return JSON.parse(localStorage.getItem("flappy-scores")) || [];
}

function saveScores(scores) {
    localStorage.setItem("flappy-scores", JSON.stringify(scores));
}
// Fin de la gestión de localStorage



// Ranking de puntuaciones
function renderLeaderboard() {
    const scores = getScores();

    if (scores.length == 0) { // Si el objeto viene vacío
        document .getElementById("leaderboard").innerHTML = `Aún no hay datos guardados.`;
    } else {

        document.getElementById("leaderboard").innerHTML = `
            <ol>
                ${
                    scores.map(score => `
                        <li>
                            ${score.user} - ${score.score} (${score.difficulty})
                        </li>
                    `).join("")
                }
            </ol>
        `;
    }
}



// Gestión pantallas a mostrar según el estado del juego
function updateScreens() {
    document.querySelectorAll(".screen").forEach(screen => screen.classList.add("hidden"));
    document.getElementById("game").classList.add("filtered");
    scoreElement.classList.add("hidden");

    switch (gameState.screen) {
        case "menu":
            document.getElementById("menu-screen").classList.remove("hidden");
            break;

        case "tutorial":
            document.getElementById("tutorial-screen").classList.remove("hidden");
            break;

        case "playing":
            document.getElementById("game").classList.remove("filtered");
            scoreElement.classList.remove("hidden");

            // Subimos hasta arriba por si acaso venimos de un zoom anterior que nos descoloca el canvas
            setTimeout(() => {
                window.scrollTo({top: 0, behavior: 'smooth'});
            }, 10); // Así da tiempo a los iPhone a procesar el clic del botón antes de hacer scroll, es un bug de iOS
            
            break;

        case "game-over":
            document.getElementById("game-over-screen").classList.remove("hidden");
            //document.getElementById("player-name").focus();
            break;

        case "leaderboard":
            document.getElementById("leaderboard-screen").classList.remove("hidden");
            renderLeaderboard();
            break;
    }
}

// Cambio de pantalla
function changeScreen(nextScreen) {
    if(visualizacionCorrecta()){
        gameState.screen = nextScreen;
        updateScreens();
    }
}



// Puntuación final y cambio a pantalla de game over
function loseGame() {
    document.getElementById("final-score").textContent = gameState.score;
    changeScreen("game-over");
}



// Salto del pájaro gracias a su aleteo
function jump() {
    if (gameState.screen !== "playing") {
        return;
    }

    gameState.bird.velocity = GAME_CONFIG.jumpForce;
}



// Crear cada tubería
function createPipe() {
    gameState.pipes.push({
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
    const bird = gameState.bird;

    bird.velocity += GAME_CONFIG.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0 || bird.y > canvas.height) {
        loseGame();
    }
}

// Física de las tuberías
function updatePipes() {
    const bird = gameState.bird;

    gameState.pipes.forEach(pipe => {

        pipe.x -= GAME_CONFIG.pipeSpeed;

        const collisionX =
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width;

        const collisionY =
            bird.y - bird.radius < pipe.topHeight ||
            bird.y + bird.radius > pipe.topHeight + pipe.gap;

        if (collisionX && collisionY) {
            loseGame();
        }

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            gameState.score++;

            scoreElement.textContent = gameState.score;
        }
    });

    gameState.pipes =
        gameState.pipes.filter(
            pipe => pipe.x > -100
        );

    const lastPipe = gameState.pipes.at(-1);

    if (!lastPipe || lastPipe.x < 220) {
        createPipe();
    }
}



// Dibuja y colorea el pájaro
function drawBird() {
    ctx.save();

    // Mover el origen al centro del pájaro
    ctx.translate(
        gameState.bird.x,
        gameState.bird.y
    );

    // Inclinación según la velocidad
    ctx.rotate(gameState.bird.velocity * 0.05);



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

    gameState.pipes.forEach(pipe => {

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



// Crear nueva partida con sus valores iniciales
function initializeGame() {
    gameState.score = 0; // Contador de puntos a cero
    gameState.bird = {
        x: 80,
        y: 120, // Mismo valor que al iniciarlo en el estado global
        radius: 16,
        velocity: 0 // Mismo valor que al iniciarlo en el estado global
    };
    gameState.pipes = [];
    scoreElement.textContent = 0;
}

// Comenzar juego tras seleccionar nivel de dificultad
function startGame(level) {
    gameState.difficulty = DIFFICULTIES[level].levelName;
    GAME_CONFIG = DIFFICULTIES[level];
    initializeGame();
    changeScreen("playing");
}



// Game loop de la aplicación
function updateGame() {
    // Esta es una variante de comprobación de visualizacionCorrecta() para evitar trampas
    if (window.innerHeight < window.innerWidth && window.innerHeight < 450) {
        return; // Lo interesante es que esto también sirve como pausa del juego sin errores
    } else { // Sólo continúa el juego con la orientación y altura mínima adecuada
        updateBird();
        updatePipes();
    }
}

function gameLoop() {
    if (gameState.screen === "playing") {
        updateGame();
        renderGame();
    }

    requestAnimationFrame(gameLoop);
}
// Fin del game loop



// Eventos de la aplicación

// Eventos de clic
document.querySelectorAll("[data-level]").forEach(boton => {
    boton.addEventListener( "click", () => {
        if(visualizacionCorrecta()){
            startGame(boton.dataset.level);
        }
    });
});

document.getElementById("show-tutorial").addEventListener("click",() => changeScreen("tutorial"));

document.getElementById("show-ranking").addEventListener("click",() => changeScreen("leaderboard"));

document.getElementById("back-menu").addEventListener("click",() => changeScreen("menu"));

document.getElementById("continue-to-menu").addEventListener("click",() => {
    // Subimos hasta arriba por si acaso tras manejar el input con el teclado táctil hay un descoloque del scroll
    setTimeout(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, 10); // Así da tiempo a los iPhone a procesar el clic del botón antes de hacer scroll, es un bug de iOS

    changeScreen("menu");
});

// Guardar puntuación
document.getElementById("save-score").addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();

    if (!name) return;

    const scores = getScores();

    scores.push({
        user: name,
        score: gameState.score,
        difficulty: gameState.difficulty
    });

    scores.sort( (a, b) => b.score - a.score );

    scores.splice(10);

    saveScores(scores);
    
    // Subimos hasta arriba por si acaso tras manejar el input con el teclado táctil hay un descoloque del scroll
    setTimeout(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, 10); // Así da tiempo a los iPhone a procesar el clic del botón antes de hacer scroll, es un bug de iOS

    changeScreen("leaderboard");
});

document.getElementById("go-to-menu").addEventListener("click",() => changeScreen("menu"));

document.getElementById("clear-all").addEventListener("click",() => dialogRanking.showModal());

document.getElementById("cancel-deletion").addEventListener("click",() => dialogRanking.close());

document.getElementById("confirm-deletion").addEventListener("click",() => {
    localStorage.clear();
    document.getElementById("leaderboard").innerHTML = `Acabas de borrar estos datos.`;
    dialogRanking.close();
});



// Listener de teclado
window.addEventListener("keydown", event => {
    if (gameState.screen !== "playing") {
        return;
    }

    // Ayuda a volar más rápido usando varias teclas seguidas
    if (event.key === 'e' || event.key === 'E' ||
        event.key === 'f' || event.key === 'F' ||
        event.key === 'j' || event.key === 'J' ||
        event.key === 'i' || event.key === 'I' ||
        event.code === "Space") {
        jump();
    }
});

// Listener de ratón
window.addEventListener('mousedown', function(e) {
    if (gameState.screen !== "playing") {
        return;
    }

    // Evita la selección de texto y el comportamiento de arrastre por defecto
    e.preventDefault();
    
    // Acción de ratón
    jump();
});

// Listener de pantalla táctil
window.addEventListener('touchstart', function(e) {
    if (gameState.screen !== "playing") {
        return;
    }

    // Evita el comportamiento por defecto (scroll, zoom o selección)
    e.preventDefault();

    // Acción táctil
    jump();
}, { passive: false });



// Iniciar la aplicación
visualizacionCorrecta();
updateScreens();
gameLoop();