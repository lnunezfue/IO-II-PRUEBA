import { Racional } from "../rational";

export class jsx_restriccion {
    constructor() {
        if (arguments.length < 3) {
            alert("N\xfamero de par\xe1metros incorrecto al crear un objeto de tipo restricci\xf3n.");
            return null;
        }
        this.funcion = new Array();
        if (arguments[0] instanceof Array) {
            for (var i = 0; i < arguments[0].length; i++) {
                if (isNaN(parseFloat(arguments[0][i]))) {
                    alert("Par\xe1metro incorrecto al crear un objeto de tipo restricci\xf3n.");
                    return null;
                }
                if (arguments[0][i] instanceof Racional) {
                    this.funcion[i] = arguments[0][i];
                }
                else {
                    this.funcion[i] = new Racional(parseFloat(arguments[0][i]));
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length - 2; i++) {
                if (isNaN(parseFloat(arguments[i]))) {
                    alert("Par\xe1metro incorrecto al crear un objeto de tipo restricci\xf3n.");
                    return null;
                }
                if (arguments[i] instanceof Racional) {
                    this.funcion[i] = arguments[i];
                }
                else {
                    this.funcion[i] = new Racional(parseFloat(arguments[i]));
                }
            }
        }
        if (arguments[arguments.length - 2] != "<=" && arguments[arguments.length - 2] != ">=" && arguments[arguments.length - 2] != "=") {
            alert("Error al crear una restricci\xf3n, el pen\xfaltimo argumento debe ser '<=' o '>='.");
        }
        this.signo = arguments[arguments.length - 2];
        if (isNaN(parseFloat(arguments[arguments.length - 1]))) {
            alert("Error al crear una restricci\xf3n, el \xfaltimo argumento debe ser de tipo num\xe9rico.");
        }
        if (arguments[arguments.length - 1] instanceof Racional) {
            this.limite = arguments[arguments.length - 1];
        }
        else {
            this.limite = new Racional(arguments[arguments.length - 1]);
        }
    }
    toString() {
        var res = this.funcion[0] + "x1";
        for (var i = 1; i < this.funcion.length; i++) {
            res += (this.funcion[i] >= 0 ? "+" : "") + this.funcion[i] + "x" + (i + 1);
        }
        res += this.signo;
        res += this.limite;
        return res;
    }
    toHTML() {
        var primero = true;
        var res = "";
        for (var i = 0; i < this.funcion.length; i++) {
            if (this.funcion[i] != 0) {
                res += (this.funcion[i] >= 0 ? (primero ? " " : "+ ") : " ");
                res += (this.funcion[i] == 1 ? " " : (this.funcion[i] == -1 ? "- " : this.funcion[i]));
                res += "x<sub>" + (i + 1) + "</sub> ";
                primero = false;
            }
        }
        res += this.signo == "<=" ? "&le; " : this.signo == "=" ? "= " : "&ge; ";
        res += this.limite;
        return res;
    }
    getSigno() {
        return this.signo;
    }
    getLimite() {
        return this.limite;
    }
    getFuncion() {
        return this.funcion;
    }
}