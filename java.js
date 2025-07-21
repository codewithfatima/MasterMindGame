const gameScreen = document.getElementById('game-screen')
const startBtn = document.getElementById('start-btn');
const menuScreen = document.getElementById('menu-screen');
const rulesScreen = document.getElementById('rules-screen');
const backBtn = document.getElementById('back-btn')
const rulesBtn = document.getElementById('rules-btn');
const allowDup = document.getElementById('allow-duplicates');

let secretCode = [];
let currentGuess = [];
let currentRow = 0;
const maxAttempts = 10;
let allowDuplicates = false;


startBtn.addEventListener('click', () => {
  // allowDup = allowDup.checked;
  startBtn.style.display = 'none';
  menuScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  generateCode();
  setupGuesses();
})

rulesBtn.addEventListener('click', () => {
  menuScreen.style.display = "none";
  rulesScreen.style.display = "block";
})

backBtn.addEventListener('click', () => {
  rulesScreen.style.display = 'none';
  menuScreen.style.display = 'block';
})

function generateCode() {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange", "black", "white"];
  secretCode = [];

  while (secretCode.length < 4) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (!allowDup.checked && secretCode.includes(color)) continue;
    secretCode.push(color);

  }
  console.log("Secret code:", secretCode);
}

function setupGuesses() {
  const guesses = document.getElementById("guesses");
  guesses.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.className = "guess-row";
    row.dataset.row = i;
    for (let j = 0; j < 4; j++) {
      const slot = document.createElement("div");
      slot.className = "guess-slot";
      slot.dataset.index = j;

      slot.addEventListener("dragover", (e) => {
        const rowElement = slot.parentElement;
        const rowIndex = parseInt(rowElement.dataset.row);

        if (rowIndex !== currentRow) return;
        e.preventDefault();
      });
      slot.addEventListener("drop", (e) => {
        const color = e.dataTransfer.getData("color");
        slot.style.backgroundColor = color;
        slot.setAttribute("data-color", color);

        const rowElement = slot.parentElement;
  const rowIndex = parseInt(rowElement.dataset.row);
  
        if (rowIndex !== currentRow) return;
        e.preventDefault();
      });
      row.appendChild(slot);

    }
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    for (let k = 0; k < 4; k++) {
      const peg = document.createElement("div");
      peg.className = "peg";
      feedback.appendChild(peg);
    }
    row.appendChild(feedback);
    guesses.appendChild(row);
  }
  enableColorDrag();
  currentGuess = [];
  attempts = 0;
  updateScore();
  document.querySelectorAll(".colorPalette .color").forEach(colorBtn => {
    colorBtn.addEventListener("click", () => {
      if (currentGuess.length < 4) {
        currentGuess.push(colorBtn.classList[1]);
        updateCurrentRow();
      }
    });
  })
}

function enableColorDrag() {
  const colors = document.querySelectorAll(".color");

  colors.forEach(color => {
    color.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("color", color.dataset.color);
    });
  });
}
document.getElementById('check-btn').addEventListener('click', () => {
  const allRows = document.querySelectorAll(".guess-row");
  const guessRow = allRows[currentRow];
  const slots = guessRow.querySelectorAll(".guess-slot");

  const guessColors = [];

  for (let i = 0; i < slots.length; i++) {
    const color = slot = slots[i].getAttribute('data-color');
    if (!color) {
      alert("Fill all 4 slots before checking!");
      return;
    }
    guessColors.push(color);
  }

  const secretCopy = [...secretCode];
  const guessCopy = [...guessColors];
  let black = 0, white = 0;

  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] === secretCopy[i]) {
      black++;
      guessCopy[i] = secretCopy[i] = null;
    }
  }

  for (let i = 0; i < 4; i++) {
    if (guessCopy[i]) {
      const index = secretCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        white++;
        secretCopy[index] = null;
      }
    }
  }

  // Show feedback
  const pegs = guessRow.querySelectorAll(".peg");
  let pegIndex = 0;
  for (let i = 0; i < black; i++) {
    pegs[pegIndex++].style.backgroundColor = "red";
  }
  for (let i = 0; i < white; i++) {
    pegs[pegIndex++].style.backgroundColor = "white";
  }

  // Lock current row
  slots.forEach(slot => {
    slot.setAttribute('draggable', 'false');
  });

  // ✅ ✅ Put this block **inside** the event listener
  if (black === 4) {
    let stars = 3;
    if (currentRow >= 6) stars = 1;
    else if (currentRow >= 3) stars = 2;
    showStars(stars); // ✅ call function
    document.getElementById("custom-alert").style.display = "flex";
    return;
  }

  // Game over after 10 tries
  currentRow++;
  if (currentRow >= 10) {
    alert("Game Over! The code was: " + secretCode.join(", "));
    revealSecretCode();
  }
});

function showStars(count = 3) {
  const starContainer = document.getElementById("stars-container");
  starContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.textContent = "⭐️";
    star.style.fontSize = "2rem";
    star.style.margin = "0 5px";
    starContainer.appendChild(star);
  }
}

document.getElementById("play-again").addEventListener("click", () => {
  // Hide the custom alert modal
  document.getElementById("custom-alert").style.display = "none";

  // Reload the page to restart the game
  location.reload();
});
