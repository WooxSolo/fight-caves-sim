import { drawRect, drawImage, fillRect } from "../helpers/RenderHelpers";
import * as CollisionFlags from "../constants/CollisionDataFlags";

export class RenderHandler {
    constructor(game, canvas) {
        this.game = game;
        this.canvas = canvas;
        this.cellWidth = 13;
        this.needsRedraw = false;
        this.isRendering = false;
    }
    
    startRendering() {
        this.needsRedraw = true;
        this.isRendering = true;
        const render = () => {
            if (!this.isRendering) {
                return;
            }
            
            if (this.needsRedraw) {
                this.draw();
                this.needsRedraw = false;
            }
            
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
    
    stopRendering() {
        this.isRendering = false;
    }
    
    draw() {
        this._clear();
        this._drawInstance(this.game.instance);
        this._drawMouseHover();
    }
    
    _clear() {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    _drawInstance(instance) {
        this._drawMap(instance.map);
        this._drawBlockedTiles(instance);
        
        for (const npc of instance.npcs) {
            this._drawNpc(npc);
        }
        if (instance.player) {
            this._drawPlayer(instance.player);
        }
    }
    
    _drawMap(map) {
        const LOS_COLOR = "#000000";
        const MOVE_COLOR = "#999999";
        const GRID_COLOR = "#E2E2E2";
        const CHUNK_COLOR = "#E2E2E2";
        const SPAWN_COLOR = "#FF9900";
        
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        const cellWidth = this.cellWidth;
        
        // Draw grid
        ctx.lineWidth = 1;
        ctx.strokeStyle = GRID_COLOR;
        ctx.beginPath();
        for (let y = 1; y < map.height; y++) {
            ctx.moveTo(0, cellWidth * y);
            ctx.lineTo(map.width * cellWidth, cellWidth * y);
        }
        for (let x = 1; x < map.width; x++) {
            ctx.moveTo(cellWidth * x, 0);
            ctx.lineTo(cellWidth * x, map.height * cellWidth);
        }
        ctx.stroke();
        
        // Draw map chunks
        ctx.lineWidth = 2;
        ctx.strokeStyle = CHUNK_COLOR;
        ctx.beginPath();
        for (let y = 8; y < map.height; y += 8) {
            ctx.moveTo(0, cellWidth * y);
            ctx.lineTo(map.width * cellWidth, cellWidth * y);
        }
        for (let x = 8; x < map.width; x += 8) {
            ctx.moveTo(cellWidth * x, 0);
            ctx.lineTo(cellWidth * x, map.height * cellWidth);
        }
        ctx.stroke();
        
        // Draw collision maps
        ctx.lineWidth = 2;
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const flag = map.getCollisionFlag(x, y);
                if (flag & CollisionFlags.BLOCK_LINE_OF_SIGHT_FULL) {
                    ctx.fillStyle = LOS_COLOR;
                    ctx.fillRect(cellWidth * x, canvas.height - (y + 1) * cellWidth, cellWidth, cellWidth);
                }
                else if (flag & CollisionFlags.BLOCK_MOVEMENT_FULL) {
                    ctx.fillStyle = MOVE_COLOR;
                    ctx.fillRect(cellWidth * x, canvas.height - (y + 1) * cellWidth, cellWidth, cellWidth);
                }
                if (flag & CollisionFlags.BLOCK_LINE_OF_SIGHT_WEST) {
                    ctx.strokeStyle = LOS_COLOR;
                    ctx.beginPath();
                    ctx.moveTo(x * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.lineTo(x * cellWidth, canvas.height - y * cellWidth);
                    ctx.stroke();
                }
                else if (flag & CollisionFlags.BLOCK_MOVEMENT_WEST) {
                    ctx.strokeStyle = MOVE_COLOR;
                    ctx.beginPath();
                    ctx.moveTo(x * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.lineTo(x * cellWidth, canvas.height - y * cellWidth);
                    ctx.stroke();
                }
                if (flag & CollisionFlags.BLOCK_LINE_OF_SIGHT_EAST) {
                    ctx.strokeStyle = LOS_COLOR;
                    ctx.beginPath();
                    ctx.moveTo((x + 1) * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.lineTo((x + 1) * cellWidth, canvas.height - y * cellWidth);
                    ctx.stroke();
                }
                else if (flag & CollisionFlags.BLOCK_MOVEMENT_EAST) {
                    ctx.strokeStyle = MOVE_COLOR;
                    ctx.beginPath();
                    ctx.moveTo((x + 1) * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.lineTo((x + 1) * cellWidth, canvas.height - y * cellWidth);
                    ctx.stroke();
                }
                if (flag & CollisionFlags.BLOCK_LINE_OF_SIGHT_NORTH) {
                    ctx.strokeStyle = LOS_COLOR;
                    ctx.beginPath();
                    ctx.moveTo(x * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.lineTo((x + 1) * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.stroke();
                }
                else if (flag & CollisionFlags.BLOCK_MOVEMENT_NORTH_EAST) {
                    ctx.strokeStyle = MOVE_COLOR;
                    ctx.beginPath();
                    ctx.moveTo(x * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.lineTo((x + 1) * cellWidth, canvas.height - (y + 1) * cellWidth);
                    ctx.stroke();
                }
                if (flag & CollisionFlags.BLOCK_LINE_OF_SIGHT_SOUTH) {
                    ctx.strokeStyle = LOS_COLOR;
                    ctx.beginPath();
                    ctx.moveTo(x * cellWidth, canvas.height - y * cellWidth);
                    ctx.lineTo((x + 1) * cellWidth, canvas.height - y * cellWidth);
                    ctx.stroke();
                }
                else if (flag & CollisionFlags.BLOCK_MOVEMENT_SOUTH) {
                    ctx.strokeStyle = MOVE_COLOR;
                    ctx.beginPath();
                    ctx.moveTo(x * cellWidth, canvas.height - y * cellWidth);
                    ctx.lineTo((x + 1) * cellWidth, canvas.height - y * cellWidth);
                    ctx.stroke();
                }
            }
        }
        
        // Draw spawn points
        if (map.spawnPoints) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = SPAWN_COLOR;
            for (const spawnPoint of map.spawnPoints) {
                drawRect(canvas, cellWidth, spawnPoint.x, spawnPoint.y, 1, 1);
            }
        }
    }
    
    _drawBlockedTiles(instance) {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        const cellWidth = this.cellWidth;
        
        ctx.fillStyle = "#FF000033";
        for (let x = 0; x < instance.map.width; x++) {
            for (let y = 0; y < instance.map.height; y++) {
                if (instance.blockedTiles[x + "," + y]) {
                    fillRect(canvas, cellWidth, x, y, 1, 1);
                }
            }
        }
    }
    
    _drawNpc(npc) {
        const NPC_COLOR = "#FF0000";
        const NPC_ATTACKED_COLOR = "#66000099";
        
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        const cellWidth = this.cellWidth;
        
        // Draw NPC attacked
        if (npc.lastAttackTick === this.game.tickHandler.tickCounter) {
            ctx.fillStyle = NPC_ATTACKED_COLOR;
            fillRect(canvas, cellWidth, npc.x, npc.y, npc.size, npc.size);
        }
        
        // Draw NPC outline
        ctx.lineWidth = 2;
        ctx.strokeStyle = NPC_COLOR;
        drawRect(canvas, cellWidth, npc.x, npc.y, npc.size, npc.size);
        
        // Draw NPC image
        if (!npc.isPendingRemoval && npc.image) {
            drawImage(canvas, cellWidth, npc.image, npc.x, npc.y, npc.size, npc.size);
        }
    }
    
    _drawPlayer(player) {
        const PLAYER_COLOR = "#00BBFF";
        const DESTINATION_COLOR = "#FFFA00";
        const PATH_COLOR = "#CCCCFF";
        
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        const cellWidth = this.cellWidth;
        
        // Draw destination tile
        ctx.lineWidth = 1;
        if (player.destination && (player.destination.x !== player.x || player.destination.y !== player.y)) {
            ctx.strokeStyle = DESTINATION_COLOR;
            drawRect(canvas, cellWidth, player.destination.x, player.destination.y, 1, 1);
        }
        
        // Draw player itself
        ctx.fillStyle = PLAYER_COLOR;
        fillRect(canvas, cellWidth, player.x, player.y, 1, 1);
        
        // Draw destination path
        ctx.fillStyle = PATH_COLOR;
        for (let i = player.nextTravelPathIndex; i < player.travelPath.length; i++) {
            const p = player.travelPath[i];
            fillRect(canvas, cellWidth, p.x, p.y, 1, 1);
        }
    }
    
    _drawMouseHover() {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        const cellWidth = this.cellWidth;
        
        const { mouseX, mouseY } = {...this.game.inputHandler};
        if (mouseX !== null && mouseY !== null) {
            ctx.strokeStyle = "#00CBFF";
            ctx.lineWidth = 1;
            const gridX = Math.floor(mouseX / cellWidth);
            const gridY = Math.floor((canvas.height - mouseY) / cellWidth);
            drawRect(canvas, cellWidth, gridX, gridY, 1, 1);
        }
    }
}
