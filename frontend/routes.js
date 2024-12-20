// import brotliPromise from "https://unpkg.com/brotli-wasm@3.0.0/index.web.js?module";
import Game from "./Game.js";
import Constants from "../shared/Constants.js";
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// const brotli = await brotliPromise;
/**
 * @returns {void}
 * @param {Game} game 
 */
export default function createRoutes(game){
    
    // const emit = game.player.socket.emit.bind(game.player.socket);
    /**
     * 
     * @param {string} routeName 
     * @param {Object} data 
     */
    game.player.socket.customEmit = function(routeName, data) {
        // if(routeName === "mouseEvent") {
        //     const pp = textEncoder.encode(JSON.stringify(data));
        //     console.log(textDecoder.decode(pp));
        //     console.log("mouseEvent", pp.toString());
        //     console.log(JSON.parse(pp.toString()));
        // }
        // game.player.socket.emit(routeName, brotli.decompress(textEncoder.encode(JSON.stringify(data))));
        game.player.socket.emit(routeName, textEncoder.encode(JSON.stringify(data)));
    };

    /**
     * 
     * @param {string} routeName 
     * @param {(data: Object) => void} callback 
     */
    game.player.socket.customOn = function(routeName, callback) {
        game.player.socket.on(routeName, data => {
            if(data)
                // callback(JSON.parse(textDecoder.decode(brotli.decompress(data))));
                callback(JSON.parse(textDecoder.decode(data)));
            else
                callback();
        });
    }
    
    game.player.socket.customOn("id", function(data) {
        console.log("id", data.id);
        if(game.player.id) {
            console.log("frontend kicking player " + game.player.id);
            game.player.socket.disconnect();
            location.reload();
        }
        console.log("Your id is " + data.id + "socket id: " + game.player.socket.id);
        game.player.id = data.id;
        setTimeout(() => game.player.socket.customEmit("verify", {id: data.id}), 2000);// tell server not to kick us
    });
    game.player.socket.customOn("playersPositionUpdate", players => game.setPlayers(players));
    game.player.socket.customOn("staticEntitiesPositionUpdate", entities => game.setEntities(entities));
    game.player.socket.customOn("reload", () => location.reload());// change once we publish to actual production

    // mousemovement update handler
    setInterval(() => game.player.socket.customEmit("playerRotation", {rotation: game.player.rotation}), 1000 / 60);

    // ----  eventListners ----
    document.addEventListener("keydown", ({ code }) => {
            if(!game.player.isTyping){
                if(Constants.Player.actionKeyMap[code] != undefined)
                    game.player.socket.customEmit("keyEvent", {key: code, state: true});
            }else{
                // handle sending message
            }
    });
        
    document.addEventListener("keyup", ({ code }) => {
            if(!game.player.isTyping){
                if(Constants.Player.actionKeyMap[code] != undefined)
                    game.player.socket.customEmit("keyEvent", {key: code, state: false});
            }else{
                // handle sending message
            }
    });

    document.addEventListener("mousemove", ({clientX, clientY}) => {
        game.player.mousePosition.x = clientX;
        game.player.mousePosition.y = clientY;
    });

    document.addEventListener("mousedown", e => {
        game.player.socket.customEmit("keyEvent", {key: "mouse", state: true});
    });

    document.addEventListener("mouseup", e => {
        game.player.socket.customEmit("keyEvent", {key: "mouse", state: false});
    });
};