import Player from "../classses/entities/player/Player.js";
import Game from "../classses/Game.js";
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
        socket.id = Math.random();
        socket.emit("id", { id: socket.id });
        const player = new Player(socket);
        // kick player if not verified after 30 seconds
        const kickPlayerTimeoutID = setTimeout(player.disconnect, 30000);
        game.addPlayer(player);

        // socket.handshake.address
        socket.on("disconnect", function() {
        });
        socket.on("verify", id => {
            const thisPlayer = game.players.find(player => player.id === id);
            if(!thisPlayer) {
                socket.emit("reload");
                player.disconnect();
            }
            clearTimeout(kickPlayerTimeoutID);
        });

        socket.on("keyEvent", data => player.setMovementKey(data));
        socket.on("PositionUpdate", 
            /**
             * 
             * @param {{x: number, y: number}[]} entities 
             */
            (entities) => {
                for(const entity of entities) {
                    game.updateEntityPosition(entity.id, entity.x, entity.y);
                }
        });

        socket.on("disconnect", () => player.disconnect());

        socket.on("mousePosition", data => player.setMousePosition(data.x, data.y));
    }
};