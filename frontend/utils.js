/**
 * @returns {Promise<PromiseSettledResult<HTMLImageElement>[]>}
 */
const loadImages = async function(){
    const response = await fetch("https://raw.githubusercontent.com/thingthree3/iogamedemo/main/backend/Tiled-levelEditor/level-data/images.json");
    if(!response.ok)
        throw new Error(response.statusText);
    const json = await response.json();
    return Promise.allSettled(json.map(imageData => {
        const img = new Image();
        // we might need to add a retry mechanism here
        img.onerror = function(){throw new Error(`Failed to load image ${imageData.src}`);};
        const loadedImage = new Promise(res => img.onload = res(img));
        img.src = imageData.src;
        return loadedImage;
    }));
}

export { loadImages };