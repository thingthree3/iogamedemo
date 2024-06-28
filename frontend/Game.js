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
    constructor(){

    }
};