import { Racional } from "../rational";
import { jsx_funcionObjetivo } from "./objetiveClass";
import { jsx_restriccion } from "./restrictionClass";

function replaceAll(text, busca, reemplaza) {
   while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca, reemplaza);
   return text;
}

export class jsx_problema {
   constructor() {
      this.funcionObjetivo = null;
      this.restricciones = new Array();
      this.holgura = new Array();
      this.artificial = new Array();
      this.noartificiales = 0;
      this.usamosM = false;
   }
   procesar() {
      this.variablesHolgura();
   }
   variablesHolgura() {
      for (var i = 0; i < this.restricciones.length; i++) {
         this.holgura[i] = this.restricciones[i].getSigno() == "<=" ? 1 : this.restricciones[i].getSigno() == ">=" ? -1 : 0;
      }
      var n_fo_param = this.funcionObjetivo.getFuncion();
      for (var i = 0; i < this.holgura.length; i++) {
         if (this.holgura[i] != 0) {
            n_fo_param[n_fo_param.length] = 0;
         }
      }
      var n_fo = new jsx_funcionObjetivo(this.funcionObjetivo.getTipo(), n_fo_param);
      this.funcionObjetivo = n_fo;
      var n_res = new Array();
      for (var i = 0; i < this.restricciones.length; i++) {
         var n_res_param = this.restricciones[i].getFuncion();
         for (var j = 0; j < this.holgura.length; j++) {
            if (this.holgura[i] != 0) {
               n_res_param[n_res_param.length] = i == j ? this.holgura[j] : 0;
            }
         }
         n_res[i] = new jsx_restriccion(n_res_param, "=", this.restricciones[i].getLimite());
      }
      this.restricciones = n_res;
   }
   dosfases() {
      var almenosuna = false;
      this.usamosM = false;
      for (var i = 0; i < this.holgura.length; i++) {
         this.artificial[i] = this.holgura[i] != 1 ? 1 : 0;
         almenosuna = this.holgura[i] != 1 || almenosuna ? true : false;
      }
      if (!almenosuna) {
         return false;
      }
      var n_fo_param = new Array();
      for (var i = 0; i < this.funcionObjetivo.getFuncion().length; i++) {
         n_fo_param[n_fo_param.length] = 0;
      }
      for (var i = 0; i < this.artificial.length; i++) {
         n_fo_param[n_fo_param.length] = this.artificial[i];
      }
      var n_fo = new jsx_funcionObjetivo("min", n_fo_param);
      var n_res = new Array();
      for (var i = 0; i < this.restricciones.length; i++) {
         var n_res_param = this.restricciones[i].getFuncion();
         for (var j = 0; j < this.artificial.length; j++) {
            if (i == j) {
               n_res_param[n_res_param.length] = this.artificial[j];
            }
            else {
               n_res_param[n_res_param.length] = 0;
            }
         }
         n_res[i] = new jsx_restriccion(n_res_param, "=", this.restricciones[i].getLimite());
      }
      var old_fo = this.funcionObjetivo;
      var old_res = this.restricciones;
      this.funcionObjetivo = n_fo;
      this.restricciones = n_res;
      this.noartificiales = old_fo.getFuncion().length;
      var problema2fases = this.clone();
      this.funcionObjetivo = old_fo;
      this.restricciones = old_res;
      this.artificial = new Array();
      this.noartificiales = 0;
      return problema2fases;
   }
   mgrande() {
      var m;
      this.usamosM = true;
      if (this.funcionObjetivo.getTipo().toLowerCase() == "min") {
         m = new Racional(3300444491, 3);
      }
      else {
         m = new Racional(-3300444491, 3);
      }
      var almenosuna = false;
      for (var i = 0; i < this.holgura.length; i++) {
         this.artificial[i] = this.holgura[i] != 1 ? 1 : 0;
         almenosuna = this.holgura[i] != 1 || almenosuna ? true : false;
      }
      if (!almenosuna) {
         return false;
      }
      var n_fo_param = new Array();
      for (var i = 0; i < this.funcionObjetivo.getFuncion().length; i++) {
         n_fo_param[n_fo_param.length] = this.funcionObjetivo.getFuncion()[i];
      }
      for (var i = 0; i < this.artificial.length; i++) {
         if (this.artificial[i] == 1) {
            n_fo_param[n_fo_param.length] = m.clone();
         }
         else {
            n_fo_param[n_fo_param.length] = 0;
         }
      }
      var n_fo = new jsx_funcionObjetivo(this.funcionObjetivo.getTipo(), n_fo_param);
      var n_res = new Array();
      for (var i = 0; i < this.restricciones.length; i++) {
         var n_res_param = this.restricciones[i].getFuncion();
         for (var j = 0; j < this.artificial.length; j++) {
            if (i == j) {
               n_res_param[n_res_param.length] = this.artificial[j];
            }
            else {
               n_res_param[n_res_param.length] = 0;
            }
         }
         n_res[i] = new jsx_restriccion(n_res_param, "=", this.restricciones[i].getLimite());
      }
      var old_fo = this.funcionObjetivo;
      var old_res = this.restricciones;
      this.funcionObjetivo = n_fo;
      this.restricciones = n_res;
      this.noartificiales = old_fo.getFuncion().length;
      var problema2fases = this.clone();
      this.funcionObjetivo = old_fo;
      this.restricciones = old_res;
      this.artificial = new Array();
      this.noartificiales = 0;
      return problema2fases;
   }
   setFuncionObjetivo() {
      if (arguments.length != 1) {
         alert("La funci\xf3n setFuncionObjetivo de la clase problemas s\xf3lo recibe un par\xe1metro.");
         return null;
      }
      if (arguments[0] instanceof jsx_funcionObjetivo) {
         this.funcionObjetivo = arguments[0];
      }
      else {
         alert("Error al asignar la funci\xf3n objetivo de un problema.");
      }
   }
   clearRestricciones() {
      this.restricciones = new Array();
   }
   addRestriccion() {
      if (arguments.length != 1) {
         alert("La funci\xf3n addRestriccion de la clase problemas recibe un s\xf3lo par\xe1metro.");
         return;
      }
      if (arguments[0] instanceof jsx_restriccion) {
         this.restricciones[this.restricciones.length] = arguments[0];
      }
      else {
         alert("Error al insertar la restricci\xf3n de un problema.");
      }
   }
   numVariables() {
      if (this.funcionObjetivo == null) {
         return 0;
      }
      else {
         return this.funcionObjetivo.numVariables();
      }
   }
   numRestricciones() {
      return this.restricciones.length;
   }
   getFuncionObjetivo() {
      return this.funcionObjetivo;
   }
   getTipo() {
      return this.funcionObjetivo.getTipo();
   }
   getRestricciones() {
      return this.restricciones;
   }
   getRestriccion() {
      if (arguments.length != 1 || isNaN(parseInt(arguments[0]))) {
         alert("Error el metodo getRestriccion de un problema recibe un s\xf3lo par\xe1metro num\xe9rico.");
         return null;
      }
      if (this.restricciones.length < parseInt(arguments[0])) {
         alert("Error, la restricci\xf3n solicitada al problema no existe.");
         return null;
      }
      return this.restricciones[parseInt(arguments[0])];
   }
   toString() {
      var res = "";
      res += this.getFuncionObjetivo().toString();
      for (var i = 0; i < this.numRestricciones(); i++) {
         res += " " + this.getRestriccion(i).toString();
      }
      return res;
   }
   toHTML() {
      var res = "<table>";
      res += "<tr><td>" + this.getFuncionObjetivo().toHTML().split(" ")[0] + "</td>";
      res += "<td>" + this.getFuncionObjetivo().toHTML().split(" ")[1] + "</td></tr>";
      for (var i = 0; i < this.numRestricciones(); i++) {
         res += "<tr><td>" + (i == 0 ? "s.a." : "&nbsp;") + "</td>";
         res += "<td>" + this.getRestriccion(i).toHTML() + "</td></tr>";
      }
      var primeraArt = this.noartificiales;
      var indicey = 1;
      for (var i = 0; i < this.artificial.length; i++) {
         if (this.artificial[i] == 1) {
            res = replaceAll(res, "x<sub>" + (primeraArt + i + 1) + "</sub>", "y<sub>" + indicey + "</sub>");
            indicey++;
         }
      }
      res += "</table>";
      res = replaceAll(res, "1100148163.6666667", "M");
      return res;
   }
   clone() {
      var nuevoproblema = new jsx_problema();
      var nuevafuncionobjetivo = new jsx_funcionObjetivo(this.funcionObjetivo.getTipo(), this.funcionObjetivo.getFuncion());
      nuevoproblema.setFuncionObjetivo(nuevafuncionobjetivo);

      for (var i = 0; i < this.restricciones.length; i++) {
         var nuevarestriccion = new jsx_restriccion(this.restricciones[i].getFuncion(), this.restricciones[i].getSigno(), this.restricciones[i].getLimite().clone());
         nuevoproblema.addRestriccion(nuevarestriccion);
      }
      nuevoproblema.holgura = new Array();
      for (i = 0; i < this.holgura.length; i++) {
         nuevoproblema.holgura[i] = this.holgura[i];
      }
      nuevoproblema.artificial = new Array();
      for (i = 0; i < this.artificial.length; i++) {
         nuevoproblema.artificial[i] = this.artificial[i];
      }
      nuevoproblema.noartificiales = this.noartificiales;
      nuevoproblema.usamosM = this.usamosM;
      return nuevoproblema;
   }
}