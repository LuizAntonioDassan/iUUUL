const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const API_KEY = '1efd6077c769e818e7a8c119'; 
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`;

async function converterMoeda(from, to, amount) {
    try {
        const url = `${BASE_URL}/${from}/${to}`;
        const response = await axios.get(url);

        const rate = response.data.conversion_rate;
        const convertedAmount = (amount * rate).toFixed(2);

        console.log(`\nTaxa de Conversão: ${rate.toFixed(6)}`);
        console.log(`${amount} ${from} equivale a ${convertedAmount} ${to}\n`);
    } catch (error) {
        console.error("Erro na conversão:", error.message);
    }
}

function iniciarConversao() {
    console.log("=== Conversor de Moedas ===");
    console.log("Digite uma string vazia para sair.\n");

    const askCurrency = (prompt, callback) => {
        rl.question(prompt, (input) => {
            if (!input && prompt.includes("moeda de origem")) {
                console.log("Finalizando o programa...");
                rl.close();
            } else if (input.length !== 3) {
                console.log("A moeda deve ter exatamente 3 caracteres.");
                askCurrency(prompt, callback);
            } else {
                callback(input.toUpperCase());
            }
        });
    };

    const askAmount = (callback) => {
        rl.question("Digite o valor a ser convertido: ", (input) => {
            const amount = parseFloat(input);
            if (isNaN(amount) || amount <= 0) {
                console.log("O valor deve ser um número maior que 0.");
                askAmount(callback);
            } else {
                callback(amount);
            }
        });
    };

    askCurrency("Digite a moeda de origem (ex: USD): ", (from) => {
        askCurrency("Digite a moeda de destino (ex: EUR): ", (to) => {
            if (from === to) {
                console.log("A moeda de origem deve ser diferente da moeda de destino.");
                iniciarConversao();
            } else {
                askAmount((amount) => {
                    converterMoeda(from, to, amount);
                    iniciarConversao(); // Reiniciar para novas conversões
                });
            }
        });
    });
}

// Iniciar o programa
iniciarConversao();
