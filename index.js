const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// Get the deposit amount
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter the deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again");
    } else {
      return numberDepositAmount;
    }
  }
};

// Get the number of lines they want to bet on
const getLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines you want to bet on(1-3): ");
    const numberLines = parseInt(lines);
    if (isNaN(numberLines) || numberLines <= 0 || numberLines > 3) {
      console.log("Invlid line, try again");
    } else {
      return numberLines;
    }
  }
};

// Get the bet amount
const getBet = (balance, line) => {
  while (true) {
    const bet = prompt(`Enter the bet amount per line: `);
    const numberBet = parseFloat(bet);
    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / line) {
      console.log("Invlaid bet amount, try again");
    } else {
      return numberBet;
    }
  }
};

// Spin the slot
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];

  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * symbols.length);
      const selectedSymbol = symbols[randomIndex];
      reels[i].push(selectedSymbol);
      symbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

// Transpose the reels
const transposeReels = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

// Print the slot reels
const printReels = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

// Check if they won
const getWinnings = (rows, bet, line) => {
  let winnings = 0;
  let allSame = true;

  for (let i = 0; i < line; i++) {
    for (let j = 1; j < COLS; j++) {
      if (rows[i][j] != rows[i][0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[rows[i][0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const line = getLines();
    const betAmount = getBet(balance, line);
    balance -= betAmount * line;
    const reels = spin();
    const rows = transposeReels(reels);
    printReels(rows);
    const winnings = getWinnings(rows, betAmount, line);
    balance += winnings;
    console.log("You won $" + winnings);

    if (balance <= 0) {
      console.log("You have run out of money!");
      break;
    }

    const playAgain = prompt("Do you want to continue (y/n)? ");
    if (playAgain.toLowerCase() == "n") {
      break;
    }
  }
};

game();
