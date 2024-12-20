import { frameRate } from "./utils.js";
import Constants from "../shared/Constants.js";
import Player from "./Player.js";

export default class Game {
    /**@type {{x: number, y: number, rotation: number, type: number}[]} */
    #entities = [];
    /**@type {{id: string; x: number; y: number; rotation: number; name: string; tool: { x: number; y: number; width: number; height: number; rotation: number;}}[]} */
    #players = [];
    /**@type {Player} */
    player = null;
    /**@type {{[key: string]: {type: "singular", image: HTMLImageElement, offsetX?: number, offsetY?: number} | {type: "spriteSheet", image: HTMLImageElement, framesX?: number, framesY?: number, spacing?: number, offsetX?: number, offsetY?: number} {type: "imageCollection", image: HTMLImageElement, number, offsetX?: number, offsetY?: number, sptires: {[key: string]:{srcX: number, srcY: number, width: number, height: number}}}}} */
    imageData = null;
    #scrollAreaHeight
    #scrollAreaWidth
    /**
     * @param {{[key: string]: {type: "singular", image: HTMLImageElement, offsetX?: number, offsetY?: number} | {type: "spriteSheet", image: HTMLImageElement, framesX?: number, framesY?: number, spacing?: number, offsetX?: number, offsetY?: number} {type: "imageCollection", image: HTMLImageElement, number, offsetX?: number, offsetY?: number, sptires: {[key: string]:{srcX: number, srcY: number, width: number, height: number}}}}} imageData
     * @param {number} width
     * @param {number} height
     */
    constructor(imageData, width, height){
        this.imageData = imageData;
        this.screenWidth = width;
        this.screenHeight = height;
        this.#scrollAreaHeight = height / 4;
        this.#scrollAreaWidth = width / 4;
        this.offsetX = 1;
        this.offsetY = 1;
        this.player = new Player(this);
        this.fRate = frameRate();
        console.log(this.imageData);
        this.r = 0;
        // setInterval(() => this.update(), 1000 / 90);
        // this.imageData = imageData;
    }

    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        this.fRate.tick = 1;
        this.update();
        this.#draw(ctx);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    #draw(ctx){
        ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        // draw background
        ctx.drawImage(this.imageData['background'].image, 0 - this.offsetX, 0 - this.offsetY, this.imageData['background'].image.width, this.imageData['background'].image.height);
        this.#drawEntities(ctx);
        this.#scrollWindow();
        this.drawPlayers(ctx);
    }

    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx
     */
    drawPlayers(ctx) {
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.font = "15px Arial";
        for (let i = 0; i < this.#players.length; i++){
            const player = this.#players[i];
            ctx.fillText(player.name + `${i + 1}`, player.x - this.offsetX, player.y -20 - this.offsetY);
            if(player.state != "normal"){
                // console.log(player.id === this.player.id);
                ctx.fillStyle = "red";
                ctx.arc(player.x - this.offsetX, player.y - this.offsetY, 10, 0, 2*Math.PI);
                ctx.fill();
                ctx.fillStyle = "black";
            }
            ctx.save();
            ctx.translate(player.x - this.offsetX, player.y - this.offsetY);
            ctx.rotate(player.rotation);
            ctx.drawImage(this.imageData['player'].image, -this.imageData['player'].image.width / 2, -this.imageData['player'].image.height / 2, this.imageData['player'].image.width, this.imageData['player'].image.height);
            this.r = this.r <= Math.PI / 2 ? Math.PI * 1.5 - 0.5 : this.r - 0.1; 
            ctx.rotate(Math.PI * 1.5 - 0.5);
            const toolWidth = this.imageData['tools'].image.width / this.imageData['tools'].framesX, toolHeight = this.imageData['tools'].image.height / this.imageData['tools'].framesY;
            // ctx.drawImage(
            //     this.imageData['tools'].image,
            //     0,
            //     0,
            //     toolWidth,
            //     toolHeight,
            //     -this.imageData['player'].image.width / 2 - 40,
            //     -this.imageData['player'].image.height / 2 - 40,
            //     toolWidth * 3,
            //     toolHeight * 3
            // );
            ctx.restore();
            ctx.save();
            // {
            //     "id": "eSsgtQZIgR7Zqn5NAAAD",
            //     "x": 1300,
            //     "y": 1000,
            //     "rotation": -0.027525003410587796,
            //     "name": "jim doe",
            //     "tool": {
            //         "x": 1324.990530275239,
            //         "y": 999.311961801665,
            //         "height": 26.832815729997478,
            //         "rotation": -0.027525003410587796,
            //         "imageSprite": {
            //             "x": 1319.9924242201912,
            //             "y": 999.449569441332,
            //             "rotation": -0.027525003410587796
            //         }
            //     }
            // }
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.arc(player.tool.imageSprite.x - this.offsetX, player.tool.imageSprite.y - this.offsetY, 2, 0, 2*Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.translate(player.tool.imageSprite.x - this.offsetX, player.tool.imageSprite.y - this.offsetY);
            ctx.rotate(player.tool.imageSprite.rotation);
            ctx.drawImage(
                this.imageData['tools'].image,
                0,
                0,
                toolWidth,
                toolHeight,
                -this.imageData['player'].image.width / 2 ,
                -this.imageData['player'].image.height / 2,
                toolWidth * 3,
                toolHeight * 3
            );
            // ctx.translate(player.tool.x - this.offsetX + player.tool.width / 2, player.tool.y - this.offsetY + player.tool.height / 2);
            // ctx.rotate(player.tool.rotation);
            // ctx.fillRect(-player.tool.width / 2, -player.tool.height / 2, player.tool.width, player.tool.height);
            ctx.restore();
            ctx.save();
            ctx.translate(player.tool.x - this.offsetX, player.tool.y - this.offsetY);
            ctx.rotate(player.tool.rotation);
            ctx.fillRect(-player.tool.width / 2, -player.tool.height / 2, player.tool.width, player.tool.height);
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.arc(player.tool.x - this.offsetX, player.tool.y - this.offsetY, 2, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.arc(player.x - this.offsetX, player.y - this.offsetY, 2, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    #drawEntities(ctx) {
        ctx.save();
        ctx.fillStyle = "red";
        for(const entity of this.#entities) {
            ctx.beginPath();
            ctx.arc(entity.x - this.offsetX, entity.y - this.offsetY, entity.radius ?? 20, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
    }

    #scrollWindow(){
        // if(
        //     ( (this.player.x + Constants.Player.radius - this.offsetX >= this.screenWidth - this.#scrollAreaWidth) && this.player.velocity.x > 0 ) ||
        //     ((this.player.x - this.offsetX <= this.#scrollAreaWidth) && this.player.velocity.x < 0)
        // ){
        //     this.offsetX += this.player.velocity.x;
        // }

        // bad code ik :<
        const playerDrawOffsetPositionY = this.player.y - this.offsetY;
        if((playerDrawOffsetPositionY >= this.screenHeight - this.#scrollAreaHeight) && this.player.y <= this.imageData['background'].image.height - this.#scrollAreaHeight) {
            this.offsetY -= ((this.screenHeight - this.#scrollAreaHeight) -(playerDrawOffsetPositionY));
        }
        if(playerDrawOffsetPositionY <= this.#scrollAreaHeight && this.player.y >= this.#scrollAreaHeight){
            this.offsetY += (playerDrawOffsetPositionY - this.#scrollAreaHeight);
        }

        const playerDrawOffsetPositionX = this.player.x - this.offsetX;
        if((playerDrawOffsetPositionX >= this.screenWidth - this.#scrollAreaWidth) && this.player.x <= this.imageData['background'].image.width - this.#scrollAreaWidth) {
            
            this.offsetX -= ((this.screenWidth - this.#scrollAreaWidth) -(playerDrawOffsetPositionX));
        }

        if(playerDrawOffsetPositionX <= this.#scrollAreaWidth && this.player.x >= this.#scrollAreaWidth){
            this.offsetX += (playerDrawOffsetPositionX - this.#scrollAreaWidth);
        }
    }

    /**
     * 
     * @param {{x: number, y: number, id: number, rotation: number}[]} players 
     */
    setPlayers(players){
        this.#players = players;
    }

    /**
     * 
     * @param {{x: number, y: number, rotation: number, type: number}[]} entities 
     */
    setEntities(entities){
        this.#entities = entities;
    }
    update(){
        this.#scrollWindow();
        this.player.update(this.#players);
    }

};