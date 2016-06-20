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
  showSurrounding(evt.target)
}

// Mark cell as a potential bomb
function markCell (evt) {
  evt.preventDefault()
  evt.target.classList.toggle('marked')
  evt.target.classList.toggle('hidden')

  for (var i = 0; i < board.cells.length; i++) {
    if (board.cells[i].row === getRow(evt.target) &&
    board.cells[i].col === getCol(evt.target)) {
      board.cells[i].isMarked = true
      break
    }
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

