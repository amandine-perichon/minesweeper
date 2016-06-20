document.addEventListener('DOMContentLoaded', startGame)

var board = {
  cells: []
}

function startGame () {
  var boardCells = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < boardCells.length; i++) {
    addListeners(boardCells[i])
    addCellToBoard(boardCells[i])
  }

  for (var i = 0; i < board.cells.length; i++) {
      board.cells[i].surroundingMines = countSurroundingMines(board.cells[i])
  }
}

// Add event listener click on all elements of the board
function addListeners (element) {
  element.addEventListener('click', showCell)
  element.addEventListener('contextmenu', markCell)
}

// Add cell data to board object
function addCellToBoard (element) {
  var newCell = {}
  newCell.row = getRow(element)
  newCell.col = getCol(element)
  newCell.isMine = element.classList.contains('mine')
  board.cells.push(newCell)
}

// Show content of a cell: white or bomb
function showCell (evt) {
  evt.target.classList.remove('hidden')
  if (evt.target.classList.contains('mine')) {
    showAllMines()
    window.alert('You lose')
  } else {
    showSurrounding(evt.target)
  }

  // Check if user has won
  if (checkForWin()) {
    window.alert('You won')
  }
}

// Mark cell as a potential bomb
function markCell (evt) {
  evt.preventDefault()
  evt.target.classList.toggle('marked')
  evt.target.classList.toggle('hidden')
  elementToCell(evt.target).isMarked = true

 // Check if user has won
  if (checkForWin()) {
    window.alert('You won')
  }
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

function checkForWin () {
  // Check that all cells that all bombs have been marked
  // and there are no marked cells that are not bombs
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
  for (var i = 0; i < boardCells.length; i++) {
    if (boardCells[i].classList.contains('hidden')) {
      result = false
      break
    }
  }
  return result
}

function showAllMines () {
  var boardCells = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < boardCells.length; i++) {
    if (boardCells[i].classList.contains('mine')) {
      boardCells[i].classList.remove('marked')
      boardCells[i].classList.remove('hidden')
    }
  }
}

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