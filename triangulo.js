const Vertice = require('./vertice');

class Triangulo {
    #vertice1;
    #vertice2;
    #vertice3;
    #lado1;
    #lado2;
    #lado3;

    constructor(vertice1, vertice2, vertice3){
        if(vertice1 == vertice2 || vertice1 == vertice3 || vertice2 == vertice3){
            console.log("Não forma um triangulo");
        }
        this.#vertice1 = vertice1;
        this.#vertice2 = vertice2;
        this.#vertice3 = vertice3;

        this.perimetro();
    }

    equals(triangulo){
        if(triangulo.#vertice1 == this.#vertice1 &&
            triangulo.#vertice2 == this.#vertice2 && 
            triangulo.#vertice3 == this.#vertice3){
            return true;
        }
        return false;
    }

    perimetro(){
        this.#lado1 = this.#vertice1.calcularDistancia(this.#vertice2);
        this.#lado2 = this.#vertice2.calcularDistancia(this.#vertice3);
        this.#lado3 = this.#vertice3.calcularDistancia(this.#vertice1);

        const perimetro = this.#lado1 + this.#lado2 + this.#lado3;
        return perimetro;
    }

    clone(triangulo){
        triangulo.#vertice1 = this.#vertice1;
        triangulo.#vertice2 = this.#vertice2;
        triangulo.#vertice3 = this.#vertice3;
    }

    getArea(){
        const perimetro = this.perimetro();
        const S = perimetro/2;
        const area = Math.sqrt(S*(S - this.#lado1)*(S - this.#lado2)*(S - this.#lado3));
        return area;
    }
}

module.exports = Triangulo;