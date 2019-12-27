import { Player } from "../entities/Player";
import { createNpc } from "../entities/npcs/Npc";
import { createNewNpc } from "../helpers/NpcHelpers";

export class HistoryHandler {
    constructor(game) {
        this.game = game;
        this.history = [];
        this.historyIndex = 0;
        this.isMissingLast = true;
    }
    
    reset() {
        this.history = [];
        this.historyIndex = 0;
        this.isMissingLast = true;
    }
    
    loadCurrent() {
        const entry = this.history[this.historyIndex];
        this.game.instance.npcs = entry.npcs.map(v => Object.assign(Object.create(Object.getPrototypeOf(v)), v));
        this.game.instance.player = entry.player ? Object.assign(Object.create(Object.getPrototypeOf(entry.player)), entry.player) : null;
        this.game.instance.blockedTiles = {...entry.blockedTiles};
    }
    
    goBack() {
        if (this.historyIndex <= 0) {
            return;
        }
        
        this._pushIfMissingLast();
        
        this.historyIndex--;
        this.game.tickHandler.tickCounter--;
        this.loadCurrent();
        
        this.game.renderHandler.needsRedraw = true;
    }
    
    goForward() {
        if (this.historyIndex + 1 >= this.history.length) {
            return;
        }
        
        this.historyIndex++;
        this.game.tickHandler.tickCounter++;
        this.loadCurrent();
        
        this.game.renderHandler.needsRedraw = true;
    }
    
    _pushOnly() {
        const instance = this.game.instance;
        this.history.push({
            npcs: instance.npcs.map(v => Object.assign(Object.create(Object.getPrototypeOf(v)), v, { isPendingRemoval: false })),
            player: instance.player ? Object.assign(Object.create(Object.getPrototypeOf(instance.player)), instance.player) : null,
            blockedTiles: {...instance.blockedTiles}
        });
    }
    
    _pushIfMissingLast() {
        if (this.isMissingLast) {
            this._pushOnly();
            this.isMissingLast = false;
        }
    }
    
    push() {
        if (!this.isMissingLast) {
            this.history.pop();
        }
        this.isMissingLast = true;
        
        while (this.historyIndex < this.history.length) {
            this.history.pop();
        }
        
        this._pushOnly();
        this.historyIndex++;
    }
    
    getSerializedHistory() {
        this._pushIfMissingLast();
        
        const result = [];
        result.push(["total", this.history.length]);
        
        let prevDest = null;
        let prevNpcs = [];
        let prevPlayer = null;
        for (let i = 0; i < this.history.length; i++) {
            const entry = this.history[i];
            if (prevPlayer === null && entry.player !== null) {
                result.push(["player-spawn", i, entry.player.x, entry.player.y]);
            }
            if (prevPlayer !== null && entry.player === null) {
                result.push(["player-despawn", i]);
            }
            for (let i2 = 0; i2 < entry.npcs.length; i2++) {
                const npc = entry.npcs[i2];
                if (prevNpcs.filter(x => x.uniqueId === npc.uniqueId).length === 0) {
                    result.push(["npc-spawn", i, npc.type, npc.x, npc.y]);
                }
            }
            for (let i2 = 0; i2 < prevNpcs.length; i2++) {
                const npc = prevNpcs[i2];
                if (entry.npcs.filter(x => x.uniqueId === npc.uniqueId).length === 0) {
                    result.push(["npc-despawn", i, i2]);
                }
            }
            
            if (entry.player) {
                const dest = entry.player.destination;
                if (prevDest === null || dest.x !== prevDest.x || dest.y !== prevDest.y) {
                    result.push(["player-dest", i, dest.x, dest.y].join(","));
                }
            }
            
            prevPlayer = entry.player;
            prevNpcs = entry.npcs;
            prevDest = entry.player ? entry.player.destination : null;
        }
        
        return result.join(";");
    }
    
    loadSerializedHistory(serializedHistory) {
        this.game.reset();
        
        const npcSpawns = {};
        const npcDespawns = {};
        const playerSpawns = {};
        const playerDespawns = {};
        const playerDestChanges = {};
        let total = null;
        
        const entries = serializedHistory.split(";");
        for (const entry of entries) {
            const parts = entry.split(",");
            const event = parts[0];
            const tick = parts[1];
            if (event === "npc-spawn") {
                const type = parts[2];
                const x = parseInt(parts[3]);
                const y = parseInt(parts[4]);
                const npc = createNewNpc(type, this.game.instance, x, y);
                if (!npcSpawns[tick]) {
                    npcSpawns[tick] = [];
                }
                npcSpawns[tick].push(npc);
            }
            else if (event === "npc-despawn") {
                const pos = parseInt(parts[2]);
                if (!npcDespawns[tick]) {
                    npcDespawns[tick] = [];
                }
                npcDespawns[tick].push(pos);
            }
            else if (event === "player-spawn") {
                const x = parseInt(parts[2]);
                const y = parseInt(parts[3]);
                playerSpawns[tick] = new Player(this.game.instance, x, y);
            }
            else if (event === "player-despawn") {
                playerDespawns[tick] = true;
            }
            else if (event === "player-dest") {
                const x = parseInt(parts[2]);
                const y = parseInt(parts[3]);
                playerDestChanges[tick] = { x, y };
            }
            else if (event === "total") {
                total = parseInt(parts[1]);
            }
        }
        
        for (let i = 0; i < total; i++) {
            const stri = i + "";
            
            if (i > 0) {
                this.game.tickHandler.processTick();
            }
            
            if (npcSpawns[stri]) {
                for (const npc of npcSpawns[stri]) {
                    this.game.instance.addNpc(npc);
                }
            }
            if (npcDespawns[stri]) {
                npcDespawns[stri].sort((a, b) => b - a);
                for (const index of npcDespawns[stri]) {
                    this.game.instance.removeNpc(index);
                }
            }
            
            if (playerSpawns[stri]) {
                this.game.instance.setPlayer(playerSpawns[stri]);
            }
            if (playerDespawns[stri]) {
                this.game.instance.setPlayer(null);
            }
            
            if (playerDestChanges[stri]) {
                this.game.instance.player.setDestination(playerDestChanges[stri].x, playerDestChanges[stri].y);
            }
        }
        
        while (this.historyIndex > 0) {
            this.goBack();
        }
    }
}
