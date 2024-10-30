class Vertice {
    #x;
    #y;

    constructor(x,y){
        this.#x = x;
        this.#y = y 
    }

    getVertice(){
        return this.#x, this.#y;
    }

    calcularDistancia(vertice){
        const dx = this.#x - vertice.#x;
        const dy = this.#y - vertice.#y;
        return Math.sqrt((dx ** 2) + (dy ** 2));
    }

    equals(vertice){
        if(this.#x == vertice.#x && this.#y == vertice.#y){
            return true;
        }else{
            return false;
        }
    }

    move(x,y){
        this.#x = x;
        this.#y = y;
    }
}

module.exports = Vertice;