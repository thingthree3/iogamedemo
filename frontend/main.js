import createRoutes from "./routes.js";
import registerNavigator from "./serviceWorker.js";
import { loadImages } from "./utils.js";
import Game from "./Game.js";

// setup
/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('GameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/**@type {CanvasRenderingContext2D } */
const ctx = canvas.getContext("2d");
/**@type {Game} */
const game = new Game(canvas.width, canvas.height);
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

// make sure the window and dom is ready
const startGameCondition1 = new Promise(res => window.addEventListener("load", () => res()));
// load all necesarry game images
const startGameCondition2 = new Promise(res => loadImages().then(
    /**@param {{[key: string]: HTMLImageElement}} */
    imageData => {
        registerNavigator(Object.keys(imageData));
        game.imageData = imageData;
        res();
})); // loadImages();

// var forceRate = 60, current = forceRate;
// var load = 0, loadTime = 0;

// function FrameRate(samples = 20) {
//     const times = [];
//     var s = samples;
//     while(s--) { times.push(0) }
//     var head = 0, total = 0, frame = 0, previouseNow = 0, rate = 0, dropped = 0;
//     const rates = [0, 10, 12, 15, 20, 30, 60, 90, 120, 144, 240];
//     const rateSet = rates.length;
//     const API = {
//         sampleCount: samples,
//         reset() {
//             frame = total = head = 0;
//             previouseNow = performance.now();
//             times.fill(0);
//         },
//         set tick(soak) {
//             const now = performance.now()
//             total -= times[head];
//             total += (times[head++] = now - previouseNow);
//             head %= samples;
//             frame ++;
//             previouseNow = now
//         },
//         get rate() { return frame > samples ? 1000 / (total / samples) : 1 },
//         get FPS() {
//             var r = API.rate, rr = r | 0, i = 0;
//             while (i < rateSet && rr > rates[i]) { i++ }
//             rate = rates[i];
//             dropped = Math.round((total - samples * (1000 / rate)) / (1000 / rate));
//             return rate;
//         },
//         get dropped() { return dropped },
//     };
//     return API;
// }

// const fRate = FrameRate();
// var frame = 0;
// // requestAnimationFrame(loop);
// fRate.reset();
// function loop() {
//     frame++;
//     fRate.tick = 1;
//     if (load) {
//         const pnow = performance.now() + loadTime;
//         while (performance.now() < pnow) game.update();
//     }

//     game.render(ctx);
//     if (current > forceRate) {
//         current /= 2;
//     } else {
//         requestAnimationFrame(loop);
//         if (current < forceRate) {
//             current *= 2;
//             requestAnimationFrame(loop);
//         }
//     }

// }

function FrameRate(samples = 20) {
    const times = [];
    var s = samples;
    while(s--) { times.push(0) }
    var head = 0, total = 0, frame = 0, previouseNow = 0, rate = 0, dropped = 0;
    const rates = [0, 10, 12, 15, 20, 30, 60, 90, 120, 144, 240];
    const rateSet = rates.length;
    const API = {
        sampleCount: samples,
        reset() {
            frame = total = head = 0;
            previouseNow = performance.now();
            times.fill(0);
        },
        set tick(soak) {
            const now = performance.now()
            total -= times[head];
            total += (times[head++] = now - previouseNow);
            head %= samples;
            frame ++;
            previouseNow = now
        },
        get rate() { return frame > samples ? 1000 / (total / samples) : 1 },
        get FPS() {
            var r = API.rate, rr = r | 0, i = 0;
            while (i < rateSet && rr > rates[i]) { i++ }
            rate = rates[i];
            dropped = Math.round((total - samples * (1000 / rate)) / (1000 / rate));
            return rate;
        },
        get dropped() { return dropped },
    };
    return API;
}

const fRate = FrameRate();
var frame = 0;

fRate.reset();
function loop() {
    frame++;
    fRate.tick = 1;
    game.render(ctx);
    requestAnimationFrame(loop);
}

// // game render loop
// let lasttime = 0;
// const renderLoop = function(timeStamp) {
//     const deltatime = timeStamp - lasttime;
//     lasttime = timeStamp;
//     // console.log(deltatime)
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     game.render(ctx, deltatime);
//     requestAnimationFrame(renderLoop);
// }


// start game once all conditions are fulfilled
Promise.all([startGameCondition1, startGameCondition2]).then(() => {
    // renderLoop(0);
    requestAnimationFrame(loop);
});