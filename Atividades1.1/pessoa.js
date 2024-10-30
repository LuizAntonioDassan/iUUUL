const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function validarNome(nome) {
    return nome.length >= 5;
}

function validarCPF(cpf) {
    return /^\d{11}$/.test(cpf);
}

function validarDataNascimento(dataNascimento) {
    const [dia, mes, ano] = dataNascimento.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const idade = hoje.getFullYear() - data.getFullYear();
    return (
        data.getDate() === dia &&
        data.getMonth() === mes - 1 &&
        data.getFullYear() === ano &&
        idade >= 18
    );
}

function validarRendaMensal(rendaMensal) {
    return rendaMensal >= 0;
}

function validarEstadoCivil(estadoCivil) {
    return /^[CSVDcsdv]$/.test(estadoCivil);
}

function validarDependentes(dependentes) {
    return dependentes >= 0 && dependentes <= 10;
}

function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarRenda(rendaMensal) {
    return parseFloat(rendaMensal).toFixed(2).replace('.', ',');
}

function formatarData(dataNascimento) {
    const [dia, mes, ano] = dataNascimento.split('/');
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

async function perguntar(campo, validacao, formatacao) {
    return new Promise((resolve) => {
        rl.question(`Digite o ${campo}: `, (input) => {
            if (validacao(input)) {
                resolve(formatacao ? formatacao(input) : input);
            } else {
                console.log(`Entrada inválida para ${campo}.`);
                resolve(perguntar(campo, validacao, formatacao));
            }
        });
    });
}

async function coletarDados() {
    const nome = await perguntar('Nome (mínimo 5 caracteres)', validarNome);
    const cpf = await perguntar('CPF (11 dígitos)', validarCPF, formatarCPF);
    const dataNascimento = await perguntar('Data de Nascimento (DD/MM/AAAA)', validarDataNascimento, formatarData);
    const rendaMensal = await perguntar('Renda Mensal (>= 0, duas casas decimais)', validarRendaMensal, formatarRenda);
    const estadoCivil = await perguntar('Estado Civil (C, S, V ou D)', validarEstadoCivil);
    const dependentes = await perguntar('Dependentes (0 a 10)', validarDependentes);

    console.log("\nDados do Cliente:");
    console.log(`Nome: ${nome}`);
    console.log(`CPF: ${cpf}`);
    console.log(`Data de Nascimento: ${dataNascimento}`);
    console.log(`Renda Mensal: R$ ${rendaMensal}`);
    console.log(`Estado Civil: ${estadoCivil.toUpperCase()}`);
    console.log(`Dependentes: ${dependentes}`);

    rl.close();
}

coletarDados();
