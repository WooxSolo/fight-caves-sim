import { Lvl22 } from "../entities/npcs/Lvl22";
import { Lvl45 } from "../entities/npcs/Lvl45";
import { Lvl90 } from "../entities/npcs/Lvl90";
import { Lvl180 } from "../entities/npcs/Lvl180";
import { Lvl360 } from "../entities/npcs/Lvl360";
import { Lvl702 } from "../entities/npcs/Lvl702";

export function loadNpcImage(level, game) {
    const image = new Image(128, 128);
    image.onload = () => game.renderHandler.needsRedraw = true;
    image.src = "/img/" + level + ".png";
    return image;
}

export function createNpc(type) {
    if (type === "lvl22") {
        return Object.create(Lvl22);
    }
    if (type === "lvl45") {
        return Object.create(Lvl45);
    }
    if (type === "lvl90") {
        return Object.create(Lvl90);
    }
    if (type === "lvl180") {
        return Object.create(Lvl180);
    }
    if (type === "lvl360") {
        return Object.create(Lvl360);
    }
    if (type === "lvl702") {
        return Object.create(Lvl702);
    }
    return null;
}

export function createNewNpc(type, instance, ...params) {
    if (type === "lvl22") {
        return new Lvl22(instance, ...params);
    }
    if (type === "lvl45") {
        return new Lvl45(instance, ...params);
    }
    if (type === "lvl90") {
        return new Lvl90(instance, ...params);
    }
    if (type === "lvl180") {
        return new Lvl180(instance, ...params);
    }
    if (type === "lvl360") {
        return new Lvl360(instance, ...params);
    }
    if (type === "lvl702") {
        return new Lvl702(instance, ...params);
    }
    return null;
}
