import Constants from "../shared/Constants.js";
import Player from "./Player.js";

export default class Game {
    /**@type {{x: number, y: number, id: number, type: number}[]} */
    entities = [];
    player = new Player();
    /**@type {{[key: string]: HTMLImageElement}} */
    imageData = null;
    #scrollAreaHeight
    #scrollAreaWidth
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height){
        this.screenWidth = width;
        this.screenHeight = height;
        this.#scrollAreaHeight = height / 5;
        this.#scrollAreaWidth = width / 5;
        this.offsetX = 0;
        this.offsetY = 0;
        // this.imageData = imageData;
    }

    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} deltaTime
     */
    render(ctx, deltaTime) {
        this.draw(ctx);
        this.drawPlayers(ctx);

    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx){
        ctx.drawImage(this.imageData['background'], 0 - this.offsetX, 0 - this.offsetY, this.imageData['background'].width, this.imageData['background'].height);
    }

    /**
     * @returns {void}
     * @param {CanvasRenderingContext2D} ctx
     */
    drawPlayers(ctx) {
        ctx.fillStyle = "#ededed";
        ctx.textAlign = "center";
        ctx.fillStyle = "#808080"
        ctx.font = "15px Arial";
        for (const entity of this.entities){
            ctx.beginPath();
            ctx.arc(entity.x - this.offsetX, entity.y - this.offsetY, Constants.playerConstants.radius, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
            if(entity.id == this.player.id) {
                ctx.fillText("YOU ARE HERE", entity.x - this.offsetX, entity.y - 10 - this.offsetY);
            }
        }
    }

    #scrollWindow(){
        // if(
        //     ( (this.player.x + Constants.playerConstants.radius - this.offsetX >= this.screenWidth - this.#scrollAreaWidth) && this.player.velocity.x > 0 ) ||
        //     ((this.player.x - this.offsetX <= this.#scrollAreaWidth) && this.player.velocity.x < 0)
        // ){
        //     this.offsetX += this.player.velocity.x;
        // }

        if((this.player.y + Constants.playerConstants.radius - this.offsetY >= this.screenHeight - this.#scrollAreaHeight)){
            const offsetMovementSpeed = Math.abs(this.player.velocity.y);
            this.offsetY -= ((this.screenHeight - this.#scrollAreaHeight) -(this.player.y + Constants.playerConstants.radius - this.offsetY)) * 0.02 * (offsetMovementSpeed > 5 ? offsetMovementSpeed : 5);
        }
        if(this.player.y - this.offsetY <= this.#scrollAreaHeight){
            const offsetMovementSpeed = Math.abs(this.player.velocity.y);
            this.offsetY += (this.player.y - this.offsetY - this.#scrollAreaHeight) * 0.02 * (offsetMovementSpeed > 5 ? offsetMovementSpeed : 5);
        }


        if((this.player.x + Constants.playerConstants.radius - this.offsetX >= this.screenWidth - this.#scrollAreaWidth)){
            const offsetMovementSpeed = Math.abs(this.player.velocity.x);
            this.offsetX -= ((this.screenWidth - this.#scrollAreaWidth) -(this.player.x + Constants.playerConstants.radius - this.offsetX)) * 0.02 * (offsetMovementSpeed > 5 ? offsetMovementSpeed : 5);
        }
        if(this.player.x - this.offsetX <= this.#scrollAreaWidth){
            const offsetMovementSpeed = Math.abs(this.player.velocity.x);
            this.offsetX += (this.player.x - this.offsetX - this.#scrollAreaWidth) * 0.02 * (offsetMovementSpeed > 5 ? offsetMovementSpeed : 5);
        }
    }

    /**
     * @param {{x: number, y: number, rotation: number, id: number, type: number}[]} entities
     */
    update(entities){
        this.entities = entities;
        // const player = this.entities.find(e => e.id === this.player.socket.id);
        this.player.update(entities);
        this.#scrollWindow();
    }

};