function highlightText() {
    const hoverTextElement = document.getElementById("hoverText");
    hoverTextElement.textContent = "Obrigado por passares!";
}

function resetText() {
    const hoverTextElement = document.getElementById("hoverText");
    hoverTextElement.textContent = "1. Passa por aqui!";
}

function changeTextColor(color) {
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

function submitColor() {
    const color = document.getElementById("colorInput").value.toLowerCase();
    document.body.style.backgroundColor = color;
}

let counter = 0; // Inicializa o contador

function incrementCounter() {
    counter += 1; // Incrementa o contador em 1
    const countResultElement = document.getElementById("countResult");
    countResultElement.textContent = counter;
    
    // Aumenta o tamanho da fonte do número
    let currentFontSize = parseInt(window.getComputedStyle(countResultElement).fontSize);
    countResultElement.style.fontSize = (currentFontSize + 2) + "px";
}