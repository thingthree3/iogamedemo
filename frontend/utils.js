/**
 * @returns {Promise<{[key: string]: {type: "singular", image: HTMLImageElement, offsetX?: number, offsetY?: number} | {type: "spriteSheet", image: HTMLImageElement, framesX?: number, framesY?: number, spacing?: number, offsetX?: number, offsetY?: number} | {type: "imageCollection", image: HTMLImageElement, number, offsetX?: number, offsetY?: number, sptires: {[key: string]:{srcX: number, srcY: number, width: number, height: number}}}}>}
 */
const loadImages = async function(){
    const response = await fetch("./frontend/images.json");
    if(!response.ok)
        throw new Error(response.statusText);
    const imagesSources = await response.json();
    await Promise.allSettled(Object.keys(imagesSources).map(imageName => {
        const img = new Image();
        img.onerror = function(){throw new Error(`Failed to load image ${imageName}: ${imagesSources[imageName]}`);};
        const loadedImage = new Promise(res => {
            img.onload = () => {
                imagesSources[imageName].image = img;
                res();
            }
        });
        img.src = imagesSources[imageName].image;
        return loadedImage;
    }));

    return imagesSources; 
}
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
const frameRate = function(samples = 20) {
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
};
export { loadImages, frameRate };