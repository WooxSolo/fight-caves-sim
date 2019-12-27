import { Actor } from "./Actor";
import { bfsSearch } from "../data-structures/BfsSearch";

export class Player extends Actor {
    constructor(instance, x, y) {
        super(instance, x, y);
        this.width = 1;
        this.height = 1;
        this.destination = {
            x: x,
            y: y
        };
        this.travelPath = [];
        this.nextTravelPathIndex = 0;
    }
    
    setDestination(x, y) {
        this.travelPath = this.getPathTo(x, y);
        this.nextTravelPathIndex = 0;
        if (this.travelPath.length > 0) {
            this.destination = {
                x: this.travelPath[this.travelPath.length - 1].x,
                y: this.travelPath[this.travelPath.length - 1].y
            };
        }
        else {
            this.destination = {
                x: this.x,
                y: this.y
            };
        }
    }
    
    getPathTo(x, y) {
        const order = [
            -1, 0,
            1, 0,
            0, -1,
            0, 1,
            -1, -1,
            -1, 1,
            1, -1,
            1, 1
        ];
        return bfsSearch(this.x, this.y, x, y, (x, y) => {
            const next = [];
            for (let i = 0; i < order.length; i += 2) {
                const dx = order[i];
                const dy = order[i + 1];
                if (this.canTravelInDirection(dx, dy, x, y)) {
                    next.push({
                        x: x + dx,
                        y: y + dy
                    });
                }
            }
            return next;
        });
    }
    
    processTick(gameTick) {
        this.processMovement();
        this.processMovement();
    }
    
    processMovement() {
        if (this.nextTravelPathIndex < this.travelPath.length) {
            const ix = this.nextTravelPathIndex;
            this.move(this.travelPath[ix].x - this.x, this.travelPath[ix].y - this.y);
            this.nextTravelPathIndex++;
        }
    }
}
