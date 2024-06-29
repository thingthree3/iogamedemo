/**
 * @returns {Promise<{[key: string]: HTMLImageElement}>}
 */
const loadImages = async function(){
    const response = await fetch("https://raw.githubusercontent.com/thingthree3/iogamedemo/main/backend/Tiled-levelEditor/level-data/images.json");
    if(!response.ok)
        throw new Error(response.statusText);
    const json = await response.json();
    const loadedImageData = {};
    console.log(json)
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

export { loadImages };