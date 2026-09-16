# Flappy Bird Clone

Juego de habilidad, donde hacer volar un pájaro en dos dimensiones, teniendo cuidado de no salirse de la pantalla (cielo azul) ni tropezarse con los obstáculos (tuberías verdes). Es una imitación del juego original [Flappy Bird](https://es.wikipedia.org/wiki/Flappy_Bird) de 2013.


## 📈 Versión 1.1.1
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000) ![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)

Esta es una versión estable del proyecto, desarrollada únicamente con tecnologías Front-End nativas: JavaScript, HTML y CSS. Se utiliza la [API Canvas](https://developer.mozilla.org/es/docs/Web/API/Canvas_API) para el dibujado del pájaro y las tuberías.

Se ha testado con éxito en diferentes tamaños de pantalla, incluso en la de un *iPhone 4*. La aplicación no necesita procesos de compilación, ni instalación de dependencias, ni conexión a Internet.

En esta versión se puede elegir el nivel de dificultad y, al finalizar cada partida, las puntuaciones se pueden guardar en el `localStorage` (con la *key* "flappy-bird-scores"), quedando las 10 mejores, pero se pueden borrar en cualquier momento.


## 🎮 Jugar *online*
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white)

Gracias al despliegue en GitHub Pages, se puede jugar aquí:

👉 https://almagarinos.github.io/flappy-bird/ 👈

### Controles del juego ⌨

En dispositivos de pantalla táctil hay que pulsar sobre ella. En dispositivos con teclado hay que pulsar en la tecla "espacio". Y en dispositivos con ratón periférico hay que hacer clic en el botón izquierdo.

### Trucos y consejos 💡

Tras pasar cada hueco entre tuberías, se aconseja elevar el pájaro rápidamente para tener más facilidad de maniobra en el siguiente hueco, ya que es más rápido caer que subir.

Para subir más rápido, se puede hacer lo siguiente:
- En pantallas táctiles utilizaremos dos dedos de una mano, por ejemplo el índice y el medio. Haremos redobles de tambor con los dedos, como si estos fuesen baquetas y la pantalla fuese el tambor.
- En dispositivos de sobremesa, podemos usar la tecla "espacio" y el ratón al mismo tiempo, haciendo algo similar al redoble antes mencionado, en este caso con las dos manos.


## 💻 Instalación local

![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff)

Una vez se haya descargado este proyecto en un dispositivo local, ya no es necesario tener una conexión a Internet.

### Clonar repositorio ⬇️

Si se tiene instalado [Git](https://git-scm.com/), sólo hay que usar los siguientes comandos en un terminal, dentro de la ruta del directorio donde se quiera descargar el juego:
```bash
git clone https://github.com/almagarinos/flappy-bird   # Descarga el proyecto
flappy-bird\index.html                 # Ejecuta el juego en un navegador web
```

### Descargar fichero 🗂️
Se puede obtener todo el proyecto comprimido en [este ZIP](https://github.com/almagarinos/flappy-bird/archive/refs/heads/main.zip). Descomprímase su contenido dentro del directorio donde se quiera ubicar el juego, para luego abrir el archivo **index.html** en un navegador web.


## 📂 Estructura del proyecto

```bash
flappy-bird/
│
├── assets/
│   │
│   ├── css/
│   │   └── styles.css          # Estilos propios de la aplicación
│   │
│   ├── icon/
│   │   └── ...                 # Archivos de favicon, generados en https://favicon.io/
│   │
│   └── js/
│       └── app.js              # Lógica principal del juego, incluye comentarios
│
├── LICENSE.md                  # Archivo de licencia MIT en formato Markdown
│
├── README.md                   # Archivo "Léeme" del proyecto en Markdown
│
└── index.html                  # Punto de entrada de la aplicación
```


## 🕹️ Dinámica del juego

El flujo de la aplicación se repite cíclicamente y consiste en el siguiente:

```bash
    ┌───────────────────────┐
┌───┤  Ver el menú inicial  ├────┬─────────────┐
│   └───────────┬───────────┘    │             │
▲               │                │             │
│               ▼                ▼             ▼
│   ┌───────────────────────┐    │             │
│   │ Seleccionar nivel de  │    │             │
│   │  dificultad entre 3   │    │             │
│   └───────────┬───────────┘    │             │
▲               │                │             │
│               ▼                ▼             ▼
│   ┌───────────────────────┐    │    ┌─────────────────┐
│   │   Jugar una partida   │    │    │ Ver el tutorial │
│   └───────────┬───────────┘    │    └────────┬────────┘
▲               │                │             │
│               ▼                ▼             ▼
│   ┌───────────────────────┐    │             │
│   │ Guardar la puntuación │    │             │
│   └───────────┬───────────┘    │             │
▲               │                │             │
│               ▼                ▼             ▼
│   ┌───────────────────────┐    │             │
│   │    Ver el ranking     │ ← ─┘             │
│   └───────────┬───────────┘                  │
▲               │                              │
│               ▼                              ▼
│   ┌───────────────────────┐                  │
└───┤  Ir al menú inicial   │ ← ───────────────┘
    └───────────────────────┘
```