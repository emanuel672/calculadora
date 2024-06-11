const numKeyOutputMap = {
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9",
  "zero": "0",
};

const operators = {
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/"
};

let previousOperand = document.querySelector("[data-previous]"); // Seleciona o elemento HTML que mostra o operando anterior
let operator = null; // Armazena o operador atual
let inputBuffer = ""; // Buffer para lidar com números ou operadores iniciais
let displayText = "0";  // Texto exibido no visor da calculadora, inicializado com 0
let decimalAdded = false; // Flag para controlar se o ponto decimal já foi adicionado

// Função para calcular o resultado da expressão
function calculateResult() {
  try {
    /* Lidar com casos especiais de operadores consecutivos */
    displayText = displayText.replace(/\*-\+/g, '+').replace(/\*--/g, '-').replace(/-\+/g, '-').replace(/--/g, '+').replace(/\++/g, '+');
    const result = eval(displayText); // Avalia a expressão
    displayText = result.toString(); // Converte o resultado para string
  } catch (error) {
    displayText = "Error"; // Em caso de erro, exibe "Error"
  }
}

// Função para atualizar o visor da calculadora
function updateDisplay() {
  if (displayText.length > 1 && displayText.startsWith("0")) {
    displayText = displayText.slice(1); // Remove o "0" à esquerda, se houver outros dígitos
  }
  document.querySelector("#display").innerHTML = displayText; // Atualiza o texto exibido no visor
  if(operator !== null) {
    previousOperand.innerText = `${displayText}`; // Atualiza o operando anterior, se houver um operador atual
  }
}

// Função chamada quando um botão é pressionado
function press(key) {
  if (key in numKeyOutputMap || key === "decimal") {
    // Entradas numéricas e ponto decimal
    if (key === "decimal") {
      if (!decimalAdded) {
        inputBuffer += ".";
        displayText += ".";
        decimalAdded = true;
      }
    } else {
      inputBuffer += numKeyOutputMap[key];
      displayText += numKeyOutputMap[key];
    }
  } else if (key in operators) {
    // Operadores
    if (inputBuffer && operator && operator !== "negative") {
      // Avalia a expressão anterior antes de adicionar um novo operador
      calculateResult();
    }
    operator = key;
    displayText += operators[key];
    inputBuffer = "";
    decimalAdded = false;
  } else {
    switch (key) {
      case "ac":
        displayText = "0";
        inputBuffer = "";
        operator = null;
        decimalAdded = false;
        break;
      case "delete":
        displayText = displayText.slice(0, -1);
        inputBuffer = inputBuffer.slice(0, -1);
        if (displayText === "") {
          displayText = "0";
        }
        break;
      case "equals":
        calculateResult();
        break;
    }
  }
  updateDisplay();
}

// Função chamada quando o DOM é carregado
document.addEventListener("DOMContentLoaded", function () {
  const numBtns = document.querySelectorAll("[data-number]");
  const deleteBtn = document.querySelector("[data-delete]");
  const acBtn = document.querySelector("[data-AC]");
  const equalsBtn = document.querySelector("[data-equals]");
  const operationBtns = document.querySelectorAll("[data-operation]");

  // Adiciona listeners de evento para os botões numéricos
  Array.from(numBtns).forEach((button) => {
    button.addEventListener("click", function () {
      press(button.getAttribute("data-action"));
    });
  });
  
  // Adiciona listener de evento para o botão de deletar
  deleteBtn.addEventListener("click", function () {
    press("delete");
  });
  
  // Adiciona listener de evento para o botão AC (all clear)
  acBtn.addEventListener("click", function () {
    press("ac");
  });
  
  // Adiciona listener de evento para o botão de igualdade
  equalsBtn.addEventListener("click", function () {
    press("equals");
  });
  
  // Adiciona listeners de evento para os botões de operação
  operationBtns.forEach((button) => {
    button.addEventListener("click", function () {
      press(button.getAttribute("data-operation"));
    });
  });
  
  updateDisplay(); // Atualiza o visor quando a página é carregada
});
