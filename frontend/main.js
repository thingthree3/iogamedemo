import render from "./render.js";
import createRoutes from "./routes.js";
import registerNavigator from "./navigator.js";
import { loadImages } from "./utils.js";
import Game from "./Game.js";

// setup
/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('GameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/**@type {CanvasRenderingContext2D } */
const ctx = canvas.getContext("2d");

// make sure the window and dom is ready
const windowReady = new Promise(res => window.addEventListener("load", () => res()));
// load all necesarry game images--not all the images are needed at the start
const imagesReady = new Promise(res => loadImages().then(async function() {
    /**@type {Game} */
    const images = await loadImages();
    const game = new Game(images);
    createRoutes(game);

    // mousemovement update handler
    setInterval(() => game.player.socket.emit("mousePosition", game.player.mousePosToSend), 1000 / 20);

    // eventListners
    document.addEventListener("mousemove", ({clientX, clientY}) => game.player.mousePosToSend = {x: clientX, y: clientY});
    // optimize this VVV
    // if the key we are sending has a new state and is amovement key
    // or if we typing text to other players via speach box allot all key presses
    document.addEventListener("keydown", ({ code }) => game.player.socket.emit("keyEvent", {key: code, state: true}));
    document.addEventListener("keyup", ({ code }) => game.player.socket.emit("keyEvent", {key: code, state: false}));

    // game render loop
    let lasttime = 0;
    const renderLoop = function(timeStamp) {
        const deltatime = timeStamp - lasttime;
        lasttime = timeStamp;
        // console.log(deltatime)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        render(ctx, game, deltatime);
        requestAnimationFrame(renderLoop);
    }


    // -------start game once all conditions are fulfilled--------
    Promise.all([windowReady, imagesReady]).then(() => renderLoop(0));
}));
