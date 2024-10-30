const Vertice = require('./vertice');
const Triangulo = require('./triangulo');
const readline = require('readline-sync');

function LerVertices() {
    const vertices = [];

    for (let i = 0; i < 3; i++) {
        const x = parseFloat(readline.question(`Digite a cordenada X  do vertice ${i + 1}: `));
        const y = parseFloat(readline.question(`Digite a cordenada Y  do vertice ${i + 1}: `));
        vertice = new Vertice(x, y);
        vertices.push(vertice);
    }

    return vertices;
}
function LerTriangulos() {
    console.log("Defina os vertices do triangulo");
    const triangulos = [];

    for (let i = 0; i < 3; i++) {
        console.log(`Criar Triangulo ${i+1}`);
        const vertices = LerVertices();
        triangulo = new Triangulo(vertices[0], vertices[1], vertices[2]);
        triangulos.push(triangulo);
    }

    return triangulos;
}
const triangulos = LerTriangulos();
console.log(triangulos);
i = 0;
while (i == 0) {
    console.log('1 - Perimetro');
    console.log('2 - Area');
    console.log('3 - Equals');
    console.log('4 - Clone');
    console.log('5 - Sair');
    const action = readline.question('Digite o que deseja fazer: ');


    switch (action) {
        case "1":
            var trianguloId = parseInt(readline.question("Digite o ID de um Triângulo: "));
            if (triangulos[trianguloId - 1] instanceof Triangulo) {
                console.log(triangulos[trianguloId - 1]);
                const dist = triangulos[trianguloId - 1].perimetro();
                console.log(`O Perímetro é de ${dist}`);
            } else {
                console.log("Erro: o objeto não é uma instância de Triangulo");
            }

            break;
        case "2":
            var trianguloId = parseInt(readline.question("Digite o ID de um Triângulo: "));
            var area = triangulos[trianguloId - 1].getArea();
            console.log(`A Area é de ${area}`);
            break;
        case "3":
            var TrianguloEQ1 = readline.question("Digite o ID de um Triangulo: ");
            var TrianguloEQ2 = readline.question("Digite o ID de um Triangulo: ");
            var equal = triangulos[TrianguloEQ1 - 1].equals(triangulos[TrianguloEQ2 - 1]);
            if (equal) {
                console.log('Sao Iguais');
            } else {
                console.log('Sao Diferentes');
            }
            break;
        case "4":
            var TrianguloEQ1 = readline.question("Digite o ID de um Triangulo: ");
            var TrianguloEQ2 = readline.question("Digite o ID de um Triangulo: ");
            var clone = triangulos[TrianguloEQ1 - 1].clone(triangulos[TrianguloEQ2 - 1]);
            break;
        case "5":
            console.log("Obrigado Por participar");
            i = 1;
            break;
        default:
            console.log("Numero nao reconhecido, fechando aplicação");
            i = 1;
    }
}