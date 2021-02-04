const FIELD_SIZE_X = 20
const FIELD_SIZE_Y = 20
const SNAKESPEED = 200
const snake = []
const foodTimer = 5000
const BOMBTIME = 10000
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const UP_ARROW = 38
const DOWN_ARROW = 40
const FOODUNITNAME = 'food-unit'
const BOMBUNITNAME = 'bomb-unit'
let direction = 'y+'
let gameIsRunning = false
let snakeTimer
let score = 0
let newClass
const buildClass = (x, y) => `.cell-${y}-${x}`

function init() {
  createMap()
  document.getElementById('snake-start').addEventListener('click', starGame)
  document.getElementById('snake-renew').addEventListener('click', refreshGame)
  addEventListener('keydown', changeDirection)
}

function createMap() {
  const gameTable = document.createElement('table')
  gameTable.classList.add('game-table')
  createRowsCells(FIELD_SIZE_X, FIELD_SIZE_Y, gameTable)
  document.getElementById('snake-field').appendChild(gameTable) // add table
}

function createRowsCells(rows, cells, table) {
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('tr')
    row.className = `game-table-row row-${i}`;
    for (let j = 0; j < cells; j++) {
      const cell = document.createElement('td')
      cell.className = `game-table-cell cell-${i}-${j}`;
      row.appendChild(cell)
    }
    table.appendChild(row)
  }
}

function starGame() {
  gameIsRunning = true;
  respawn() // creating a snake
  snakeTimer = setInterval(move, SNAKESPEED) // every 200 ms run function move
  setTimeout(createFood, foodTimer)
  setInterval(createBomb, BOMBTIME)
}

function respawn() {
  const startCoordX = parseInt(FIELD_SIZE_X / 2)
  const startCoordY = parseInt(FIELD_SIZE_Y / 2)

  // snake's head
  const snakeHead = document.querySelector(`.cell-${startCoordY}-${startCoordX}`)
  snakeHead.setAttribute('class', `${snakeHead.getAttribute('class')} snake-unit`)
  // snake's tail
  const snakeTail = document.getElementsByClassName(`cell-${startCoordY - 1}-${startCoordX}`)[0];
  snakeTail.setAttribute('class', `${snakeTail.getAttribute('class')} snake-unit`)
  snake.push(snakeHead)
  snake.push(snakeTail)
}

// movment of the snake

function move() {
  const coordY = parseInt(CreateSnakeCoords(snake)[1])
  const coordX = parseInt(CreateSnakeCoords(snake)[2])
  const newUnit = definingNewPoint(coordX, coordY, direction);
  if (!isSnakeUnit(newUnit) && newUnit !== undefined && !isBomb(newUnit)) {
    newUnit.setAttribute('class', `${newUnit.getAttribute('class')} snake-unit`)
    snake.push(newUnit)

    // check remove tail
    if (!haveFood(newUnit)) {
      removeTail()
    }
  } else {
    finishTheGame()
  }
}

function removeTail() {
  const removed = snake.splice(0, 1)[0];
  const classes = removed.getAttribute('class').split(' ')
  removed.setAttribute('class', `${classes[0]} ${classes[1]}`)
}

function CreateSnakeCoords(snake) {
  const snakeHeadClasses = snake[snake.length - 1].getAttribute('class').split(' ')
  const snakeCoords = snakeHeadClasses[1].split('-')
  return snakeCoords
}

function definingNewPoint(x, y, direction) {
  if (direction == 'x-') {
    newClass = buildClass(x - 1, y)
    newUnit = document.querySelector(newClass)
  } else if (direction == 'x+') {
    newClass = buildClass(x + 1, y)
    newUnit = document.querySelector(newClass)
  } else if (direction == 'y+') {
    newClass = buildClass(x, y - 1)
    newUnit = document.querySelector(newClass);
  } else if (direction == 'y-') {
    newClass = buildClass(x, y + 1)
    newUnit = document.querySelector(newClass);
  }
  return newUnit
}

function isSnakeUnit(unit) {
  return snake.includes(unit);
}

function isBomb(unit) {
  let check = false;
  const unitClasses = unit.getAttribute('class').split(' ')

  if (unitClasses.includes('bomb-unit')) {
    check = true;
  }
  return check;
}

// checking for a food

function haveFood(unit) {
  let check = false;
  const unitClasses = unit.getAttribute('class').split(' ')
  // if food
  if (unitClasses.includes(FOODUNITNAME)) {
    check = true;
    createFood()
    score++;
    scoreTable(score)
  }
  return check;
}

function createFood() {
  let foodCreated = false;
  while (!foodCreated) {
    const foodX = parseInt(Math.random() * FIELD_SIZE_X)
    const foodY = parseInt(Math.random() * FIELD_SIZE_Y)
    const foodCell = document.getElementsByClassName(`cell-${foodY}-${foodX}`)[0];
    const foodCellClasses = foodCell.getAttribute('class').split(' ')
    // cheking for a snake
    foodCreated = !isSnakeUnit(foodCell)
    if (foodCreated) {
      createNewUnit(foodCell, foodCellClasses, FOODUNITNAME)
    }
  }
}

function createNewUnit(cell, cellClasses, unitName) {
  let classes = ''
  for (let i = 0; i < cellClasses.length; i++) {
    classes += `${cellClasses[i]} `
  }
  cell.setAttribute('class', `${classes} ${unitName} `)
}

function createBomb() {
  let bombCreated = false;
  while (!bombCreated) {
    const bombX = parseInt(Math.random() * FIELD_SIZE_X)
    const bombY = parseInt(Math.random() * FIELD_SIZE_Y)
    const bombCell = document.querySelector(`.cell-${bombY}-${bombX}`)
    const bombCellClasses = bombCell.getAttribute('class').split(' ')
    bombCreated = !isSnakeUnit(bombCell)
    if (bombCreated) {
      createNewUnit(bombCell, bombCellClasses, BOMBUNITNAME)
    }
  }
}

function changeDirection(event) {
  switch (event.keyCode) {
    case LEFT_ARROW:
      if (direction != 'x+') {
        direction = 'x-';
      }
      break;
    case UP_ARROW:
      if (direction != 'y-') {
        direction = 'y+';
      }
      break;
    case RIGHT_ARROW:
      if (direction != 'x-') {
        direction = 'x+';
      }
      break;
    case DOWN_ARROW:
      if (direction != 'y+') {
        direction = 'y-';
      }
      break;
  }
}

function finishTheGame() {
  gameIsRunning = false;
  clearInterval(snakeTimer)
  alert(`Вы проиграли! Ваш результат: ${score.toString()}`)
}

function refreshGame() {
  location.reload()
}

function scoreTable(score) {
  const scoreOutput = document.querySelector('#score')
  scoreOutput.textContent = `Счёт: ${score}`;
}

window.onload = init;
