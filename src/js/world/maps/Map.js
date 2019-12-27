
export class Map {
    constructor(width, height, collisionFlags) {
        this.width = width;
        this.height = height;
        this.collisionFlags = collisionFlags;
        this.spawnPoints = [];
    }
    
    getCollisionFlag(x, y) {
        return this.collisionFlags[y * this.width + x];
    }
}
