class Aluno {
    #nome;
    #matricula;
    #nota1;
    #nota2;

    constructor(matricula, nome){
        this.#matricula = matricula;
        this.#nome = nome;
        this.#nota1 = null;
        this.#nota2 = null;
    }

    setNota(prova, nota){
        if(prova === "P1"){
            this.#nota1 = nota;
        } else if (prova === "P2"){
            this.#nota2 = nota;
        } else {
            throw new Error("Prova Invalida");
        }
    }

    calcularNotaFinal() {
        if (this.#nota1 !== null && this.#nota2 !== null) {
            return ((this.#nota1 + this.#nota2) / 2).toFixed(1);
        } else if (this.#nota1 !== null) {
            return (this.#nota1 / 2).toFixed(1);
        } else if (this.#nota2 !== null) {
            return (this.#nota2 / 2).toFixed(1);
        } else {
            return (0).toFixed(1);
        }
    }

    get matricula(){
        return this.#matricula;
    }

    get nota1(){
        return this.#nota1;
    }
    get nota2(){
        return this.#nota2;
    }
    get nome(){
        return this.#nome;
    }
}

module.exports = Aluno;