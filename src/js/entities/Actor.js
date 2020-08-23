import { hasLineOfSight } from "../helpers/GameHelpers";
import * as CollisionFlags from "../constants/CollisionDataFlags";

export class Actor {
    constructor(instance, x, y) {
        this.instance = instance;
        this.x = x;
        this.y = y;
        this.width = 1;
        this.height = 1;
        this.target = null;
        this.attackSpeed = 4;
        this.lastAttackTick = -100;
        this.nextAttackTick = -100;
        this.blocksTiles = true;
    }
    
    move(dx, dy) {
        if (this.blocksTiles) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    delete this.instance.blockedTiles[(this.x + x) + "," + (this.y + y)];
                }
            }
        }
        this.x += dx;
        this.y += dy;
        if (this.blocksTiles) {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    this.instance.blockedTiles[(this.x + x) + "," + (this.y + y)] = true;
                }
            }
        }
    }
    
    getComparisonPointTo(other) {
        const p = {};
        if (other.x <= this.x) {
            p.x = this.x;
        }
        else if (other.x >= this.x + this.width - 1) {
            p.x = this.x + this.width - 1;
        }
        else {
            p.x = other.x;
        }
        if (other.y <= this.y) {
            p.y = this.y;
        }
        else if (other.y >= this.y + this.height - 1) {
            p.y = this.y + this.height - 1;
        }
        else {
            p.y = other.y;
        }
        return p;
    }
    
    getAxisDistancesTo(other) {
        const p1 = this.getComparisonPointTo(other);
        const p2 = other.getComparisonPointTo(this);
        return {
            x: Math.abs(p1.x - p2.x),
            y: Math.abs(p1.y - p2.y)
        }
    }
    
    isInMeleeDistanceTo(other) {
        if (this.instance !== other.instance) {
            return false;
        }
        
        const distances = this.getAxisDistancesTo(other);
        return distances.x + distances.y === 1;
    }
    
    intersectsWith(other) {
        if (this.instance !== other.instance) {
            return false;
        }
        
        const distances = this.getAxisDistancesTo(other);
        return distances.x + distances.y === 0;
    }

    canTravelInDirection(dx,dy){
        return this.canTravelInDirection(dx,dy,this.x,this.y)
    }
    
    canTravelInDirectionFrom(dx, dy, startX, startY) {
        dx = Math.sign(dx);
        dy = Math.sign(dy);
        
        if (dx === 0 && dy === 0) {
            return true;
        }
        
        startX += dx;
        startY += dy;
        const checkX = startX + (dx > 0 ? this.width - 1 : 0);
        const checkY = startY + (dy > 0 ? this.height - 1 : 0);
        const endX = startX + this.width - 1;
        const endY = startY  + this.height - 1;
        
        let xFlags = CollisionFlags.BLOCK_MOVEMENT_FULL;
        let yFlags = CollisionFlags.BLOCK_MOVEMENT_FULL;
        let xyFlags = CollisionFlags.BLOCK_MOVEMENT_FULL;
        let xWallFlagsSouth = CollisionFlags.BLOCK_MOVEMENT_FULL;
        let xWallFlagsNorth = CollisionFlags.BLOCK_MOVEMENT_FULL;
        let yWallFlagsWest = CollisionFlags.BLOCK_MOVEMENT_FULL;
        let yWallFlagsEast = CollisionFlags.BLOCK_MOVEMENT_FULL;
        
        if (dx < 0) {
            xFlags |= CollisionFlags.BLOCK_MOVEMENT_EAST;
            xWallFlagsSouth |= CollisionFlags.BLOCK_MOVEMENT_SOUTH | CollisionFlags.BLOCK_MOVEMENT_SOUTH_EAST;
            xWallFlagsNorth |= CollisionFlags.BLOCK_MOVEMENT_NORTH | CollisionFlags.BLOCK_MOVEMENT_NORTH_EAST;
        }
        if (dx > 0) {
            xFlags |= CollisionFlags.BLOCK_MOVEMENT_WEST;
            xWallFlagsSouth |= CollisionFlags.BLOCK_MOVEMENT_SOUTH | CollisionFlags.BLOCK_MOVEMENT_SOUTH_WEST;
            xWallFlagsNorth |= CollisionFlags.BLOCK_MOVEMENT_NORTH | CollisionFlags.BLOCK_MOVEMENT_NORTH_WEST;
        }
		if (dy < 0) {
			yFlags |= CollisionFlags.BLOCK_MOVEMENT_NORTH;
			yWallFlagsWest |= CollisionFlags.BLOCK_MOVEMENT_WEST | CollisionFlags.BLOCK_MOVEMENT_NORTH_WEST;
			yWallFlagsEast |= CollisionFlags.BLOCK_MOVEMENT_EAST | CollisionFlags.BLOCK_MOVEMENT_NORTH_EAST;
		}
		if (dy > 0) {
			yFlags |= CollisionFlags.BLOCK_MOVEMENT_SOUTH;
			yWallFlagsWest |= CollisionFlags.BLOCK_MOVEMENT_WEST | CollisionFlags.BLOCK_MOVEMENT_SOUTH_WEST;
			yWallFlagsEast |= CollisionFlags.BLOCK_MOVEMENT_EAST | CollisionFlags.BLOCK_MOVEMENT_SOUTH_EAST;
        }
        if (dx < 0 && dy < 0) {
			xyFlags |= CollisionFlags.BLOCK_MOVEMENT_NORTH_EAST;
		}
		if (dx < 0 && dy > 0) {
			xyFlags |= CollisionFlags.BLOCK_MOVEMENT_SOUTH_EAST;
		}
		if (dx > 0 && dy < 0) {
			xyFlags |= CollisionFlags.BLOCK_MOVEMENT_NORTH_WEST;
		}
		if (dx > 0 && dy > 0) {
			xyFlags |= CollisionFlags.BLOCK_MOVEMENT_SOUTH_WEST;
        }
        
        const getFlag = this.instance.map.getCollisionFlag.bind(this.instance.map);
        
		if (dx !== 0) {
			// Check that the area doesn't bypass a wall
			for (let y = startY; y <= endY; y++) {
				if ((getFlag(checkX, y) & xFlags) !== 0 || (this.canBeBlocked && this.instance.blockedTiles[checkX + "," + y])) {
					// Collision while attempting to travel along the x axis
					return false;
				}
			}

			// Check that the new area tiles don't contain a wall
			for (let y = startY + 1; y <= endY; y++) {
				if ((getFlag(checkX, y) & xWallFlagsSouth) !== 0) {
					// The new area tiles contains a wall
					return false;
				}
			}
			for (let y = endY - 1; y >= startY; y--) {
				if ((getFlag(checkX, y) & xWallFlagsNorth) !== 0) {
					// The new area tiles contains a wall
					return false;
				}
			}
		}
		if (dy != 0) {
			// Check that the area tiles don't bypass a wall
			for (let x = startX; x <= endX; x++) {
				if ((getFlag(x, checkY) & yFlags) !== 0 || (this.canBeBlocked && this.instance.blockedTiles[x + "," + checkY])) {
					// Collision while attempting to travel along the y axis
					return false;
				}
			}

			// Check that the new area tiles don't contain a wall
			for (let x = startX + 1; x <= endX; x++) {
				if ((getFlag(x, checkY) & yWallFlagsWest) !== 0) {
					// The new area tiles contains a wall
					return false;
				}
			}
			for (let x = endX - 1; x >= startX; x--) {
				if ((getFlag(x, checkY) & yWallFlagsEast) !== 0) {
					// The new area tiles contains a wall
					return false;
				}
			}
		}
		if (dx !== 0 && dy !== 0) {
			if ((getFlag(checkX, checkY) & xyFlags) !== 0 || (this.canBeBlocked && this.instance.blockedTiles[checkX + "," + checkY])) {
				// Collision while attempting to travel diagonally
				return false;
			}

			// When the areas edge size is 1 and it attempts to travel
			// diagonally, a collision check is done for respective
			// x and y axis as well.
			if (this.width === 1) {
				if ((getFlag(checkX, checkY - dy) & xFlags) !== 0 || (this.canBeBlocked && this.instance.blockedTiles[checkX + "," + (checkY - dy)])) {
					return false;
				}
			}
			if (this.height === 1) {
				if ((getFlag(checkX - dx, checkY) & yFlags) !== 0 || (this.canBeBlocked && this.instance.blockedTiles[(checkX - dx) + "," + checkY])) {
					return false;
				}
			}
		}

		return true;
    }
    
    distanceTo(other) {
        const distances = this.getAxisDistancesTo(other);
        return Math.max(distances.x, distances.y);
    }
    
    hasLineOfSightTo(other) {
        if (this.instance !== other.instance) {
            return false;
        }
        
        const p1 = this.getComparisonPointTo(other);
        const p2 = other.getComparisonPointTo(this);
        return hasLineOfSight(this.instance, p1, p2);
    }
}
