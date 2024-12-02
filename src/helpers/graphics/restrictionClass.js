import {Racional} from '../rational'
import { eval2 } from '../utils';
export class Restriccion {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.signo = "<=";
        this.limite = 0;
        this.mostrable = true;
        if (arguments.length == 0) {
        }
        else if (arguments.length == 4 || arguments.length == 5) {
            this.x = parseFloat(arguments[0]);
            this.y = parseFloat(arguments[1]);
            this.signo = arguments[2];
            this.limite = parseFloat(arguments[3]);
            this.mostrable = true;
            if (arguments.length == 5) {
                this.mostrable = arguments[4];
            }
        }
        else {
            alert("Restriccion (Error): numero de parametros incorrectos al invocar al constructor.");
        }
    }

    isMostrable() {
        return this.mostrable;
    }
    corteX() {
        return this.limite / this.x;
    }
    corteY() {
        return this.limite / this.y;
    }
    getX(vy) {
        return (this.limite - (this.y * vy)) / this.x;
    }
    getY(vx) {
        return (this.limite - (this.x * vx)) / this.y;
    }
    corteGrafica(gra) {
        var px = [0, 0];
        var py = [0, 0];
        var p = [0, 0];
        var i = 0;
        if (this.getY(gra.x1) >= gra.y1 && this.getY(gra.x1) <= gra.y2) {
            px[i] = gra.x1;
            py[i] = this.getY(gra.x1);
            p[i] = 1;
            i++;
        }
        if (this.getY(gra.x2) >= gra.y1 && this.getY(gra.x2) <= gra.y2) {
            px[i] = gra.x2;
            py[i] = this.getY(gra.x2);
            p[i] = 2;
            i++;
        }
        if (this.getX(gra.y1) >= gra.x1 && this.getX(gra.y1) <= gra.x2) {
            px[i] = this.getX(gra.y1);
            py[i] = gra.y1;
            p[i] = 3;
            i++;
        }
        if (this.getX(gra.y2) >= gra.x1 && this.getX(gra.y2) <= gra.x2) {
            px[i] = this.getX(gra.y2);
            py[i] = gra.y2;
            p[i] = 4;
            i++;
        }
        var puntos = [{ "x": px[0], "y": py[0] }, { "x": px[1], "y": py[1] }];
        if (p[1] == 1) {
            if (eval2((this.x * gra.x1 + this.y * (py[1] - 1)) + this.signo + this.limite)) {
                puntos.push({ "x": gra.x1, "y": gra.y1 });
                if (p[0] == 2 || p[0] == 4) {
                    puntos.push({ "x": gra.x2, "y": gra.y1 });
                }
                if (p[0] == 4) {
                    puntos.push({ "x": gra.x2, "y": gra.y2 });
                }
            }
            else {
                puntos.push({ "x": gra.x1, "y": gra.y2 });
                if (p[0] == 2 || p[0] == 3) {
                    puntos.push({ "x": gra.x2, "y": gra.y2 });
                }
                if (p[0] == 3) {
                    puntos.push({ "x": gra.x2, "y": gra.y1 });
                }
            }
        }
        else if (p[1] == 2) {
            if (eval2((this.x * gra.x2 + this.y * (py[1] + 1)) + this.signo + this.limite)) {
                puntos.push({ "x": gra.x2, "y": gra.y2 });
                if (p[0] == 1 || p[0] == 3) {
                    puntos.push({ "x": gra.x1, "y": gra.y2 });
                }
                if (p[0] == 3) {
                    puntos.push({ "x": gra.x1, "y": gra.y1 });
                }
            }
            else {
                puntos.push({ "x": gra.x2, "y": gra.y1 });
                if (p[0] == 1 || p[0] == 4) {
                    puntos.push({ "x": gra.x1, "y": gra.y1 });
                }
                if (p[0] == 4) {
                    puntos.push({ "x": gra.x1, "y": gra.y2 });
                }
            }
        }
        else if (p[1] == 3) {
            if (eval2((this.x * (px[1] + 1) + this.y * gra.y1) + this.signo + this.limite)) {
                puntos.push({ "x": gra.x2, "y": gra.y1 });
                if (p[0] == 4 || p[0] == 1) {
                    puntos.push({ "x": gra.x2, "y": gra.y2 });
                }
                if (p[0] == 1) {
                    puntos.push({ "x": gra.x1, "y": gra.y2 });
                }
            }
            else {
                puntos.push({ "x": gra.x1, "y": gra.y1 });
                if (p[0] == 4 || p[0] == 2) {
                    puntos.push({ "x": gra.x1, "y": gra.y2 });
                }
                if (p[0] == 2) {
                    puntos.push({ "x": gra.x2, "y": gra.y2 });
                }
            }
        }
        else if (p[1] == 4) {
            if (eval2((this.x * (px[1] - 1) + this.y * gra.y2) + this.signo + this.limite)) {
                puntos.push({ "x": gra.x1, "y": gra.y2 });
                if (p[0] == 3 || p[0] == 2) {
                    puntos.push({ "x": gra.x1, "y": gra.y1 });
                }
                if (p[0] == 2) {
                    puntos.push({ "x": gra.x2, "y": gra.y1 });
                }
            }
            else {
                puntos.push({ "x": gra.x2, "y": gra.y2 });
                if (p[0] == 3 || p[0] == 1) {
                    puntos.push({ "x": gra.x2, "y": gra.y1 });
                }
                if (p[0] == 1) {
                    puntos.push({ "x": gra.x1, "y": gra.y1 });
                }
            }
        }
        return puntos;
    }

    cumple(nx, ny) {
        return eval2(this.x * nx + this.y * ny + this.signo + this.limite);
      }
      corteRestriccion(res) {
        var pendiente1 = (this.x * -1) / this.y;
        var pendiente2 = (res.x * -1) / res.y;
        if (pendiente1 != pendiente2) {
          var cx = Racional.dividir(Racional.restar(new Racional(res.limite, res.y), new Racional(this.limite, this.y)), Racional.restar(new Racional((this.x * -1), this.y), new Racional((res.x * -1), res.y)));
          var cy = Racional.dividir(Racional.restar(new Racional(this.limite), Racional.multiplicar(new Racional(this.x), cx)), new Racional(this.y));
          return { "x": cx, "y": cy };
        }
        return null;
      }
      toString() {
        return this.x + "x" + (this.y < 0 ? this.y : "+" + this.y) + "y" + this.signo + this.limite;
      }
};