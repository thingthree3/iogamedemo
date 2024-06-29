export default class Game {
    /**@type {{x: number, y: number, id: number, type: number}[]} */
    entities = [];
    player = {
        isWritting: false,
        id: null,
        socket: io("http://localhost:3000"),
        mousePosToSend: {
            x: 0,
            y: 0,
        }
    };
    /**
     * 
     * @param {{[key: string]: HTMLImageElement]}} imageData 
     */
    constructor(imageData){
        this.imageData = imageData;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx){
        ctx.drawImage(this.imageData['background'], 0, 0);
    }
};