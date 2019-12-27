import { Npc } from "./Npc";
import { loadNpcImage } from "../../helpers/NpcHelpers";

export class Lvl90 extends Npc {
    constructor(instance, x, y) {
        super(instance, x, y);
        this.type = "lvl90";
        this.size = 3;
        this.width = 3;
        this.height = 3;
        this.maxAttackRange = 15;
        this.attackSpeed = 4;
        this.image = loadNpcImage(90, instance.game);
    }
}
