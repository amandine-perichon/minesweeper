document.addEventListener('DOMContentLoaded', startGame)

var board = {
  cell: []
}

function startGame () {
  var boardCells = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < boardCells.length; i++) {
    addListeners(boardCells[i])
    addCellToBoard(boardCells[i])
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
  board.cell.push(newCell)
}

// Show content of a cell: white or bomb
function showCell (evt) {
  evt.target.classList.remove('hidden')
}

// Mark cell as a potential bomb
function markCell (evt) {
  evt.preventDefault()
  evt.target.classList.toggle('marked')
}

// Get row number of an element
function getRow (element) {
  var classes = element.classList
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].substring(0, 3) === 'row') {
      return classes[i].split('-')[1]
    }
  }
}

// Get column number of an element
function getCol (element) {
  var classes = element.classList
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].substring(0, 3) === 'col') {
      return classes[i].split('-')[1]
    }
  }
}

