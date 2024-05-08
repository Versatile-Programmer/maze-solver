// Global variables to store maze size, the maze itself, start/end points, and solution path
let mazeSize = 0;
let maze = [];
let startCell = null;
let endCell = null;
let solutionPath = [];

function generateMaze() {
  // Reset start, end, and solution path
  startCell = null;
  endCell = null;
  solutionPath = [];

  // Get maze size from input
  mazeSize = parseInt(document.getElementById("mazeSize").value);

  // Initialize maze array
  maze = [];
  for (let i = 0; i < mazeSize; i++) {
    maze[i] = [];
    for (let j = 0; j < mazeSize; j++) {
      maze[i][j] = 1; // 1 represents a wall
    }
  }

  // Call maze generation algorithm (DFS)
  generateMazeDFS(0, 0);

  // Display generated maze
  displayMaze();

  // Add event listeners to cells for setting start and end points
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (!startCell && !cell.classList.contains('wall')) {
        cell.classList.add('start');
        startCell = cell;
      } else if (!endCell && !cell.classList.contains('wall') && cell !== startCell) {
        cell.classList.add('end');
        endCell = cell;
      }
    });
  });
}

function generateMazeDFS(row, col) {
  // Mark current cell as visited
  maze[row][col] = 0;

  // Define random order to visit neighboring cells
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  directions.sort(() => Math.random() - 0.5);

  // Visit neighboring cells
  for (const [dx, dy] of directions) {
    const newRow = row + dx * 2;
    const newCol = col + dy * 2;
    if (newRow >= 0 && newRow < mazeSize && newCol >= 0 && newCol < mazeSize && maze[newRow][newCol] === 1) {
      maze[row + dx][col + dy] = 0; // Remove wall between current and neighbor cell
      generateMazeDFS(newRow, newCol);
    }
  }
}

function displayMaze() {
  const mazeContainer = document.getElementById("mazeContainer");
  mazeContainer.innerHTML = "";

  for (let i = 0; i < mazeSize; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < mazeSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (maze[i][j] === 1) {
        cell.classList.add("wall");
      }
      row.appendChild(cell);
    }
    mazeContainer.appendChild(row);
  }
}

function solveMaze() {
  if (!startCell || !endCell) {
    alert("Please set both start and end points before solving the maze.");
    return;
  }

  // Call maze solving algorithm (BFS)
  bfs(startCell, endCell);

  // Display solution path
  displaySolution();
}

function bfs(start, end) {
  const queue = [[start]];
  const visited = new Set();
  visited.add(start);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current === end) {
      solutionPath = path;
      break;
    }

    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  }
}

function getNeighbors(cell) {
  const [row, col] = getCellPosition(cell);
  const neighbors = [];

  // Possible moves: up, down, left, right
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (isValidCell(newRow, newCol) && maze[newRow][newCol] !== 1) {
      neighbors.push(getCell(newRow, newCol));
    }
  }

  return neighbors;
}

function isValidCell(row, col) {
  return row >= 0 && row < mazeSize && col >= 0 && col < mazeSize;
}

function getCell(row, col) {
  return document.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`);
}

function getCellPosition(cell) {
  const rowIndex = Array.from(cell.parentElement.parentElement.children).indexOf(cell.parentElement);
  const colIndex = Array.from(cell.parentElement.children).indexOf(cell);
  return [rowIndex, colIndex];
}

function displaySolution() {
  solutionPath.forEach((cell, index) => {
    if (!cell.classList.contains('start') && !cell.classList.contains('end'))
    setTimeout(() => {
      cell.classList.add('path');
    }, index * 100); // Adjust the delay (in milliseconds) for desired animation speed

  });
}


function showInputPage() {
  document.getElementById("mazeInputPage").style.display = "block";
  document.getElementById("solutionPage").style.display = "none";
}

function showSolutionPage() {
  document.getElementById("mazeInputPage").style.display = "none";
  document.getElementById("solutionPage").style.display = "block";
}
