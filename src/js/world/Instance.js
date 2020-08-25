import { Lvl702 } from "../entities/npcs/Lvl702";
import { Lvl360 } from "../entities/npcs/Lvl360";
import { Lvl180 } from "../entities/npcs/Lvl180";
import { Lvl90 } from "../entities/npcs/Lvl90";
import { Lvl45 } from "../entities/npcs/Lvl45";
import { Lvl22 } from "../entities/npcs/Lvl22";

export class Instance {
    constructor(game, map) {
        this.game = game;
        this.map = map;
        this.npcs = [];
        this.player = null;
        this.blockedTiles = {};
    }
    
    addNpc(npc) {
        this.npcs.push(npc);
        if (npc.blocksTiles) {
            for (let y = 0; y < npc.height; y++) {
                for (let x = 0; x < npc.width; x++) {
                    this.blockedTiles[(npc.x + x) + "," + (npc.y + y)] = true;
                }
            }
        }
    }
    
    loadNpcs(npcLvls, positions) {
        for (let i = 0; i < npcLvls.length; i++) {
            switch (npcLvls[i]) {
                case 702:
                    this.addNpc(new Lvl702(this, positions[i].x, positions[i].y));
                    break;
                case 360:
                    this.addNpc(new Lvl360(this, positions[i].x, positions[i].y));
                    break;
                case 180:
                    this.addNpc(new Lvl180(this, positions[i].x, positions[i].y));
                    break;
                case 90:
                    this.addNpc(new Lvl90(this, positions[i].x, positions[i].y));
                    break;
                case 45:
                    this.addNpc(new Lvl45(this, positions[i].x, positions[i].y));
                    break;
                case 22:
                    this.addNpc(new Lvl22(this, positions[i].x, positions[i].y));
            }
        }
        
        this.game.renderHandler.needsRedraw = true;
    }
    
    setPlayer(player) {
        if (this.player) {
            if (this.player.blocksTiles) {
                delete this.blockedTiles[this.player.x + "," + this.player.y];
            }
        }
        this.player = player;
        if (player) {
            if (player.blocksTiles) {
                this.blockedTiles[player.x + "," + player.y] = true;
            }
        }
    }
    
    removeNpc(index) {
        const npc = this.npcs[index];
        npc.isPendingRemoval = true;
        this.game.renderHandler.needsRedraw = true;
    }
    
    removeHoveredNpc() {
        const tileX = this.game.inputHandler.mouseX / this.game.renderHandler.cellWidth;
        const tileY = (this.game.renderHandler.canvas.current.height - this.game.inputHandler.mouseY) / this.game.renderHandler.cellWidth;
        for (let i = 0; i < this.npcs.length; i++) {
            const npc = this.npcs[i];
            if (tileX >= npc.x && tileX < npc.x + npc.width && tileY >= npc.y && tileY < npc.y + npc.height) {
                this.removeNpc(i);
                break;
            }
        }
    }
    
    clearNpcs() {
        for (const npc of this.npcs) {
            if (npc.blocksTiles) {
                for (let y = 0; y < npc.height; y++) {
                    for (let x = 0; x < npc.width; x++) {
                        delete this.blockedTiles[(npc.x + x) + "," + (npc.y + y)];
                    }
                }
            }
        }
        this.npcs = [];
    }
}
