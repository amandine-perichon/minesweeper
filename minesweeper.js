document.addEventListener('DOMContentLoaded', startGame)

function startGame () {
  addListeners(document.getElementsByClassName('board')[0].children)
}

// Add event listener click on all elements of the board
function addListeners (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', showCell)
    elements[i].addEventListener('contextmenu', markCell)
  }
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

