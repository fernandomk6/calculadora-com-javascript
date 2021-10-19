let inputResultado = document.querySelector("#inputDisplayResultado");
let textAreaHistorico = document.querySelector("#textAreaHistorico");

let calculo = {
    valorSalvo: null,
    funcaoParaCalcular: null
};

window.addEventListener("load", atribuirEventos);

function atribuirEventos(){
    document.querySelector("#btnLimpar").addEventListener("click", limparDados);
    document.querySelector("#btnPonto").addEventListener("click", clicarPonto);
    document.querySelector("#btnResultado").addEventListener("click", clicarResultado);

    let numeros = document.querySelectorAll(".btn-numero");
    let operadores = document.querySelectorAll(".btn-operador");
    for(let numero of numeros){
        numero.addEventListener("click", clicarNumero);
    }
    for(let operador of operadores){
        operador.addEventListener("click", clicarOperador);
    }
}
// limpando os dados da calculadora, iniciando um novo historico, limpando o objeto calculo e habilitando os botoes
function limparDados(){
    // Limpa o display de resultado
    inputResultado.value = "";
    // cria um separador no textarea historico caso tenha algum historico
    if(!textAreaHistorico.textContent == ""){
        inserirTextoHistorico("---");
    }
    // limpando o objeto calculo
    calculo.valorSalvo = null;
    calculo.funcaoParaCalcular = null;

    // habilita todos os botoes
    desabilitarBotoes(false);
}

// evento de clicar no ponto
function clicarPonto(){
    // se display não exibir numero, adiciona ao historico o que estiver no historico
    if(isNaN(inputResultado.value)){
        inserirTextoHistorico(inputResultado.value);
    }

    // caso clique no ponto e o display esteja vazio
    if(inputResultado.value == "" || isNaN(inputResultado.value)){
        inputResultado.value = "0.";
    // caso não tenha um ponto, colocar o ponto, se ja tiver ponto, não colocar nada
    }else if(!inputResultado.value.includes(".")){
        inputResultado.value += ".";
    }
}
// quando clicar em um numero
function clicarNumero(){
    // caso o display não mostre um numero, ou seja, caso exiba um operador
    if(isNaN(inputResultado.value)){
        // manda o operador para o historico
        inserirTextoHistorico(inputResultado.value);
        // substitui o operador do display pelo numero clicado
        inputResultado.value = event.target.textContent;
    // caso o display exiba um numero
    }else{
        // caso o numero seja 0, substituir pelo numero digitado
        if(inputResultado.value == 0 && inputResultado.value !== "0."){
            inputResultado.value = event.target.textContent;
        // caso não seja zero, atribuir
        }else{
            inputResultado.value += event.target.textContent;
        }
        
    } 
}
// quando clicar em elemento que tenha a clase de btn-operador
function clicarOperador(){
    // caso o input seja um numero
    if(!isNaN(inputResultado.value)){
        // caso o calculo esteja sem valor salvo ou sem função para calcular
        if(calculo.valorSalvo == null || calculo.funcaoParaCalcular == null){
            // calculo valor salvo, recebera o inputResultado
            calculo.valorSalvo = Number(inputResultado.value);
        // caso ja exista um valor salvo ou uma função
        }else{
            calculo.valorSalvo = calculo.funcaoParaCalcular(calculo.valorSalvo, Number(inputResultado.value));
        }

        // inserindo no historico
        inserirTextoHistorico(calculo.valorSalvo);
    }


    let operador = event.target.textContent;
    atribuirOperacao(operador);
    inputResultado.value = operador;
}
//atribuindo operação com base no text content do operador clicado
function atribuirOperacao(operador){
    switch(operador){
        case "+":
            calculo.funcaoParaCalcular = somar;
            break;
        case "-":
            calculo.funcaoParaCalcular = subtrair;
            break;
        case "*":
            calculo.funcaoParaCalcular = multiplicar;
            break;
        case "/":
            calculo.funcaoParaCalcular = dividir;
            break;
        default:
            calculo.funcaoParaCalcular = null;
            break;   
    }
}
// quando clicar no igual para exibir o resultado
function clicarResultado(){
    // entra caso exista um numero para calcular salvo e uma função para calcular
    if(!isNaN(inputResultado.value) && calculo.funcaoParaCalcular != null){
        // fizemos o calculo e armazenamos o resultado em uma variavel
        let resultado = calculo.funcaoParaCalcular(calculo.valorSalvo, Number(inputResultado.value));
        // adicionamos ao historico
        inserirTextoHistorico(inputResultado.value + "\n=" + resultado);
        inputResultado.value = resultado;
        calculo.valorSalvo = resultado;

        // tornamos a função calcular null
        calculo.funcaoParaCalcular = null;
    }
}


// somar
function somar(a, b){
    return a + b;
}

// subtrair
function subtrair(a, b){
    return a - b;
}

// dividir
function dividir(a, b){
    // caso dividir por zero, desabilita os botões
    if(b == 0){
        desabilitarBotoes(true);
        return "ERRO: Não é possivel dividir por zero";
    }else{
        // caso não esteja tentando dividir por zero, retorna o resultado da divisão
        return a / b;
    }
}

//desabilita todos os botes
function desabilitarBotoes(desabilitar){
    // pegando todos os elementos que tenha a clase btn
    let botoes = document.querySelectorAll(".btn");

    // acessando cada elemento do array botoes
    for(let botao of botoes){
        // acessando a propriedade disabled de cada elemento e setando com o valor de desabilitar que é um boolean
        botao.disabled = desabilitar;
    }

    document.querySelector("#btnLimpar").disabled = false;
}

// multiplicando
function multiplicar(a, b){
    return a * b;
}

// inserir texto no historico e quebrar a linha com o "\n"
function inserirTextoHistorico(texto){
    textAreaHistorico.textContent += texto + "\n";
    textAreaHistorico.scrollTop = textAreaHistorico.scrollHeight;
}
