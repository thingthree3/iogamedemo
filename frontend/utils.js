/**
 * @returns {Promise<{[key: string]: HTMLImageElement}>}
 */
const loadImages = async function(){
    const response = await fetch("./frontend/images.json");
    if(!response.ok)
        throw new Error(response.statusText);
    const json = await response.json();
    console.log(json);
    /**`@type {{[key: string]: HTMLImageElement}} */
    const loadedImageData = {};
    await Promise.allSettled(json.map(imageData => {
        const img = new Image();
        img.onerror = function(){throw new Error(`Failed to load image ${imageData.src}`);};
        const loadedImage = new Promise(res => {
            img.onload = () => {
                loadedImageData[imageData.name] = img;
                res();
            }
        });
        img.src = imageData.src;
        return loadedImage;
    }));

    return loadedImageData; 
}

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
// requestAnimationFrame(loop);
// fRate.reset();
// function loop() {
//     frame++;
//     fRate.tick = 1;
//     meanRateEl.textContent = "Mean FPS: " + fRate.rate.toFixed(3);
//     FPSEl.textContent = "FPS: " + fRate.FPS;
//     droppedEl.textContent = "Dropped frames: " + fRate.dropped + " per " + fRate.sampleCount + " samples" ;
//     requestAnimationFrame(loop);
// }

export { loadImages};