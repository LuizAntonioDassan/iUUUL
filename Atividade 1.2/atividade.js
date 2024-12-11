const readline = require('readline-sync');
const { DateTime } = require('luxon');

// Dados iniciais
const pacientes = [];
const agendamentos = [];

// Funções de apoio
function validarCPF(cpf) {
    if (cpf.length !== 11 || /^[0-9]+$/.test(cpf) === false) return false;
    if (/^(\d)\1*$/.test(cpf)) return false; // Todos dígitos iguais

    const calcDV = (base, pesos) => {
        const soma = base.reduce((acc, num, i) => acc + num * pesos[i], 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const baseCPF = cpf.slice(0, 9).split('').map(Number);
    const digito1 = calcDV(baseCPF, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const digito2 = calcDV([...baseCPF, digito1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

    return digito1 === +cpf[9] && digito2 === +cpf[10];
}

function cadastrarPaciente() {
    const cpf = readline.question('CPF: ');
    if (!validarCPF(cpf)) {
        console.log('Erro: CPF inválido!');
        return;
    }
    if (pacientes.find(p => p.cpf === cpf)) {
        console.log('Erro: CPF já cadastrado!');
        return;
    }

    const nome = readline.question('Nome: ');
    if (nome.length < 5) {
        console.log('Erro: O nome deve ter pelo menos 5 caracteres!');
        return;
    }

    const dataNascimento = readline.question('Data de nascimento (DD/MM/AAAA): ');
    const data = DateTime.fromFormat(dataNascimento, 'dd/MM/yyyy');
    if (!data.isValid || DateTime.now().diff(data, 'years').years < 13) {
        console.log('Erro: Paciente deve ter pelo menos 13 anos!');
        return;
    }

    pacientes.push({ cpf, nome, dataNascimento });
    console.log('Paciente cadastrado com sucesso!');
}

function listarPacientes() {
    console.log('------------------------------------------------------------');
    console.log('CPF Nome Dt.Nasc.');
    console.log('------------------------------------------------------------');
    pacientes.forEach(p => {
        console.log(`${p.cpf} ${p.nome} ${p.dataNascimento}`);
    });
    console.log('------------------------------------------------------------');
}

// Menu principal
function menuPrincipal() {
    while (true) {
        console.log('\n1-Cadastro de pacientes\n2-Agenda\n3-Fim');
        const opcao = readline.question('Escolha uma opcao: ');

        if (opcao === '1') {
            menuPacientes();
        } else if (opcao === '2') {
            menuAgenda();
        } else if (opcao === '3') {
            console.log('Saindo...');
            break;
        } else {
            console.log('Opção inválida!');
        }
    }
}

function excluirPaciente() {
    const cpf = readline.question('CPF: ');
    const paciente = pacientes.find(p => p.cpf === cpf);

    if (!paciente) {
        console.log('Erro: paciente não cadastrado!');
        return;
    }

    const possuiAgendamentoFuturo = agendamentos.some(
        a => a.cpf === cpf && DateTime.fromFormat(a.data, 'dd/MM/yyyy') > DateTime.now()
    );

    if (possuiAgendamentoFuturo) {
        console.log('Erro: paciente está agendado.');
        return;
    }

    pacientes.splice(pacientes.indexOf(paciente), 1);
    console.log('Paciente excluído com sucesso!');
}

function cancelarAgendamento() {
    const cpf = readline.question('CPF do paciente: ');
    const paciente = pacientes.find(p => p.cpf === cpf);

    if (!paciente) {
        console.log('Erro: paciente não cadastrado!');
        return;
    }

    const data = readline.question('Data da consulta (DD/MM/AAAA): ');
    const horaInicial = readline.question('Hora inicial (HHMM): ');

    const agendamento = agendamentos.find(a => a.cpf === cpf && a.data === data && a.horaInicial === horaInicial);

    if (!agendamento) {
        console.log('Erro: agendamento não encontrado!');
        return;
    }

    const dataConsulta = DateTime.fromFormat(agendamento.data, 'dd/MM/yyyy');
    const horaConsulta = DateTime.fromFormat(agendamento.horaInicial, 'HHmm');
    const agora = DateTime.now();

    if (dataConsulta < agora.startOf('day') || (dataConsulta.equals(agora.startOf('day')) && horaConsulta < agora)) {
        console.log('Erro: Apenas agendamentos futuros podem ser cancelados!');
        return;
    }

    agendamentos.splice(agendamentos.indexOf(agendamento), 1);
    console.log('Agendamento cancelado com sucesso!');
}


function listarAgenda() {
    console.log('Apresentar a agenda T-Toda ou P-Periodo: ');
    const opcao = readline.question('Escolha T para toda a agenda ou P para um período: ').toUpperCase();

    let agendamentosFiltrados = [...agendamentos];

    if (opcao === 'P') {
        const dataInicial = readline.question('Data inicial (DD/MM/AAAA): ');
        const dataFinal = readline.question('Data final (DD/MM/AAAA): ');

        const inicio = DateTime.fromFormat(dataInicial, 'dd/MM/yyyy').startOf('day');
        const fim = DateTime.fromFormat(dataFinal, 'dd/MM/yyyy').endOf('day');

        if (!inicio.isValid || !fim.isValid || inicio > fim) {
            console.log('Erro: Intervalo de datas inválido!');
            return;
        }

        agendamentosFiltrados = agendamentos.filter(a => {
            const dataConsulta = DateTime.fromFormat(a.data, 'dd/MM/yyyy');
            return dataConsulta >= inicio && dataConsulta <= fim;
        });
    }

    if (agendamentosFiltrados.length === 0) {
        console.log('Nenhum agendamento encontrado.');
        return;
    }

    console.log('-------------------------------------------------------------');
    console.log('Data       H.Ini H.Fim Tempo  Nome');
    console.log('-------------------------------------------------------------');

    agendamentosFiltrados.sort((a, b) => {
        const dataA = DateTime.fromFormat(a.data, 'dd/MM/yyyy');
        const dataB = DateTime.fromFormat(b.data, 'dd/MM/yyyy');
        const horaA = DateTime.fromFormat(a.horaInicial, 'HHmm');
        const horaB = DateTime.fromFormat(b.horaInicial, 'HHmm');

        if (dataA < dataB) return -1;
        if (dataA > dataB) return 1;
        if (horaA < horaB) return -1;
        if (horaA > horaB) return 1;
        return 0;
    });

    agendamentosFiltrados.forEach(a => {
        const data = a.data;
        const horaInicial = DateTime.fromFormat(a.horaInicial, 'HHmm').toFormat('HH:mm');
        const horaFinal = DateTime.fromFormat(a.horaFinal, 'HHmm').toFormat('HH:mm');
        const tempo = DateTime.fromFormat(a.horaFinal, 'HHmm').diff(DateTime.fromFormat(a.horaInicial, 'HHmm'), 'minutes').minutes;
        const paciente = pacientes.find(p => p.cpf === a.cpf)?.nome || 'Desconhecido';

        console.log(`${data} ${horaInicial} ${horaFinal} ${tempo}min ${paciente}`);
    });

    console.log('-------------------------------------------------------------');
}


function agendarConsulta() {
    const cpf = readline.question('CPF do paciente: ');
    const paciente = pacientes.find(p => p.cpf === cpf);

    if (!paciente) {
        console.log('Erro: paciente não cadastrado!');
        return;
    }

    const data = readline.question('Data da consulta (DD/MM/AAAA): ');
    const dataConsulta = DateTime.fromFormat(data, 'dd/MM/yyyy');
    if (!dataConsulta.isValid || dataConsulta < DateTime.now().startOf('day')) {
        console.log('Erro: Data inválida ou no passado!');
        return;
    }

    const horaInicial = readline.question('Hora inicial (HHMM): ');
    const horaFinal = readline.question('Hora final (HHMM): ');

    const horaIni = DateTime.fromFormat(horaInicial, 'HHmm');
    const horaFim = DateTime.fromFormat(horaFinal, 'HHmm');
    if (!horaIni.isValid || !horaFim.isValid || horaFim <= horaIni) {
        console.log('Erro: Horário inválido!');
        return;
    }

    if (horaIni.hour < 8 || horaFim.hour > 19 || (horaFim.hour === 19 && horaFim.minute > 0)) {
        console.log('Erro: Horário fora do funcionamento do consultório!');
        return;
    }

    const sobreposicao = agendamentos.some(a =>
        a.data === data &&
        ((horaIni >= DateTime.fromFormat(a.horaInicial, 'HHmm') && horaIni < DateTime.fromFormat(a.horaFinal, 'HHmm')) ||
        (horaFim > DateTime.fromFormat(a.horaInicial, 'HHmm') && horaFim <= DateTime.fromFormat(a.horaFinal, 'HHmm')))
    );

    if (sobreposicao) {
        console.log('Erro: Horário já ocupado!');
        return;
    }

    const jaPossuiConsulta = agendamentos.some(a => a.cpf === cpf && DateTime.fromFormat(a.data, 'dd/MM/yyyy') > DateTime.now());
    if (jaPossuiConsulta) {
        console.log('Erro: Paciente já possui uma consulta futura!');
        return;
    }

    agendamentos.push({ cpf, data, horaInicial, horaFinal });
    console.log('Agendamento realizado com sucesso!');
}

function menuAgenda() {
    while (true) {
        console.log('\n1-Agendar consulta\n2-Cancelar agendamento\n3-Listar agenda\n4-Voltar p/ menu principal');
        const opcao = readline.question('Escolha uma opção: ');

        if (opcao === '1') {
            agendarConsulta();
        } else if (opcao === '2') {
            cancelarAgendamento();
        } else if (opcao === '3') {
            listarAgenda();
        } else if (opcao === '4') {
            break;
        } else {
            console.log('Opção inválida!');
        }
    }
}


function menuPacientes() {
    while (true) {
        console.log('\n1-Cadastrar novo paciente\n2-Excluir paciente\n3-Listar pacientes\n5-Voltar p/ menu principal');
        const opcao = readline.question('Escolha uma opção: ');

        if (opcao === '1') {
            cadastrarPaciente();           
        } else if (opcao === '2') {
            excluirPaciente();
        } else if (opcao === '3') {
            listarPacientes();
        } else if (opcao === '5') {
            break;
        } else {
            console.log('Opção inválida!');
        }
    }
}

// Inicia o programa
menuPrincipal();
