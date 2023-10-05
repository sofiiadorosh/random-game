let grid = document.querySelector(".game__field");
const tryAgain = document.querySelector(".over__button_try");
const playAgain = document.querySelector(".win__button_play");
const over = document.querySelector(".over__overlay");
const win = document.querySelector(".win__overlay");
const overScore = document.querySelector(".over__score");
const winScore = document.querySelector(".win__score");
const container = document.querySelector(".container");
const result = document.getElementById("result");

let matrix,
  score,
  isSwiped,
  touchY,
  initialY = 0,
  touchX,
  initialX = 0,
  rows = 4,
  columns = 4,
  swipeDirection;

let rectLeft = grid.getBoundingClientRect().left;
let rectTop = grid.getBoundingClientRect().top;

const getXY = (e) => {
  touchX = e.touches[0].pageX - rectLeft;
  touchY = e.touches[0].pageY - rectTop;
};

const createGrid = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("div");
      cell.classList.add("game__cell");
      cell.setAttribute("data-position", `${i}_${j}`);
      grid.appendChild(cell);
    }
  }
};

const adjacentCheck = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      return true;
    }
  }
  return false;
};

const possibleMovesCheck = () => {
  for (let i in matrix) {
    if (adjacentCheck(matrix[i])) {
      return true;
    }
    let colarr = [];
    for (let j = 0; j < columns; j++) {
      colarr.push(matrix[i][j]);
    }
    if (adjacentCheck(colarr)) {
      return true;
    }
  }
  return false;
};

const randomPosition = (arr) => {
  return Math.floor(Math.random() * arr.length);
};

const hasEmptyBox = () => {
  for (let r in matrix) {
    for (let c in matrix[r]) {
      if (matrix[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
};

const saveResultsToLocalStorage = () => {
  const results = JSON.parse(localStorage.getItem("results"));
  if (!results) {
    localStorage.setItem("results", JSON.stringify([score]));
  } else {
    if (results.length === 10) {
      results.shift();
      results.push(score);
      localStorage.setItem("results", JSON.stringify(results));
    } else {
      results.push(score);
      localStorage.setItem("results", JSON.stringify(results));
    }
  }
};

const gameOverCheck = () => {
  if (!possibleMovesCheck()) {
    over.classList.remove("over__overlay_hidden");
    overScore.innerText = score;
    saveResultsToLocalStorage();
  }
};

const gameWinCheck = () => {
  const didWin = matrix.some((row) => row.find((cell) => cell === 16));
  if (didWin) {
    win.classList.remove("win__overlay_hidden");
    winScore.innerText = score;
    saveResultsToLocalStorage();
  }
};

const generateTwo = () => {
  if (hasEmptyBox()) {
    let randomRow = randomPosition(matrix);
    let randomCol = randomPosition(matrix[randomPosition(matrix)]);
    if (matrix[randomRow][randomCol] == 0) {
      matrix[randomRow][randomCol] = 2;
      let element = document.querySelector(
        `[data-position = '${randomRow}_${randomCol}']`
      );
      element.innerHTML = 2;
      element.classList.add("box-2");
    } else {
      generateTwo();
    }
  } else {
    gameOverCheck();
  }
};
const generateFour = () => {
  if (hasEmptyBox()) {
    let randomRow = randomPosition(matrix);
    let randomCol = randomPosition(matrix[randomPosition(matrix)]);
    if (matrix[randomRow][randomCol] == 0) {
      matrix[randomRow][randomCol] = 4;
      let element = document.querySelector(
        `[data-position= '${randomRow}_${randomCol}']`
      );
      element.innerHTML = 4;
      element.classList.add("box-4");
    } else {
      generateFour();
    }
  } else {
    gameOverCheck();
  }
};
const removeZero = (arr) => arr.filter((num) => num);

const checker = (arr, reverseArr = false) => {
  arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      arr[i] += arr[i + 1];
      arr[i + 1] = 0;
      score += arr[i];
    }
  }
  arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);
  let missingCount = 4 - arr.length;
  while (missingCount > 0) {
    if (reverseArr) {
      arr.unshift(0);
    } else {
      arr.push(0);
    }
    missingCount -= 1;
  }
  return arr;
};

const slideDown = () => {
  for (let i = 0; i < columns; i++) {
    let num = [];
    for (let j = 0; j < rows; j++) {
      num.push(matrix[j][i]);
    }
    num = checker(num, true);
    for (let j = 0; j < rows; j++) {
      matrix[j][i] = num[j];
      let element = document.querySelector(`[data-position='${j}_${i}']`);
      element.innerHTML = matrix[j][i] ? matrix[j][i] : "";
      element.classList.value = "";
      element.classList.add("game__cell", `box-${matrix[j][i]}`);
    }
  }
  gameWinCheck();
  let decision = Math.random() > 0.5 ? 1 : 0;
  if (decision) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }
};

const slideUp = () => {
  for (let i = 0; i < columns; i++) {
    let num = [];
    for (let j = 0; j < rows; j++) {
      num.push(matrix[j][i]);
    }
    num = checker(num);
    for (let j = 0; j < rows; j++) {
      matrix[j][i] = num[j];
      let element = document.querySelector(`[data-position = '${j}_${i}']`);
      element.innerHTML = matrix[j][i] ? matrix[j][i] : "";
      element.classList.value = "";
      element.classList.add("game__cell", `box-${matrix[j][i]}`);
    }
  }
  gameWinCheck();
  let decision = Math.random() > 0.5 ? 1 : 0;
  if (decision) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }
};

const slideRight = () => {
  for (let i = 0; i < rows; i++) {
    let num = [];
    for (let j = 0; j < columns; j++) {
      num.push(matrix[i][j]);
    }
    num = checker(num, true);
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = num[j];
      let element = document.querySelector(`[data-position = '${i}_${j}']`);
      element.innerHTML = matrix[i][j] ? matrix[i][j] : "";
      element.classList.value = "";
      element.classList.add("game__cell", `box-${matrix[i][j]}`);
    }
  }
  gameWinCheck();
  let decision = Math.random() > 0.5 ? 1 : 0;
  if (decision) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }
};

const slideLeft = () => {
  for (let i = 0; i < rows; i++) {
    let num = [];
    for (let j = 0; j < columns; j++) {
      num.push(matrix[i][j]);
    }
    num = checker(num);
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = num[j];
      let element = document.querySelector(`[data-position = '${i}_${j}']`);
      element.innerHTML = matrix[i][j] ? matrix[i][j] : "";
      element.classList.value = "";
      element.classList.add("game__cell", `box-${matrix[i][j]}`);
    }
  }
  gameWinCheck();
  let decision = Math.random() > 0.5 ? 1 : 0;
  if (decision) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }
};

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
  } else if (e.code == "ArrowRight") {
    slideRight();
  } else if (e.code == "ArrowUp") {
    slideUp();
  } else if (e.code == "ArrowDown") {
    slideDown();
  }
  document.getElementById("score").innerText = score;
});

grid.addEventListener("touchstart", (event) => {
  isSwiped = true;
  getXY(event);
  initialX = touchX;
  initialY = touchY;
});

grid.addEventListener("touchmove", (event) => {
  if (isSwiped) {
    getXY(event);
    let diffX = touchX - initialX;
    let diffY = touchY - initialY;
    if (Math.abs(diffY) > Math.abs(diffX)) {
      swipeDirection = diffX > 0 ? "down" : "up";
    } else {
      swipeDirection = diffX > 0 ? "right" : "left";
    }
  }
});

grid.addEventListener("touchend", () => {
  isSwiped = false;
  let swipeCalls = {
    up: slideUp,
    down: slideDown,
    left: slideLeft,
    right: slideRight,
  };
  swipeCalls[swipeDirection]();
  document.getElementById("score").innerText = score;
});

const startGame = () => {
  score = 0;
  document.getElementById("score").innerText = score;
  grid.innerHTML = "";
  matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  createGrid();
  generateTwo();
  generateTwo();
};

startGame();

tryAgain.addEventListener("click", () => {
  startGame();
  swipeDirection = "";
  over.classList.add("over__overlay_hidden");
  win.classList.add("win__overlay_hidden");
});

playAgain.addEventListener("click", () => {
  startGame();
  swipeDirection = "";
  win.classList.add("win__overlay_hidden");
});
