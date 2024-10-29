const Vertice = require('./vertice');
const readline =  require('readline-sync');

function LerVertices(){
    const vertices = [];

    for(let i =  0; i < 3; i++){
        const x =  parseFloat(readline.question(`Digite a cordenada X  do vertice ${i + 1}: `));
        const y =  parseFloat(readline.question(`Digite a cordenada Y  do vertice ${i + 1}: `));
        vertices.push(new Vertice(x, y));
    }

    return vertices;
}

const vertices = LerVertices();
i = 0;
while(i == 0){
    console.log('1 - Calcular distancia');
    console.log('2 - Mover Vertice');
    console.log('3 - Equals');
    console.log('4 - Sair');
    const action = readline.question('Digite o que deseja fazer: ');

    switch(action){
        case "1":
            const verticeSelect1 = readline.question("Digite o ID de um vertice: ");
            const verticeSelect2 = readline.question("Digite o ID de um vertice: ");
            const dist = vertices[verticeSelect1 - 1].calcularDistancia(vertices[verticeSelect2 - 1]);
            console.log(`A Distancia é de ${dist}`);
            break;
        case "2":
            const verticeSelect = readline.question("Digite o ID de um vertice: ");
            const trocaX = parseFloat(readline.question("Selecione o novo X: "));
            const trocaY = parseFloat(readline.question("Selecione o novo Y: "));
            const move = vertices[verticeSelect - 1].move(trocaX,trocaY);
            console.log(`As novas coordenadas são ${vertices[verticeSelect -1].getVertice()}`);
            break;
        case "3":
            const VerticeEQ1 = readline.question("Digite o ID de um vertice: ");
            const VerticeEQ2 = readline.question("Digite o ID de um vertice: ");
            const equal = vertices[VerticeEQ1 - 1].equals(vertices[VerticeEQ2 - 1]);
            if(equal){
                console.log('Sao Iguais');
            }else{
                console.log('Sao Diferentes');
            }
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