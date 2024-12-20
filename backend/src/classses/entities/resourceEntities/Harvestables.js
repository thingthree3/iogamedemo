import { Body } from "../../../../../shared/physics.js";
import Entity from "../Entity.js";
import Player from "../player/Player.js";
import EntityData from "./../../../../resources/level-data/EntityLoadData.json" assert { type: "json" };

export default class Harvestable extends Entity {
    /**
     * 
     * @param {string} name 
     * @param {Body} hitbox 
     */
    constructor(name, hitbox) {
        super(hitbox, true, EntityData["resourceEntities"][name]["health"]);
        this.name = name;
    }

    /**
     * 
     * @param {Player} player 
     */
    hit(player) {
        super.hit(player);
        player.inventory.addItem(this.name);
        super.alterHealth(player.tool.data);
    }
}