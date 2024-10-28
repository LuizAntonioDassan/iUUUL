class vertice {
    #x;
    #y;

    constructor(x,y){
        this.#x = x;
        this.#y = y 
    }

    get distancia(){

    }

    calcularDistancia(vertice){
        const dx = this.#x - vertice.#x;
        const dy = this.#y - vertice.#y;
        return Math.sqrt((dx ** 2) + (dy ** 2));
    }
}