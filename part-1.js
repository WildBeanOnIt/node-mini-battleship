var readlineSync = require("readline-sync");

const topGridLetter = ["A", "B", "C"];
const leftGridNum = ["1", "2", "3"];

const grid = [];

for (const char of topGridLetter) {
  for (const num of leftGridNum) {
    // console.log(char, num);
    grid.push(`${char}${num}`);
  }
}
console.log(grid);

function myRandomShip(grid) {
  //gets random index value
  const randomIndex = Math.floor(Math.random() * grid.length);

  //get random index
  const item = grid[randomIndex];

  return item;
}

function createShips() {
  const ships = [];

  var ship1 = myRandomShip(grid);

  var ship2 = myRandomShip(grid);

  while (ship1 === ship2) {
    var ship2 = myRandomShip(grid);
  }

  ships.push(ship1, ship2);

  return ships;
}

const myShips = createShips();
console.log(`My ships ${myShips}`);

//! Ask user to Enter a location to strike
const userStrike = readlineSync
  .question(`Bot: Enter a location to Strike (i.e "A2") `)
  .toUpperCase();

console.log(`User: You strike ${userStrike}`);

const userStrikeHistory = [];

function hitOrMiss(ships, strike) {
  if (userStrikeHistory.includes(strike)) {
    console.log(`You have already picked this location. Miss!`);
  } else if (ships.includes(strike)) {
    const index = ships.indexOf(strike);
    ships.splice(index, 1);

    const remainingShips = ships.length;
    console.log(
      `You have sunk a battleship. ${remainingShips} ship remaining.`
    );
  } else {
    console.log(`You have missed!`);
  }

  userStrikeHistory.push(strike);
}
hitOrMiss(myShips, userStrike);

function resetGame() {
  userStrikeHistory.length = 0;
  myShips.length = 0;
  myShips.push(...createShips());
  console.log("New game started. Good Luck!");
}

let gameRunning = true;

function startGame() {
  while (gameRunning) {
    const userStrike = readlineSync
      .question("Bot: Enter a location to Strike (i.e 'A2') ")
      .toUpperCase();
    console.log(`User: You struck ${userStrike}`);

    hitOrMiss(myShips, userStrike);

    if (myShips.every((ship) => userStrikeHistory.includes(ship))) {
      console.log(`Congratulations! You have destroyed all battleships`);
      const playAgain = readlineSync
        .question("Would you like to play again (Y/N) ")
        .toUpperCase();

      if (playAgain === "Y") {
        resetGame();
      } else {
        gameRunning = false;
      }
    }
  }
}
startGame();
