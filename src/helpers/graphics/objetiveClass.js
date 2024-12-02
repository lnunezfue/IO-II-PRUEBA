import { eval2 } from "../utils";

export class FuncionObjetivo {
    constructor() {
        if (arguments.length == 3) {
            this.obj = arguments[0];
            this.x = arguments[1];
            this.y = arguments[2];
        }
        else {
            alert("FuncionObjetivo (Error): numero de parametros incorrectos al invocar al constructor.");
        }
    }
    resolver(v1, v2) {
        return eval2(this.x * v1 + this.y * v2);
    }
    toString() {
        return this.obj + ": " + this.x + "X" + (this.y < 0 ? this.y : "+" + this.y) + "Y";
    }
}