var fieldSizeX = 20
var fieldSizeY = 20
var snakeSpeed = 200
var snake = []
var direction = 'y+'
var gameIsRunning = false
var snakeTimer
var foodTimer
var score = 0
var bombTime = 2000
var bombs = []

function init() {
  prepareGameField () // generating a field
  document.getElementById('snake-start').addEventListener('click', starGame)
  document.getElementById('snake-renew').addEventListener('click', refreshGame)
  addEventListener('keydown', changeDirection)


}

// function generating a field

function prepareGameField() {
  // creating a table
  var gameTable = document.createElement('table')
  gameTable.classList.add('game-table')

  // generating rows and cells
  for(var i = 0; i < fieldSizeX; i++) {
    // generating rows
    var row = document.createElement('tr')
    row.className = 'game-table-row row-' + i
    for(var j = 0; j < fieldSizeY; j++) {
      // generating cells
      var cell = document.createElement('td')
      cell.className = 'game-table-cell cell-' + i + '-' + j
      row.appendChild(cell) // add cell
    }
    gameTable.appendChild(row) // add row
  }
  document.getElementById('snake-field').appendChild(gameTable) // add table
}

// function start game

function starGame() {
  gameIsRunning = true
  respaw() // creating a snake
  snakeTimer = setInterval(move, snakeSpeed) // every 200 ms run function move
  setTimeout(createFood, 5000)
  setInterval(createBomb, bombTime)
}

// function creating a snake

function respaw() {
  // snake is array td
  // start length snake = 2

  // respawn snake in center
  var startCoordX = parseInt(fieldSizeX / 2)
  var startCoordY = parseInt(fieldSizeY / 2)

  //snake's head
  var snakeHead = document.querySelector('.cell-' + startCoordY + '-' + startCoordX)
  snakeHead.setAttribute('class', snakeHead.getAttribute('class') + ' snake-unit')
  // snake's tail
  var snakeTail = document.getElementsByClassName('cell-' + (startCoordY - 1) + '-' + startCoordX)[0]
  snakeTail.setAttribute('class', snakeTail.getAttribute('class') + ' snake-unit')
  snake.push(snakeHead)
  snake.push(snakeTail)
}

//movment of the snake

function move() {
   // building classes
   var snakeHeadClasses = snake[snake.length - 1].getAttribute('class').split(' ')

   // head shift
   var newUnit = snake
   console.log(newUnit)
   var snakeCoords = snakeHeadClasses[1].split('-')
   var coordY = parseInt(snakeCoords[1])
   var coordX = parseInt(snakeCoords[2])

   // defining a new point
  if(direction == 'x-') {
    newUnit = document.getElementsByClassName('cell-' + coordY + '-' + (coordX - 1))[0]
  }
  else if (direction == 'x+') {
    newUnit = document.getElementsByClassName('cell-' + coordY + '-' + (coordX + 1))[0]
  }
  else if (direction == 'y+') {
    newUnit = document.getElementsByClassName('cell-' + (coordY - 1) + '-' + coordX)[0]
  }
  else if (direction == 'y-') {
    newUnit = document.getElementsByClassName('cell-' + (coordY + 1) + '-' + coordX)[0]
  }
  //checks
  // 1. newUnit not a part of snake
  // 2. snake did't go abroad
  if(!isSnakeUnit(newUnit) && newUnit !== undefined && !isBomb(newUnit)) {
    newUnit.setAttribute('class', newUnit.getAttribute('class') + ' snake-unit')
    snake.push(newUnit)

    // check remove tail
    if(!haveFood(newUnit)) {
      // find the tail
      var removed = snake.splice(0, 1)[0]
      var classes = removed.getAttribute('class').split(' ')

      // remove tail
      removed.setAttribute('class', classes[0] + ' ' + classes[1])
    }
  }
  else {
    finishTheGame()
  }
}

// cheking for an intersection

function isSnakeUnit(unit) {
  var check = false
  if(snake.includes(unit)) { // if cell in the snake it means intersection
    check = true
  }
  return check
}

function isBomb(unit) {
  var check = false
  var unitClasses = unit.getAttribute('class').split(' ')

  if(unitClasses.includes('bomb-unit')){
    check = true
  }
  return check
}

// checking for a food

function haveFood(unit) {
  var check = false
  var unitClasses = unit.getAttribute('class').split(' ')

  // if food
  if(unitClasses.includes('food-unit')){
    check = true
    createFood()
    score++
    scoreTable(score)
  }
  return check
}

function createFood() {
  var foodCreated = false
  while (!foodCreated) {
    var foodX = parseInt(Math.random() * fieldSizeX)
    var foodY = parseInt(Math.random() * fieldSizeY)

    var foodCell = document.getElementsByClassName('cell-' + foodY + '-' + foodX)[0]
    var foodCellClasses = foodCell.getAttribute('class').split(' ')

    // cheking for a snake
    if(!foodCellClasses.includes('snake-unit')) {
      var classes = ''
      for (var i = 0; i < foodCellClasses.length; i++) {
        classes += foodCellClasses[i] + ' '
      }
      foodCell.setAttribute('class', classes + 'food-unit')
      foodCreated = true
    }
  }
}

function createBomb() {
  var bombCreated = false;
  while(!bombCreated){
    var bombX = parseInt(Math.random() * fieldSizeX)
    var bombY = parseInt(Math.random() * fieldSizeY)
    var bombCell = document.querySelector('.cell-' + bombY + '-' + bombX)
    var bombCellClasses = bombCell.getAttribute('class').split(' ')
    if(!bombCellClasses.includes('snake-unit')) {
      var classes = ''
      for(var i = 0; i < bombCellClasses.length; i++) {
        classes += bombCellClasses[i] + ' '
      }
      bombCell.setAttribute('class', classes + 'bomb-unit')
      bombCreated = true
    }
  }
}

function changeDirection(event) {

  switch(event.keyCode) {
    case 37: // left
      if(direction != 'x+') {
        direction = 'x-'
      }
      break
    case 38: // up
      if(direction != 'y-') {
        direction = 'y+'
      }
      break
    case 39: //  right
      if(direction != 'x-'){
        direction = 'x+'
      }
      break
    case 40: // down
      if(direction != 'y+'){
        direction = 'y-'
      }
    break
  }
}

function finishTheGame() {
  gameIsRunning = false
  clearInterval(snakeTimer)
  alert('Вы проиграли! Ваш результат: ' + score.toString())
}

function refreshGame() {
  location.reload()
}

function scoreTable(score) {
  var scoreOutput = document.querySelector('#score')
    scoreOutput.textContent = 'Счёт: ' + score
}

window.onload = init
