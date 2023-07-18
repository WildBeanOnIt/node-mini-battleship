var readlineSync = require("readline-sync");

const minGridSize = 3;
const maxGridSize = 10;
const maxGridIndex = maxGridSize - 1;

// Function to convert a number to its corresponding letter (A-J)
const numberToLetterConverter = (number) => {
  return String.fromCharCode(65 + number); // ASCII code of 'A' is 65
};

// Function to create an empty grid
function createEmptyGrid(gridSize) {
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push({ symbol: " ~", isShip: false, isHit: false });
    }
    grid.push(row);
  }
  return grid;
}

// Function to randomly place ships on the grid
function placeShips(grid, shipTypes) {
  for (const ship of shipTypes) {
    let isShipPlaced = false;
    while (!isShipPlaced) {
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid.length);
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

      if (canPlaceShip(grid, row, col, ship.length, orientation)) {
        if (orientation === "horizontal") {
          for (let i = 0; i < ship.length; i++) {
            grid[row][col + i].isShip = true;
          }
        } else {
          for (let i = 0; i < ship.length; i++) {
            grid[row + i][col].isShip = true;
          }
        }
        isShipPlaced = true;
      }
    }
  }
}

// Function to check if a ship can be placed in a specific location
function canPlaceShip(grid, row, col, length, orientation) {
  if (orientation === "horizontal") {
    if (col + length > grid.length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      if (grid[row][col + i].isShip) {
        return false;
      }
    }
  } else {
    if (row + length > grid.length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      if (grid[row + i][col].isShip) {
        return false;
      }
    }
  }
  return true;
}

// Function to display the grid
function displayGrid(grid) {
  const horizontalLine = "" + "".repeat(grid.length * 3); // Horizontal line separator
  const verticalLine = " |"; // Vertical line separator
  const header = [" "]; // Start with two empty spaces for top-left corner

  // Create header for the top row (numbers 1-10)
  for (let i = 0; i < grid.length; i++) {
    header.push(`${i + 1}`.padStart(3, " "));
  }
  console.log(header.join(" "));

  // Create the grid rows
  for (let i = 0; i < grid.length; i++) {
    const row = [numberToLetterConverter(i)]; // Add letter header for each row
    for (let j = 0; j < grid.length; j++) {
      const cell = grid[i][j];
      if (cell.isHit) {
        if (cell.isShip) {
          row.push(" X"); // Mark hit ship with 'X'
        } else {
          row.push(" O"); // Mark empty cell hit with 'O'
        }
      } else if (cell.isShip) {
        row.push(" ~"); // Display the symbol for ships that haven't been hit
      } else {
        row.push(cell.symbol); // Display the symbol for unhit cells
      }
    }
    console.log(row.join(verticalLine));
    console.log(horizontalLine);
  }
}

// Function to play the game
function playGame() {
  let gridSize = 0;
  while (gridSize < minGridSize || gridSize > maxGridSize || isNaN(gridSize)) {
    gridSize = readlineSync.question(
      `Enter grid size (${minGridSize}-${maxGridSize}): `
    );
    gridSize = parseInt(gridSize);
    if (isNaN(gridSize) || gridSize < minGridSize || gridSize > maxGridSize) {
      console.log("Invalid grid size. Please try again.");
    }
  }

  const shipTypes = [
    { name: "Carrier", length: gridSize },
    { name: "Battleship", length: gridSize - 1 },
    { name: "Cruiser", length: gridSize - 2 },
    { name: "Submarine", length: gridSize - 2 },
    { name: "Destroyer", length: gridSize - 3 },
  ];

  const grid = createEmptyGrid(gridSize);
  placeShips(grid, shipTypes);
  let remainingShips = shipTypes.length;
  let totalHits = 0;

  while (remainingShips > 0) {
    console.log("\n=== BATTLESHIP GAME ===");
    displayGrid(grid);
    let guessRow = -1;
    while (guessRow < 0 || guessRow >= gridSize || isNaN(guessRow)) {
      guessRow = readlineSync.question(
        `Enter row (A-${numberToLetterConverter(gridSize - 1)}): `
      );
      guessRow = guessRow.toUpperCase().charCodeAt(0) - 65;
      if (isNaN(guessRow) || guessRow < 0 || guessRow >= gridSize) {
        console.log(
          `Invalid row. Please enter a letter between A and ${numberToLetterConverter(
            gridSize - 1
          )}.`
        );
      }
    }
    let guessCol = -1;
    while (guessCol < 1 || guessCol > gridSize || isNaN(guessCol)) {
      guessCol = readlineSync.question(`Enter column (1-${gridSize}): `);
      guessCol = parseInt(guessCol);
      if (isNaN(guessCol) || guessCol < 1 || guessCol > gridSize) {
        console.log(
          `Invalid column. Please enter a number between 1 and ${gridSize}.`
        );
      }
    }

    const row = guessRow;
    const col = guessCol - 1;

    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      const cell = grid[row][col];
      if (cell.isHit) {
        console.log("You've already hit this cell! Try again.");
      } else {
        cell.isHit = true;
        if (cell.isShip) {
          console.log("It's a hit!");
          totalHits++;
          if (
            totalHits === shipTypes.reduce((sum, ship) => sum + ship.length, 0)
          ) {
            console.log("Congratulations! You sunk all the ships!");
            break;
          }
        } else {
          console.log("It's a miss!");
        }
      }
    } else {
      console.log(
        `Invalid guess! Please enter a valid row (A-${numberToLetterConverter(
          gridSize - 1
        )}) and column (1-${gridSize}).`
      );
    }
  }

  // Display the final grid after the game ends
  console.log("\n=== FINAL GRID ===\n");
  displayGrid(grid);
}

// Start the game
playGame();
