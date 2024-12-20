// import * as BrotliPromise from '../../../brotliFixer.cjs';
import Player from "../classses/entities/player/Player.js";
import Game from "../classses/Game.js";

// const brotli = await BrotliPromise.default;

/**
 * @param {Game} game 
 * @returns {(socket: SocketIO.Client) => void}
 */
export default (game) => {
    /**
     * @param {SocketIO.Client} socket
     * @returns {void}
     */
    return function(socket) {
        // think abot this -- in progress(open)
        /**
         * player id will be some number relivant to the server while to will be unique for each client.
         * thought: we hash the player ip with Math.random or something else and possibly even a third item to get the token.
         * then we send it to a data base like firebase, redis, mongodb, etc.(sql based database not necessary).
         * make sure we secure the data base so hackers can't access it.
         * 
         * VV need to think about more, ignore this
         * then we set a deletion time (very long just in case, maybe 5 hours) and/or
         * we delete token whene 
         */
        console.log(`new connection. id: ${socket.id}, ip: ${socket.handshake.address}`);
        // socket.id = Math.random();
        const player = new Player(socket, 1300, 1000);

        socket.customOn = function(routeName, callbackfn) {
            // we're only sending objects for simplicity xoxo no string|number|boolean
            socket.on(routeName, function(obj) {
                // track player activity and data sent
                player.socketActivity++;
                if(typeof obj !== "object" || obj.length > 1000) {
                    console.log("incompatible or to large data", obj.length, obj);
                    player.disconnect();
                    console.error(`kicking player: ${player.socket.id} for security reasons. data: ${obj}, route: ${routeName}`);
                }
                try {
                    callbackfn(JSON.parse(obj.toString()));
                } catch (error) {
                    // idk if we should kick the player or not XD
                    console.error(`failed to parse ${obj}, sent by ${player.socket.id} in route ${routeName}`);
                }
            });
        };

        socket.customEmit = function(routeName, data) {
            if(!data) {
                socket.emit(routeName);
                return;
            }
            socket.emit(routeName, Buffer.from(JSON.stringify(data)));
        };

        socket.customEmit("id", { id: socket.id });
        // kick player if not verified after 30 seconds
        const kickPlayerTimeoutID = setTimeout(() => {
            console.log("kicking player" + socket.id);
            socket.customEmit("reload", {reload: "reload"});
            player.disconnect();
        }, 80000);
        // socket.handshake.address

        socket.customOn("verify", data => {
            if(!player.socket.id === data.id) {
                console.log("player verification failed");
                socket.customEmit("reload", {reload: "reload"});
                player.disconnect();
            }else{
                console.log(`player ${data.id} verified`);
                game.addPlayer(player);
            }
            clearTimeout(kickPlayerTimeoutID);
        });

        socket.customOn("keyEvent", data => player.setActionKey(data));

        socket.on("disconnect", () => {
            console.log(`Player ${player.socket.id} disconnected`);
            player.disconnect();
        });

        socket.customOn("playerRotation", ({rotation}) => player.setPlayerRotation(rotation));
    }
};