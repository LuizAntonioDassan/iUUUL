const Turma = require('./turma');
const Aluno = require('./aluno');
const readline = require('readline-sync');


const turma = new Turma();

const aluno1 = new Aluno("12345", "Ana de Almeida");
const aluno2 = new Aluno("23456", "Bruno Carvalho");
const aluno6 = new Aluno("23456", "Alceu Valença");
const aluno3 = new Aluno("34567", "Fernanda Abreu");
const aluno4 = new Aluno("45678", "Joao Santos");

turma.addAluno(aluno1);
turma.addAluno(aluno2);
turma.addAluno(aluno3);
turma.addAluno(aluno4);
turma.addAluno(aluno6);

turma.lancarNota("12345", "P1", 8.0);
turma.lancarNota("12345", "P2", 9.5);
turma.lancarNota("23456", "P1", 7.0);
turma.lancarNota("34567", "P2", 8.5);


turma.imprimirAlunos();