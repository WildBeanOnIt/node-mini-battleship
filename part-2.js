let readlineSync = require("readline-sync");

const minGridSize = 3;
const maxGridSize = 10;
const maxGridIndex = maxGridSize - 1;

//! Function to convert a number to its corresponding letter (A-J)
const numberToLetterConverter = (number) => {
  return String.fromCharCode(65 + number);
};

//! Function to create an empty grid
function createEmptyGrid(gridSize) {
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push({ symbol: " ~", isShip: false, isHit: false, shipName: "" });
    }
    grid.push(row);
  }
  return grid;
}

//! Function to randomly place ships on the grid
function placeShips(grid, shipTypes) {
  const occupiedPositions = new Set(); // Create a set to store occupied positions

  for (const ship of shipTypes) {
    let isShipPlaced = false;
    while (!isShipPlaced) {
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid.length);
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

      const key = `${row}-${col}-${orientation}`; // Create a key to identify ship position and orientation

      if (
        !occupiedPositions.has(key) &&
        canPlaceShip(grid, row, col, ship.length, orientation)
      ) {
        if (orientation === "horizontal") {
          for (let i = 0; i < ship.length; i++) {
            grid[row][col + i].isShip = true;
            grid[row][col + i].shipName = ship.name;
            grid[row][col + i].xCoord = col + i; // Store actual x-coordinate
            grid[row][col + i].yCoord = row; // Store actual y-coordinate
            occupiedPositions.add(`${row}-${col + i}-horizontal`); // Mark positions as occupied
          }
        } else {
          for (let i = 0; i < ship.length; i++) {
            grid[row + i][col].isShip = true;
            grid[row + i][col].shipName = ship.name;
            grid[row + i][col].xCoord = col; // Store actual x-coordinate
            grid[row + i][col].yCoord = row + i; // Store actual y-coordinate
            occupiedPositions.add(`${row + i}-${col}-vertical`); // Mark positions as occupied
          }
        }
        isShipPlaced = true;
      }
    }
  }
}

//! Function to check if a ship can be placed in a specific location
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

//! Function to display the grid
function displayGrid(grid) {
  const horizontalLine = "" + "".repeat(grid.length * 3);
  const verticalLine = " |";
  const header = [" "];

  //! Create header for the top row (numbers 1-10)
  for (let i = 0; i < grid.length; i++) {
    header.push(`${i + 1}`.padStart(3, " "));
  }
  console.log(header.join(" "));

  //! Create the grid rows
  for (let i = 0; i < grid.length; i++) {
    const row = [numberToLetterConverter(i)]; // Add letter header for each row
    for (let j = 0; j < grid.length; j++) {
      const cell = grid[i][j];
      if (cell.isHit) {
        if (cell.isShip) {
          row.push(` ${cell.shipName.charAt(0)}`); // Show the first letter of the ship name
        } else {
          row.push(" *"); // Mark empty cell hit with 'O'
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

  // Display ships' coordinates
  console.log("\n=== SHIPS' COORDINATES ===");
  for (const row of grid) {
    const shipCoordinates = row
      .filter((cell) => cell.isShip)
      .map(
        (cell) => `${numberToLetterConverter(cell.yCoord)}${cell.xCoord + 1}`
      );
    if (shipCoordinates.length > 0) {
      console.log(`${shipCoordinates.join(", ")}`);
    }
  }
}

//!Adj. Ships
function adjustShipTypes(gridSize) {
  // Define your ship types with their initial lengths
  const initialShipTypes = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Destroyer", length: 2 },
  ];

  const maxTotalLength = gridSize * gridSize; // The maximum number of cells on the grid

  // Calculate the total length of all ships based on their initial lengths
  const totalInitialLength = initialShipTypes.reduce(
    (total, ship) => total + ship.length,
    0
  );

  // If the total length of ships is greater than the maximum allowed, adjust ship lengths
  if (totalInitialLength > maxTotalLength) {
    // Calculate the factor by which we need to scale down the ship lengths
    const scalingFactor = maxTotalLength / totalInitialLength;

    // Adjust the lengths of each ship based on the scaling factor
    const adjustedShipTypes = initialShipTypes.map((ship) => ({
      ...ship,
      length: Math.floor(ship.length * scalingFactor),
    }));

    return adjustedShipTypes;
  }

  // If the total length is within the limit, return the initial ship types as is
  return initialShipTypes;
}

//! Function to play the game
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

  //*shipsss
  const shipTypes = [
    { name: "Carrier", length: gridSize },
    { name: "Battleship", length: gridSize - 1 },
    { name: "cruiser", length: gridSize - 2 },
    { name: "Submarine", length: gridSize - 2 },
    { name: "Destroyer", length: gridSize - 3 },
  ];

  const adjustedShipTypes = adjustShipTypes(gridSize); // Adjust ship lengths
  const grid = createEmptyGrid(gridSize);
  placeShips(grid, adjustedShipTypes);

  let remainingShips = shipTypes.length;
  let totalHits = 0;

  const totalShipsLength = adjustedShipTypes.reduce(
    (sum, ship) => sum + ship.length,
    0
  );

  while (remainingShips > 0) {
    console.log("\n=== BATTLESHIP GAME ===\n");
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
          console.log("\nIt's a hit! 💣 \n");
          totalHits++;
          if (totalHits === totalShipsLength) {
            console.log("\nCongratulations! You sunk all the ships! 🥇\n");
            break;
          }
        } else {
          console.log("\nIt's a miss! ❌ \n");
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

  //! Display the final grid after the game ends
  console.log("\n=== FINAL GRID ===\n");
  displayGrid(grid);
}

//! Start the game
playGame();
