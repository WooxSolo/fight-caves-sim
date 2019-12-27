
export class TickHandler {
    constructor(game) {
        this.game = game;
        this.tickCounter = 0;
    }
    
    processTick() {
        this.game.historyHandler.push();
        
        this.tickCounter++;
        
        for (let i = 0; i < this.game.instance.npcs.length; i++) {
            const npc = this.game.instance.npcs[i];
            npc.target = this.game.instance.player; // Normally don't want this line, but just for Fight Caves
            npc.processTick(this.tickCounter);
            if (npc.isPendingRemoval) {
                this.game.instance.npcs.splice(i, 1);
                i--;
            }
        }
        if (this.game.instance.player) {
            this.game.instance.player.processTick(this.tickCounter);
        }
        
        this.game.renderHandler.needsRedraw = true;
    }
}
