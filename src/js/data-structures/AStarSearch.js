import PriorityQueue from "fastpriorityqueue";

function gameDistance(x1, y1, x2, y2) {
    return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function makePath(node) {
    const path = [];
    while (node) {
        path.push({
            x: node.x,
            y: node.y
        });
        node = node.prev;
    }
    path.pop();
    path.reverse();
    return path;
}

export function aStarSearch(startX, startY, targetX, targetY, getNextPoints, maxLocations = 10000) {
    const pq = new PriorityQueue((a, b) => {
        const d1 = a.steps + a.dist;
        const d2 = b.steps + b.dist;
        if (d1 !== d2) {
            return d1 < d2;
        }
        return a.num < b.num;
    });
    const seen = {};
    let totAdded = 0;
    pq.add({
        x: startX,
        y: startY,
        steps: 0,
        dist: gameDistance(startX, startY, targetX, targetY),
        prev: null,
        num: totAdded++
    });
    seen[startX + "," + startY] = true;
    let bestValue = Infinity;
    let bestValueNode = null;
    while (!pq.isEmpty()) {
        const node = pq.poll();
        
        if (node.x === targetX && node.y === targetY) {
            return makePath(node);
        }
        
        const value = manhattanDistance(node.x, node.y, targetX, targetY);
        if (value < bestValue) {
            bestValue = value;
            bestValueNode = node;
        }
        
        if (totAdded > maxLocations) {
            continue;
        }
        
        for (const point of getNextPoints(node.x, node.y)) {
            const posStr = point.x + "," + point.y;
            if (seen[posStr]) {
                continue;
            }
            seen[posStr] = true;
            pq.add({
                x: point.x,
                y: point.y,
                steps: node.steps + 1,
                dist: gameDistance(point.x, point.y, targetX, targetY),
                prev: node,
                num: totAdded++
            });
        }
    }
    
    return makePath(bestValueNode);
}
