const Vertice = require('./vertice');

class Poligono {
    #vertices;

    constructor(vertices) {
        if (vertices.length < 3) {
            throw new Error("Um polígono deve ter pelo menos 3 vértices.");
        }
        this.#vertices = vertices;
    }

    addVertice(v) {
        for (let vertice of this.#vertices) {
            if (vertice.equals(v)) {
                return false;
            }
        }
        this.#vertices.push(v);
        return true;
    }

    perimetro() {
        let perimetro = 0;
        for (let i = 0; i < this.#vertices.length; i++) {
            const verticeAtual = this.#vertices[i];
            const proximoVertice = this.#vertices[(i + 1) % this.#vertices.length]; // Fecha o polígono ao conectar o último vértice ao primeiro
            perimetro += verticeAtual.calcularDistancia(proximoVertice);
        }
        return perimetro;
    }

    get qtdVertices() {
        return this.#vertices.length;
    }
}

module.exports = Poligono;
