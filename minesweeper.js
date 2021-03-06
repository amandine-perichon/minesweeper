// Create global variables
var board = {
  cells: []
}

var userBoardSize

// When DOM content is loaded, initialize the page
document.addEventListener('DOMContentLoaded', function () {
  // Add event listeners to buttons
  var buttons = document.getElementsByClassName('sizes')[0].children
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (evt) {
      userBoardSize = evt.target.classList[0]
      resetGame()
    })
  }

  // By default start game with board size small
  userBoardSize = 'small'
  // Start the game
  startGame()
})

// Generate the board and add event listeners to the board cells to start the game
function startGame () {
  // Generate board
  generateBoard(userBoardSize)

  // Add event listeners
  // Tried using forEach here but boardCells is a nodeList, not an array
  var boardCells = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < boardCells.length; i++) {
    addListeners(boardCells[i])
  }
}

// Add event listeners to one Node element
// left click -> shows cell content
// right click -> mark cell as a mine
function addListeners (element) {
  element.addEventListener('click', showCell)
  element.addEventListener('contextmenu', markCell)
}

// Show content of a cell
function showCell (evt) {
  // unhide content of the cell
  evt.target.classList.remove('hidden')

  // if cell is a mine, show all mines, display You lose msg, and reset game
  // if cell is not a mine, show the content of surrounding cells
  if (evt.target.classList.contains('mine')) {
    showAllMines()
    window.alert('You lose')
    resetGame()
  } else {
    showSurrounding(evt.target)
  }
  // Check if user has won, if so, display You won msg and reset game
  checkForWin()
}

// Mark cell as a potential mine
function markCell (evt) {
  evt.preventDefault()
  evt.target.classList.toggle('marked')
  // Remove hidden otherwise prevent checkForWin from working correctly
  evt.target.classList.toggle('hidden')
  // Set cell property isMarked in board object to true
  // !! isMarked needs to be remove if unmarked
  var cell = elementToCell(evt.target)
  if (!cell.hasOwnProperty('isMarked')) {
    cell.isMarked = true
  } else {
    delete cell.isMarked
  }
  // Check if user has won
  checkForWin()
}

// Get row number of an element
function getRow (element) {
  var classes = element.classList
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].substring(0, 3) === 'row') {
      return Number(classes[i].split('-')[1])
    }
  }
}

// Get column number of an element
function getCol (element) {
  var classes = element.classList
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].substring(0, 3) === 'col') {
      return Number(classes[i].split('-')[1])
    }
  }
}

// Count mines for a given cell from the board
function countSurroundingMines (cell) {
  var surroundingCells = getSurroundingCells(cell.row, cell.col)
  var count = 0
  for (var i = 0; i < surroundingCells.length; i++) {
    if (surroundingCells[i].isMine) {
      count++
    }
  }
  return count
}

// Check if user has won the game
function checkForWin () {
  // Check that that all mines have been marked
  // and there are no marked cells that are not mines
  // and there is no hidden cell left
  var result = true
  for (var i = 0; i < board.cells.length; i++) {
    if ((board.cells[i].isMine === false && board.cells[i].isMarked === true) ||
     (board.cells[i].isMine === true && board.cells[i].isMarked === undefined)) {
      result = false
      break
    }
  }
  var boardCells = document.getElementsByClassName('board')[0].children
  for (var j = 0; j < boardCells.length; j++) {
    if (boardCells[j].classList.contains('hidden')) {
      result = false
      break
    }
  }
  // if user has won, display 'You won' msg, and reset game
  if (result) {
    document.getElementById('applause').play()
    window.alert('You won')
    resetGame()
  }
}

// Unhide all mines on the board
function showAllMines () {
  var boardCells = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < boardCells.length; i++) {
    if (boardCells[i].classList.contains('mine')) {
      boardCells[i].classList.remove('marked')
      boardCells[i].classList.remove('hidden')
    }
  }
  document.getElementById('bomb').play()
}

// Return cell from board object based on Node element
function elementToCell (element) {
  for (var i = 0; i < board.cells.length; i++) {
    var cell
    if (board.cells[i].row === getRow(element) &&
    board.cells[i].col === getCol(element)) {
      cell = board.cells[i]
      break
    }
  }
  return cell
}

// Reset the game - board size in the last one chosen by the user
function resetGame () {
  // Reset HTML - board div should be empty and size removed
  var boardNode = document.getElementsByClassName('board')[0]
  boardNode.innerHTML = ''
  boardNode.classList.remove('small', 'medium', 'large')

  // board object is reset, and will be rebuild when startGame is called
  board = {
    cells: []
  }

  // Start game again
  startGame()
}

// Generate the board object and HTML board
function generateBoard (sizeClass) {
  switch (sizeClass) {
    case 'small':
      board.size = 5
      break
    case 'medium':
      board.size = 6
      break
    case 'large':
      board.size = 7
      break
  }

  // Add cells to board with the row and col parameters
  for (i = 0; i < board.size; i++) {
    for (var j = 0; j < board.size; j++) {
      var cell = {}
      cell.row = i
      cell.col = j
      board.cells.push(cell)
    }
  }

  // Generate mines coordinates randomly
  // number of mines equal size of the board
  var mines = []
  while (mines.length < board.size) {
    var mine = {}
    mine.row = getRandomIntInclusive(0, board.size - 1)
    mine.col = getRandomIntInclusive(0, board.size - 1)
    // check if mine already included in mines
    var mineDuplicate = false
    mines.forEach(function (m) {
      if (m.row === mine.row && m.col === mine.col) {
        mineDuplicate = true
      }
    })
    if (!mineDuplicate) {
      mines.push(mine)
    }
  }

  // Include mine flag in board
  // set isMine = true if included in mines
  // trying Array.prototype.forEach
  board.cells.forEach(function (cell) {
    mines.forEach(function (mine) {
      if (cell.row === mine.row && cell.col === mine. col) {
        cell.isMine = true
      }
    })
    if (!cell.hasOwnProperty('isMine')) {
      cell.isMine = false
    }
  })

  // Count surrounding mines
  for (var i = 0; i < board.cells.length; i++) {
    board.cells[i].surroundingMines = countSurroundingMines(board.cells[i])
  }

  // Create board in HTML based on board object
  // Each div should have row-x col-y hidden
  var boardNode = document.getElementsByClassName('board')[0]
  boardNode.classList.add(sizeClass)
  board.cells.forEach(function (cell) {
    var div = document.createElement('div')
    div.classList.add('row-' + cell.row, 'col-' + cell.col, 'hidden')
    if (cell.isMine) {
      div.classList.add('mine')
    }
    boardNode.appendChild(div)
  })
}

// From MDN:
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

