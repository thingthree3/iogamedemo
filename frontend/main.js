import createRoutes from "./routes.js";
import registerNavigator from "./serviceWorker.js";
import { loadImages } from "./utils.js";
import Game from "./Game.js";

// setup
var gameLoop = null;
/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('GameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/**@type {CanvasRenderingContext2D } */
const ctx = canvas.getContext("2d");

// make sure the window and dom is ready
const startGameCondition1 = new Promise(res => window.addEventListener("load", () => res()));
// load all necesarry game images
const startGameCondition2 = new Promise(res => loadImages().then(
    /**@param {{[key: string]: {type: "singular", image: HTMLImageElement, offsetX?: number, offsetY?: number} | {type: "spriteSheet", image: HTMLImageElement, framesX?: number, framesY?: number, spacing?: number, offsetX?: number, offsetY?: number} | {type: "imageCollection", image: HTMLImageElement, number, offsetX?: number, offsetY?: number, sptires: {[key: string]:{srcX: number, srcY: number, width: number, height: number}}}}} */
    imageData => {
        registerNavigator(Object.values(imageData).map(data => data.image.src));
        /**@type {Game} */
        const game = new Game(imageData, canvas.width, canvas.height);
        createRoutes(game);
        
        // fps is usually 60, but can be higher or lower depending on client hardware
        gameLoop = function() {
            game.render(ctx);
            requestAnimationFrame(gameLoop);
        };
        res();
})); // loadImages();


// start game once all conditions are fulfilled
Promise.all([startGameCondition1, startGameCondition2]).then(() => requestAnimationFrame(gameLoop));