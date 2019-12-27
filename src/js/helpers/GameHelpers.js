import * as CollisionFlags from "../constants/CollisionDataFlags";

export function hasLineOfSight(instance, point1, point2) {
    const p1 = point1;
    const p2 = point2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dxAbs = Math.abs(dx);
    const dyAbs = Math.abs(dy);
    
    if (p1.x === p2.x && p1.y === p2.y) {
        return true;
    }
    
    function getFlag(x, y) {
        return instance.map.collisionFlags[y * instance.map.width + x];
    }

    let xFlags = CollisionFlags.BLOCK_LINE_OF_SIGHT_FULL;
    let yFlags = CollisionFlags.BLOCK_LINE_OF_SIGHT_FULL;
    if (dx < 0) {
        xFlags |= CollisionFlags.BLOCK_LINE_OF_SIGHT_EAST;
    }
    else {
        xFlags |= CollisionFlags.BLOCK_LINE_OF_SIGHT_WEST;
    }
    if (dy < 0) {
        yFlags |= CollisionFlags.BLOCK_LINE_OF_SIGHT_NORTH;
    }
    else {
        yFlags |= CollisionFlags.BLOCK_LINE_OF_SIGHT_SOUTH;
    }

    if (dxAbs > dyAbs) {
        let x = p1.x;
        let yBig = p1.y << 16; // The y position is represented as a bigger number to handle rounding
        const slope = (dy << 16) / dxAbs;
        yBig += 0x8000; // Add half of a tile
        if (dy < 0) {
            yBig--; // For correct rounding
        }
        const direction = dx < 0 ? -1 : 1;

        while (x != p2.x) {
            x += direction;
            const y = yBig >>> 16;
            if ((getFlag(x, y) & xFlags) != 0) {
                // Collision while traveling on the x axis
                return false;
            }
            yBig += slope;
            const nextY = yBig >>> 16;
            if (nextY != y && (getFlag(x, nextY) & yFlags) != 0) {
                // Collision while traveling on the y axis
                return false;
            }
        }
    }
    else {
        let y = p1.y;
        let xBig = p1.x << 16; // The x position is represented as a bigger number to handle rounding
        const slope = (dx << 16) / dyAbs;
        xBig += 0x8000; // Add half of a tile
        if (dx < 0) {
            xBig--; // For correct rounding
        }
        const direction = dy < 0 ? -1 : 1;

        while (y != p2.y) {
            y += direction;
            const x = xBig >>> 16;
            if ((getFlag(x, y) & yFlags) != 0) {
                // Collision while traveling on the y axis
                return false;
            }
            xBig += slope;
            const nextX = xBig >>> 16;
            if (nextX != x && (getFlag(nextX, y) & xFlags) != 0) {
                // Collision while traveling on the x axis
                return false;
            }
        }
    }

    // No collision
    return true;
}
