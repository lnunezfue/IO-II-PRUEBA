import { Racional } from "../rational";
export class jsx_funcionObjetivo {
    constructor() {
       if (arguments.length < 2) {
          alert("N\xfamero de parametros incorrecto al crear un objeto de tipo funci\xf3n objetivo.");
          return null;
       }
       if (arguments[0].toLowerCase() != "max" && arguments[0].toLowerCase() != "min") {
          alert("El primer par\xe1metro de una funci\xf3n objetivo debe ser 'max' o 'min'.");
          return null;
       }
       this.tipo = arguments[0].toLowerCase();
       if (arguments[1] instanceof Array) {
          this.funcion = new Array();
          for (var i = 0; i < arguments[1].length; i++) {
             if (arguments[1][i] instanceof Racional) {
                this.funcion[i] = arguments[1][i];
             }
             else if (!isNaN(parseFloat(arguments[1][i]))) {
                this.funcion[i] = parseFloat(arguments[1][i]);
             }
             else {
                alert("Par\xe1metro incorrecto al crear una funci\xf3n objetivo, valor no num\xe9rico.");
                return null;
             }
          }
       }
       else if (!isNaN(parseFloat(arguments[1]))) {
          this.funcion = new Array();
          for (var i = 1; i < arguments.length; i++) {
             if (arguments[i] instanceof Racional) {
                this.funcion[i - 1] = arguments[i];
             }
             else if (!isNaN(parseFloat(arguments[i]))) {
                this.funcion[i - 1] = new Racional(parseFloat(arguments[i]));
             }
             else {
                alert("Par\xe1metro incorrecto al crear una funci\xf3n objetivo, valor no num\xe9rico.");
                return null;
             }
          }
       }
       else {
          alert("El segundo par\xe1metro de una funci\xf3n objetivo debe ser un array de enteros o un entero.");
          return null;
       }
    }
    toString() {
       return this.toStringHTML();
    }
    toHTML() {
       return this.toStringHTML("html");
    }
    toStringHTML(tipo) {
       var res = (this.tipo.toLowerCase() == "max" ? "Max" : "Min") + " ";
       var primero = true;
       for (var i = 0; i < this.funcion.length; i++) {
          if (this.funcion[i] != 0) {
             res += (this.funcion[i] >= 0 ? (primero ? "" : "+") : "");
             res += (this.funcion[i] == 1 ? "" : (this.funcion[i] == -1 ? "-" : this.funcion[i])) + "x";
             res += (tipo == "html" ? "<sub>" : "") + (i + 1) + (tipo == "html" ? "</sub>" : "");
             primero = false;
          }
       }
       return res;
    }
    numVariables() {
       return this.funcion.length;
    }
    getTipo() {
       return this.tipo;
    }
    getFuncion() {
       return this.funcion;
    }
 }
    