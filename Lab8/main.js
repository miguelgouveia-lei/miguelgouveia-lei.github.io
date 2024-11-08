function resetText() {
    const hoverTextElement = document.getElementById("hoverText");
    hoverTextElement.textContent = "1. Passa por aqui!";
}

function highlightText() {
    const hoverTextElement = document.getElementById("hoverText");
    hoverTextElement.textContent = "Obrigado por passares!";
}


changeTextColor = (color) => {

    const colorTextElement = document.getElementById("colorText");
    colorTextElement.style.color = color;

}

function changeInputColor() {
    const textInputElement = document.getElementById("textInput");
    const colors = ["lightblue", "lightgreen", "lightcoral", "lightyellow", "lightpink"];
    
    // Escolhe uma cor aleatória da lista
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    textInputElement.style.backgroundColor = randomColor;
}


function changeColor() {
    const color = document.getElementById('colorInput').value;

    if(color == "Selecione uma cor"){
        document.body.style.background = "white";
    }
    if (color) {
        document.body.style.backgroundColor = color;
    }
}

let counter = 0; // Inicializa o contador



// Se não existir a chave 'counter' em LS, inicializamos
if (!localStorage.getItem('counter')) {
    localStorage.setItem('counter', 0);
}

function incrementCounter() {
    let counter = parseInt(localStorage.getItem('counter'), 10); // Converte para número
    counter += 1; // Incrementa o contador em 1
    const countResultElement = document.getElementById("countResult");
    countResultElement.textContent = counter;

    localStorage.setItem('counter', counter); // Armazena o novo valor no localStorage
}

// Exibe o valor inicial do contador no h1
//document.querySelector('h1').textContent = localStorage.getItem('counter');

function displayMessage() {
    const name = document.getElementById('nameInput').value;
    const age = document.getElementById('ageInput').value;
    const message = `Olá, o ${name} tem ${age} anos`;
    document.getElementById('greetingMessage').textContent = message;
}
let counter2 = 0; // Inicializa o contador

setInterval(() => {
    counter2++;
    document.getElementById('autoCounter').textContent = counter2;
}, 1000);