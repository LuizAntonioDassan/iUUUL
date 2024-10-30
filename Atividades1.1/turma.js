class Turma {
    #listaAlunos;

    constructor(){
        this.#listaAlunos = [];
    }

    get listaAlunos(){
        return this.#listaAlunos;
    }

    addAluno(aluno){
        if (this.#listaAlunos.some(a => a.matricula === aluno.matricula)) {
            console.log("Aluno com a mesma matrícula já inserido.");
            console.log(aluno.matricula)
            return;
        }
        this.#listaAlunos.push(aluno);
    }
    removerAluno(matricula){
        this.#listaAlunos = this.#listaAlunos.filter(aluno => aluno.matricula !== matricula);
    }

    lancarNota(matricula, prova, nota) {
        const aluno = this.#listaAlunos.find(aluno => aluno.matricula === matricula);
        if (aluno) {
            aluno.setNota(prova, nota);
        } else {
            console.log("Aluno não encontrado.");
        }
    }
    imprimirAlunos() {
        console.log("-------------------------------------------------");

        for (const aluno of this.#listaAlunos) {
            const p1 = aluno.nota1 !== null ? aluno.nota1 : "-";
            const p2 = aluno.nota2 !== null ? aluno.nota2 : "-";
            const nf = aluno.calcularNotaFinal();
            console.log(`${aluno.matricula} ${aluno.nome} P1: ${p1}   P2: ${p2}   NF: ${nf}`);
        }

        console.log("-------------------------------------------------");
    }
}

module.exports = Turma;