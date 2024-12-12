const { Sequelize, DataTypes } = require('sequelize');
const { Client } = require('pg');
const readline = require('readline-sync');
const { DateTime } = require('luxon');

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    password: 'java',
    port: 5432,
    database: 'postgres', 
};

const DATABASE_NAME = 'clinica_db';

async function createDatabase() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [DATABASE_NAME]
        );
        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE ${DATABASE_NAME}`);
            console.log(`Banco de dados '${DATABASE_NAME}' criado com sucesso!`);
        } else {
            console.log(`Banco de dados '${DATABASE_NAME}' já existe.`);
        }
    } catch (error) {
        console.error('Erro ao verificar/criar o banco de dados:', error);
    } finally {
        await client.end();
    }
}

const sequelize = new Sequelize(DATABASE_NAME, 'postgres', 'java', {
    host: 'localhost',
    dialect: 'postgres',
});

// Definição dos modelos
const Paciente = sequelize.define('Paciente', {
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            len: [11, 11],
        },
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

const Agendamento = sequelize.define('Agendamento', {
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'cpf',
        },
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    horaInicial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    horaFinal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Inicializa o banco de dados e sincroniza os modelos
(async () => {
    try {
        // Criação do banco, se necessário
        await createDatabase();

        // Conexão e sincronização
        await sequelize.authenticate();
        console.log('Conexão bem-sucedida com o banco de dados.');

        await sequelize.sync();
        console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
})();


// Funções refatoradas para usar Sequelize
async function cadastrarPaciente() {
    const cpf = readline.question('CPF: ');
    const nome = readline.question('Nome: ');
    const dataNascimento = readline.question('Data de nascimento (YYYY-MM-DD): ');

    try {
        const pacienteExistente = await Paciente.findByPk(cpf);
        if (pacienteExistente) {
            console.log('Erro: CPF já cadastrado!');
            return;
        }

        await Paciente.create({ cpf, nome, dataNascimento });
        console.log('Paciente cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
    }
}

async function listarPacientes() {
    try {
        const pacientes = await Paciente.findAll();
        if (pacientes.length === 0) {
            console.log('Nenhum paciente cadastrado.');
            return;
        }

        console.log('CPF        Nome           Data de Nascimento');
        pacientes.forEach(p => {
            console.log(`${p.cpf}   ${p.nome}   ${p.dataNascimento}`);
        });
    } catch (error) {
        console.error('Erro ao listar pacientes:', error);
    }
}

async function excluirPaciente() {
    const cpf = readline.question('CPF: ');

    try {
        const paciente = await Paciente.findByPk(cpf);
        if (!paciente) {
            console.log('Erro: Paciente não encontrado!');
            return;
        }

        await Paciente.destroy({ where: { cpf } });
        console.log('Paciente excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir paciente:', error);
    }
}

async function agendarConsulta() {
    const cpf = readline.question('CPF do paciente: ');
    const data = readline.question('Data da consulta (YYYY-MM-DD): ');
    const horaInicial = readline.question('Hora inicial (HH:MM): ');
    const horaFinal = readline.question('Hora final (HH:MM): ');

    try {
        const paciente = await Paciente.findByPk(cpf);
        if (!paciente) {
            console.log('Erro: Paciente não encontrado!');
            return;
        }

        await Agendamento.create({ cpf, data, horaInicial, horaFinal });
        console.log('Agendamento realizado com sucesso!');
    } catch (error) {
        console.error('Erro ao agendar consulta:', error);
    }
}

async function listarAgenda() {
    try {
        const agendamentos = await Agendamento.findAll({ include: Paciente });
        if (agendamentos.length === 0) {
            console.log('Nenhum agendamento encontrado.');
            return;
        }

        console.log('Data       Hora Inicial  Hora Final  Nome do Paciente');
        agendamentos.forEach(a => {
            console.log(`${a.data}   ${a.horaInicial}   ${a.horaFinal}   ${a.Paciente.nome}`);
        });
    } catch (error) {
        console.error('Erro ao listar agenda:', error);
    }
}

// Menu principal
async function menuPrincipal() {
    while (true) {
        console.log('\n1-Cadastrar Paciente\n2-Excluir Paciente\n3-Listar Pacientes\n4-Agendar Consulta\n5-Listar Agenda\n6-Sair');
        const opcao = readline.question('Escolha uma opção: ');

        if (opcao === '1') {
            await cadastrarPaciente();
        } else if (opcao === '2') {
            await excluirPaciente();
        } else if (opcao === '3') {
            await listarPacientes();
        } else if (opcao === '4') {
            await agendarConsulta();
        } else if (opcao === '5') {
            await listarAgenda();
        } else if (opcao === '6') {
            console.log('Saindo...');
            break;
        } else {
            console.log('Opção inválida!');
        }
    }
}

menuPrincipal();
