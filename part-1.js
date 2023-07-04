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
