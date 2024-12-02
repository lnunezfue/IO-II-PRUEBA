import { Racional } from "../rational";
import { jsx_funcionObjetivo } from "./objetiveClass";
import { jsx_problema } from "./problemClass";
import { jsx_restriccion } from "./restrictionClass";
function replaceAll(text,busca,reemplaza){
   while(text.toString().indexOf(busca)!=-1)
    text=text.toString().replace(busca,reemplaza);
   return text;
  }
  

export class jsx_matriz {
    constructor() {
       if (arguments.length != 1 && arguments.length != 2) {
          alert("N\xfamero de par\xe1metros incorrecto al crear un objeto de tipo matriz.");
       }
       if (!(arguments[0] instanceof jsx_problema)) {
          alert("El argumento al crear una matriz debe ser un problema (jsx_problema).");
       }
       else {
          this.tipo = arguments[0].getTipo();
          this.variables = arguments[0].numVariables();
          this.restricciones = arguments[0].numRestricciones();
          this.v_costes = new Array(this.variables + 1);
          this.v_costes_reducidos = new Array(this.variables + 1);
          this.v_solucion = new Array(this.restricciones);
          this.usamosM = arguments[0].usamosM;
          this.matriz = new Array(this.restricciones);
          for (var i = 0; i < this.variables; i++) {
             this.v_costes[i] = new Racional(arguments[0].getFuncionObjetivo().getFuncion()[i]);
          }
          this.v_costes[this.variables] = new Racional();
          var nvariables = arguments[0].noartificiales != 0 ? arguments[0].noartificiales : arguments[0].numVariables();
          nvariables -= arguments[0].holgura.length;
          this.numvariables = nvariables;
          this.numvariablesconh = nvariables + arguments[0].holgura.length;
          for (var i = 0; i < this.restricciones; i++) {
             if (arguments[0].holgura[i] == 1) {
                this.v_solucion[i] = nvariables + i;
             }
             else {
                this.v_solucion[i] = nvariables + arguments[0].holgura.length + i;
             }
          }
          if (arguments.length == 2) {
             this.v_solucion = arguments[1];
          }
          for (var i = 0; i < this.restricciones; i++) {
             this.matriz[i] = new Array(this.variables + 1);
             for (var j = 0; j < this.variables; j++) {
                this.matriz[i][j] = new Racional(arguments[0].getRestriccion(i).getFuncion()[j]);
             }
             this.matriz[i][this.variables] = arguments[0].getRestriccion(i).getLimite();
          }
          this.calcularCostesReducidos();
       }
    }
    calcularCostesReducidos() {
       for (var i = 0; i < this.variables + 1; i++) {
          var suma = new Racional();
          for (var j = 0; j < this.restricciones; j++) {
             suma = suma.sumar(this.v_costes[this.v_solucion[j]].clone().multiplicar(this.matriz[j][i]));
          }
          suma = suma.restar(this.variables == i ? new Racional() : this.v_costes[i]);
          this.v_costes_reducidos[i] = suma;
       }
       if (this.usamosM) {
          this.calcularCostesReducidosM();
       }
    }
    calcularCostesReducidosM() {
       var mpos = "1100148163.6666667";
       var mneg = "-1100148163.6666667";
       this.v_costes_reducidosM = new Array();
       for (var i = 0; i < this.variables + 1; i++) {
          var sumam = new Racional();
          var suma = new Racional();
          for (var j = 0; j < this.restricciones; j++) {
             if (this.v_costes[this.v_solucion[j]] == mpos) {
                sumam = sumam.sumar(this.matriz[j][i]);
             }
             else if (this.v_costes[this.v_solucion[j]] == mneg) {
                sumam = sumam.restar(this.matriz[j][i]);
             }
             else {
                suma = suma.sumar(this.v_costes[this.v_solucion[j]].clone().multiplicar(this.matriz[j][i]));
             }
          }
          if (this.variables != i) {
             if (this.v_costes[i] == mpos) {
                sumam = sumam.restar(1);
             }
             else if (this.v_costes[i] == mneg) {
                sumam = sumam.sumar(1);
             }
             else {
                suma = suma.restar(this.v_costes[i]);
             }
          }
          var res = "";
          if (sumam != 0) {
             if (sumam == 1) {
                res = "M";
             }
             else if (sumam == -1) {
                res = "-M";
             }
             else {
                res = sumam.toString() + "M";
             }
          }
          if (suma > 0) {
             res += (sumam != 0 ? "+" : "") + suma.toString();
          }
          else if (suma < 0) {
             res += suma.toString();
          }
          if (sumam == 0 && suma == 0) {
             res = "0";
          }
          this.v_costes_reducidosM[i] = res;
       }
    }
    quienEntra() {
       var entra = null;
       var max = 0;
       for (var i = 0; i < this.variables; i++) {
          var vcr = this.v_costes_reducidos[i].clone();
          var act = vcr.multiplicar((this.tipo == 'max' ? -1 : 1));
          entra = act > max ? i : entra;
          max = act > max ? act : max;
       }
       return entra;
    }
    quienEntraX() {
       var letra;
       var numero;
       if (this.quienEntra() >= this.numvariablesconh) {
          letra = "y";
          numero = this.quienEntra() + 1; //TODO esto no creo que este bien
       }
       else {
          letra = "x";
          numero = this.quienEntra() + 1;
       }
       return letra + "<sub>" + numero + "</sub>";
    }
    quienSale() {
       var sale = null;
       var entra = this.quienEntra();
       if (entra != null) {
          var max = Infinity;
          for (var i = 0; i < this.restricciones; i++) {
             var vcr = this.matriz[i][this.variables].clone();
             var act = vcr.dividir(this.matriz[i][entra]);
             sale = act > 0 && act < max ? i : sale;
             max = act > 0 && act < max ? act : max;
          }
       }
       return sale;
    }
    quienSaleX() {
       var letra;
       var numero;
       if (this.v_solucion[this.quienSale()] >= this.numvariablesconh) {
          letra = "y";
          numero = 1;
          for (var k = this.numvariablesconh; k < this.v_solucion[this.quienSale()]; k++) {
             if (this.v_costes[k] != 0) {
                numero++;
             }
          }
       }
       else {
          letra = "x";
          numero = this.v_solucion[this.quienSale()] + 1;
       }
       return letra + "<sub>" + numero + "</sub>";
    }
    avanzar() {
       var entra = this.quienEntra();
       var sale = this.quienSale();
       if (entra == null | sale == null) {
          //alert("No se puede avanzar mas.");
          return null;
       }
       this.v_solucion[sale] = entra;
       var div = this.matriz[sale][entra].clone();
       for (var i = 0; i < this.variables + 1; i++) {
          this.matriz[sale][i].dividir(div);
       }
       for (var i = 0; i < this.restricciones; i++) {
          if (i != sale) {
             var mul = this.matriz[i][entra].clone();
             for (var j = 0; j < this.variables + 1; j++) {
                this.matriz[i][j].restar(this.matriz[sale][j].clone().multiplicar(mul));
             }
          }
       }
       this.calcularCostesReducidos();
       return true;
    }
    toString() {
       var entra = this.quienEntra();
       var sale = this.quienSale();
       var res = "<table class=\"jsx_matriz w-2/3 table-fixed\">";
       res += "<tr className=\"jsx_matriz_1 text-center\"><td className=\"px-3 py-2 w- text-sm font-semibold border border-black\">&nbsp;</td><td className=\"px-3 py-2 text-sm font-semibold tracking-wide border border-black\">&nbsp;</td>";
       for (var i = 0; i < this.variables; i++) {
          if (i < this.numvariablesconh || this.v_costes[i] != 0) {
             res += "<td className=\"px-3 py-2 text-sm font-semibold border border-black\">" + this.v_costes[i].toString() + "</td>";
          }
       }
       res += "<td className=\"px-3 py-2 text-sm font-semibold border border-black\" >&nbsp;</td></tr>";
       for (var i = 0; i < this.restricciones; i++) {
          var letra;
          var numero;
          if (this.v_solucion[i] >= this.numvariablesconh) {
             letra = "y";
             numero = 1;
             for (var k = this.numvariablesconh; k < this.v_solucion[i]; k++) {
                if (this.v_costes[k] != 0) {
                   numero++;
                }
             }
          }
          else {
             letra = "x";
             numero = this.v_solucion[i] + 1;
          }
          res += "<tr  className=\"jsx_matriz_1n text-center bg-gray-100\"><td className=\"px-3 py-2 font-semibold border border-black \">" + letra + "<sub>" + numero + "</sub></td>";
          res += "<td className=\"px-3 py-2 border border-black\">" + this.v_costes[this.v_solucion[i]].toString() + "</td>";
          for (var j = 0; j < this.variables + 1; j++) {
             if (j < this.numvariablesconh || this.v_costes[j] != 0 || j == this.variables) {
                if (j == entra && i == sale) {
                   res += "<td class=\"jsx_matriz_pivote\">" + this.matriz[i][j].toString() + "</td>";
                }
                else {
                   res += "<td className=\"px-3 py-2 border border-black\">" + this.matriz[i][j].toString() + "</td>";
                }
             }
          }
          res += "</tr>";
       }
       res = replaceAll(res, "3300444491/3", "M");
       res += "<tr class=\"jsx_matriz_n text-center\"><td className=\"px-3 py-2 border border-black\">&nbsp;</td><td className=\"px-3 py-2 border border-black\">&nbsp;</td>";
       for (var i = 0; i < this.variables + 1; i++) {
          if (i < this.numvariablesconh || this.v_costes[i] != 0 || i == this.variables) {
             if (this.usamosM) {
                res += "<td className=\"px-3 py-2 border border-black\">" + this.v_costes_reducidosM[i].toString() + "</td>";
             }
             else {
                res += "<td className=\"px-3 py-2 border border-black\">" + this.v_costes_reducidos[i].toString() + "</td>";
             }
          }
       }
       res += "</tr>";
       res += "</table>";
       res += "<div class=\"jsx_matriz_sol\"><b>Soluci&oacute;n:</b> ";
       for (var i = 0; i < this.matriz[0].length - 2; i++) {
          let valor = 0;
          for (var j = 0; j < this.v_solucion.length; j++) {
             if (this.v_solucion[j] == i) {
                valor = this.matriz[j][this.matriz[j].length - 1].toString();
             }
          }
          res += "x<sub>" + (i + 1) + "</sub>=" + valor + " ";
       }
       var resultado = 0;
       if (this.usamosM) {
          resultado = this.v_costes_reducidosM[this.v_costes_reducidosM.length - 1].toString();
       }
       else {
          resultado = this.v_costes_reducidos[this.v_costes_reducidos.length - 1].toString();
       }
       res += "&nbsp;&nbsp;&nbsp;<b>Resultado:</b> " + resultado;
       res += "</div>";
       return res;
    }
    finPrimeraFase() {
       //0 todo bien
       //1 artificial en la base con coste igual que 0
       //2 artificial en la base con coste mayor que 0
       var yenlabase = false;
       for (var i = 0; i < this.v_solucion.length; i++) {
          if (this.v_solucion[i] >= this.numvariablesconh) {
             yenlabase = true;
          }
       }
       if (!yenlabase) {
          return 0;
       }
       var yenlabasecero = true;
       for (var i = 0; i < this.v_solucion.length; i++) {
          if (this.v_solucion[i] >= this.numvariablesconh) {
             if (this.matriz[i][this.matriz[i].length - 1] != 0) {
                yenlabasecero = false;
             }
          }
       }
       if (yenlabasecero) {
          return 1;
       }
       return 2;
    }
    getSegundaFase(o_fo) {
       var pr = new jsx_problema();
       var nfo = new jsx_funcionObjetivo(o_fo.getTipo(), o_fo.getFuncion());
       pr.setFuncionObjetivo(nfo);
       for (var i = 0; i < this.restricciones; i++) {
          if (this.v_solucion[i] < this.numvariablesconh) {
             var param = new Array();
             for (var j = 0; j < this.numvariablesconh; j++) {
                param[param.length] = this.matriz[i][j];
             }
             var lim = this.matriz[i][this.matriz[i].length - 1];
             pr.addRestriccion(new jsx_restriccion(param, "=", lim));
          }
       }
       var ma02 = new jsx_matriz(pr, this.v_solucion);
       return ma02;
    }
    esMultiple() {
       var numVarBasicas = this.restricciones;
       var numCeros = 0;
       var optimo = true;
       for (var i = 0; i < this.v_costes_reducidos.length - 1; i++) {
          if (this.tipo.toLowerCase() == "max") {
             if (this.v_costes_reducidos[i] < 0) {
                optimo = false;
             }
          }
          else {
             if (this.v_costes_reducidos[i] > 0) {
                optimo = false;
             }
          }
          if (this.v_costes_reducidos[i] == 0) {
             numCeros++;
          }
       }
       if (optimo && numCeros > numVarBasicas) {
          return true;
       }
       return false;
    }
    finMgrande() {
       //todo mirar finPrimeraFase
       return false;
    }
 }
    