const Vertice = require('./vertice');
const Poligono = require('./poligono');
const readline = require('readline-sync');

function LerVertices(i) {
    const x = parseFloat(readline.question(`Digite a cordenada X  do vertice ${i + 1}: `));
    const y = parseFloat(readline.question(`Digite a cordenada Y  do vertice ${i + 1}: `));
    const vertice = new Vertice(x, y);

    return vertice;
}

function LerPoligono() {
    const Poligonos = [];
    const Vertices = [];
    var qtndVertice = parseFloat(readline.question("Digite a quantidade de Vertices: "));
    for (let i = 0; i < qtndVertice; i++) {
        var vertice = LerVertices(i);
        Vertices.push(vertice);
    }
    var p = new Poligono(Vertices);
    Poligonos.push(p);

    return Poligonos;
}

const poligono = LerPoligono();
console.log(poligono)

i = 0;
while (i == 0) {
    console.log('1 - Perimetro');
    console.log('2 - addVertice');
    console.log('3 - qtdVertice');
    console.log('4 - Sair');
    const action = readline.question('Digite o que deseja fazer: ');

    switch (action) {
        case "1":
            console.log(`O perimetro é igual a: ${poligono[0].perimetro()}`);
            break;
        case "2":
            let v = LerVertices(poligono[0].qtdVertices + 1);
            poligono[0].addVertice(v);
            break;
        case "3":
            console.log(`quantidade de vertices é de: ${poligono[0].qtdVertices}`);
            break;
        case "4":
            console.log("Obrigado Por participar");
            i = 1;
            break;
        default:
            console.log("Numero nao reconhecido, fechando aplicação");
            i = 1;
    }
}