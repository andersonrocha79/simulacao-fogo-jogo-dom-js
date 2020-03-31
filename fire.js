// https://www.youtube.com/watch?v=fxm8cadCqbs&list=PLmLFip6SSi1K2vbk15spt9L-q6oq1rRGe&index=2&t=0s
// filipedeschamps/doom-fire-algorithm
// exemplo explicado no video do felipe deschamps

// array que armazena os pixels que representam o fogo
const firePixelsArray   = [];

// largura do fogo em pixels
let fireWidth           = 60;

// altura do fogo em pixels
let fireHeight          = 40;

// define se esta em debug 
let debug               = false;

// define o sentido do vento
var sentido             = 0;

// array com o rgb das cores utilizadas
// sao 36 cores possiveis para desenho do fogo
// cada item do array tem um objeto com 3 informacoes (r g b)
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]

// EXEMPLO
// largura: 8
// altura:  3
// total:   24

// ARRAY 24 POSIÇÕES
//  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0

// quebrando a linha a cada 8 pixels, 
// que é a largura do fogo, que gera esta representação
//  0   1   2   3   4   5   6   7
//  0   0   0   0   0   0   0   0  
//  0   0   0   0   0   0   0   0  
//  0   0   0   0   0   0   0   0


function start()
{

    // executa a função que cria a estrutura de dados
    // observando a altura e largura do fogo
    createFireDataStructure();

    // cria a origem do fogo, colocando a cor mais escura
    // em todas os pixels da primeira linha de baixo da tela
    createFireSource();

    // coloca a função que faz a propagação do
    // fogo pela tabela para ser executada em loop
    setInterval(calculateFirePropagation, 50);

}

function createFireDataStructure()
{

    // calcula a quantidade total de pixels, multiplicando a altura X largura     
    // 10 x 10 = 100 pixels
    const numberOfPixels = fireWidth * fireHeight;

    // percorre todos as posições (pixels) do array
    // definindo o valor zero para cada posição
    for (let i = 0; i < numberOfPixels; i++)
    {
        firePixelsArray[i] = 0;
    }

}

function updateFireIntensityPerPixel(currentPixelIndex)
{

    // recebe o index do pixel passado como parametro
    // e soma uma largura, para posicionar no pixel logo abaixo
    // do pixel atual
    // pixel atual: 5 
    // resultado:   5 + 10 = 15
    const belowPixelIndex = currentPixelIndex + fireWidth;

    // se estiver nos pixels da ultima linha
    // não precisa fazer nada
    if (belowPixelIndex >= fireWidth * fireHeight)
    {
        return;
    }

    // define o valor a ser deduzido da intensidade do fogo
    // gera um valor randomico para que a dedução da intensidade
    // seja variável
    // se informar decay = 1 fica muito linear, como se fosse um degrade, sem movimento
    // const decay = 1;
    // gerando o decay randomico fica bem parecido com o fogo do jogo mesmo
    // gera um numero randomi co que modifica bastante a aparecencia
    // a funcao random retorna um numero menor que um (exemplo 0.9532010207188286 / 0.2788859105856427)
    // multiplica o valor por 3, depois arredonda
    // ao fazer isso, pode gerar o decay com 0, 1 ou 2
    const decay = Math.floor(Math.random() * 3);
    // console.log(decay);

    // retorna a intensidade do fogo do pixel que
    // esta logo abaixo do pixel passado como parametro
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];

    // calcula a nova intensidade do fogo no pixel
    // é a intensidade do pixel de baixo - o decay, que seria 1
    const newFireIntensity = (belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0);

    // atualiza a intensidade do pixel atual, baseado no pixel debaixo, que ja foi calculado
    // gera um fogo que sobe linearmente, sem vento
    // firePixelsArray[currentPixelIndex] = newFireIntensity;
    // adicionando o decay, ele pode atualizar alem de si mesmo, os pixels ao lado, gerando um evento de vento
    // firePixelsArray[currentPixelIndex + decay] = newFireIntensity;

    // muda o sentido do vendo, sem vento, vento para direita e vento para a esquerda
    switch(sentido)
    {
        case 0: firePixelsArray[currentPixelIndex - decay] = newFireIntensity; break; // wind comes to the left
        case 1: firePixelsArray[currentPixelIndex] = newFireIntensity; break;         // no wind (fire set to up)
        case 2: firePixelsArray[currentPixelIndex + decay] = newFireIntensity; break; // wind comes to the right
    }    

}

function calculateFirePropagation()
{

    // percorre todos os pixels
    // atualizando a intensidade de fogo em cada um deles
    // observando sempre o pixel logo abaixo
    
    // percorre todas as colunas
    for (let column = 0; column < fireWidth; column++)
    {

        // em cada coluna, passa por todas as linhas da mesma coluna
        for (let row = 0; row < fireHeight; row++)
        {

            // posição atual da tabela
            // column e row
            const pixelIndex = column + (fireWidth * row);

            // atualiza a intensidade de cor do pixel atual
            // observando a intensidade do pixel logo abaixo
            updateFireIntensityPerPixel(pixelIndex);

        }
            
    }

    // depois atualizar a intensidade de fogo de 
    // todos os pixels, mostra o conteudo dos pixels em tela
    // renderiza me tela o array com os valores atualizados
    renderFire();

}

// altera o sentido do vento
function changeWindDirection(value)
{
    sentido = value
}

function renderFire()
{

    // cria a tabela em html
    // que demonstra o conteúdo do array com os pixels
    let html = '<table cellpadding = 0 cellspacing=0>';

    // percorre as linhas da tabela
    for (let row = 0; row < fireHeight; row++)
    {

        // cria a tag html que representa uma linha na tabela
        html += '<tr>';

        // para cada linha vamos percorrer as colunas
        for (let column = 0; column < fireWidth; column++)
        {

            // calcula o índice atual do array
            // 0 + (8 * 0)  =   0
            // 1 + (8 * 0)  =   1
            // 2 + (8 * 0)  =   2 ...
            // 1 + (8 * 1)  =   9
            // 2 + (8 * 1)  =   10
            const pixelIndex = column + (fireWidth * row);

            // retorna a intensidade do fogo, que está contida na posição do array
            // cada pixel tem sua intensidade de fogo
            const fireIntensity = firePixelsArray[pixelIndex]; 

            // se estiver em modo debug, mostra os valores
            // na tabela, caso contrario, mostra as cores
            if (debug === true)
            {

                // cria a tag html que representa uma coluna dentro da linha
                html += '<td>';

                // imprime o indice na tabela
                html += `<div class="pixel-index">${pixelIndex}</div>`;

                // imprime a intensidade do fogo em cada posição do array
                html += fireIntensity;

                // faz o fechamento da coluna dentro da linha
                html += '</td>';

            }
            else
            {

                // define a cor a ser demonstrada
                // observando a intensidade de fogo deste pixel
                const color = fireColorsPalette[fireIntensity];

                // texto que representa a cor em RGB
                const colorString = `${color.r},${color.g},${color.b}`;

                // cria o html da célula, colocando
                // como background a cor definida 
                html += `<td class="pixel" style="background-color:rgb(${colorString})">`;
                html += '</td>';

            }

        }

        // faz o fechamento da linha da tabela
        html += '</tr>';

    }

    // faz o fechamento da tabela
    html += '</table>';

    // mostra este conteúdo html na div "fireCanvas" que foi declarada no html
    document.querySelector("#fireCanvas").innerHTML = html;

}

function createFireSource()
{

    // cria a origem do fogo
    // pega a linha inferior e define o tom mais escuro do fogo, que seria 36
    // percorre todas as colunas da tabela e altera o valor do último pixel, que seria a ultima linha
    for (let column = 0; column <= fireWidth; column++)
    {

        // 10 x 10 = 100
        const overFlowPixelIndex = fireWidth * fireHeight;
        
        // subtraindo a largura e somando o numero da coluna atual
        // 100 - 10 + 0 = 90
        // 100 - 10 + 1 = 91
        // 100 - 10 + 2 = 92
        const pixelIndex         = (overFlowPixelIndex - fireWidth) + column;

        // define a cor mais escura 36 para esta ultima linha da coluna atual
        firePixelsArray[pixelIndex] = 36;

    }

}

// esta funcao altera os parametros para
// demonstrar o funcionamento em modo debug, com menos dados
function toggleDebugMode() 
{

    // altera entre debug, demonstrando os numeros da tabela
    // ou a exibicao grafica do fogo
    if (debug === false) 
    {
        fireWidth   = 25;
        fireHeight  = 17;
        debug       = true;
    } 
    else 
    {
        fireWidth   = 60;
        fireHeight  = 40;
        debug       = false;
    }

    // recria a estrutura de dados
    createFireDataStructure() 

    // recria a origem do fogo
    createFireSource()    

}

// inicia o processo
start();