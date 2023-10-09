import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, miAudio, canvas, context, scoreCont, scoreShow, boton } from './const.js'

let score = 0

let dropCounter = 0
let lastTime = 0
let dropInterval = 1000
let level = 1

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// Inicializar
boton.addEventListener('click', () => {
  boton.className = 'dontShow'
  canvas.classList.add('show')
  scoreShow.classList.add('show')
  if (miAudio.paused){
    miAudio.play()
    miAudio.volume = 0.25
  }else if (miAudio.ended) {
    miAudio.currentTime = 0;
    miAudio.play()
    miAudio.voluem = 0.25
  } 
  else {
    miAudio.pause()
    miAudio.currentTime = 0;
    miAudio.play()
    miAudio.voluem = 0.25
  }
  iniciarJuego()
})

// iniciar JUEGO

function iniciarJuego() {
  // 3. Board

  const board = createBoard(BOARD_HEIGHT, BOARD_WIDTH)
  function createBoard(height, width) {
    return Array(height).fill().map(() => Array(width).fill(0))
  }

  // 4. pieza player

  const piece = {
    position: {x:5, y:5},
    shape: [
      [1,1],
      [1,1]
    ],
    color: 'orange'
  }

  const PIECES = [
    [
      [1,1],
      [1,1]
    ],
    [
      [1,1,1,1]
    ],
    [
      [0,1,0],  //  [1,0]
      [1,1,1]   //  [1,1]
    ],          //  [1,0]
    [
      [1,1,0],
      [0,1,1]
    ],
    [
      [1,0],
      [1,0],
      [1,1]
    ]
  ]


  function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time
    dropCounter += deltaTime

    if (score >= 100 *level || level % 2 == 0) {
      level++
      dropInterval -= 100
    }

    scoreCont.innerText = score

    if (dropCounter > dropInterval) {
      piece.position.y++
      dropCounter = 0

      if (checkCollision()) {
        piece.position.y--
        solidifyPiece()
        removeRows()
      }
    }

    draw()
    window.requestAnimationFrame(update)
  }

  function draw() {
    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value == 1) {
          context.fillStyle = 'yellow'
          context.fillRect(x, y, 1, 1)
        }
      })
    })

    piece.shape.forEach((row, y) => {
      row.forEach((value, x) =>{
        if (value == 1){
          context.fillStyle = piece.color
          context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)

        }
      })
    })


  }

  document.addEventListener('keydown', event => {
    if (event.key == 'ArrowLeft') {
      piece.position.x--
      if (checkCollision()) {
        piece.position.x++
      }
    } 
    if (event.key == 'ArrowRight') {
      piece.position.x++
      if (checkCollision()) {
        piece.position.x--
      }
    } 
    if (event.key == 'ArrowDown') {
      piece.position.y++
      if (checkCollision()) {
        piece.position.y--
        solidifyPiece()
        removeRows()
      }
    }
    if (event.key == 'ArrowUp'){
      const rotated = []

      for (let i = 0; i < piece.shape[0].length; i++){
        const row = []
        for (let j = piece.shape.length -1; j >= 0; j--){
          row.push(piece.shape[j][i])
        }
        rotated.push(row)
      }
      const previous = piece.shape
      piece.shape = rotated
      if (checkCollision()) {
        piece.position.x = piece.position.x - piece.shape[0].length +1
      }

    }
  })  

  function checkCollision() {
    return piece.shape.find((row, y) =>{
      return row.find((value, x) =>{
        return (
          value !== 0 &&
          board[y + piece.position.y]?.[x + piece.position.x] !== 0
        )
      })
    })
  }

  function solidifyPiece() {
    piece.shape.forEach((row, y) =>{
      row.forEach((value, x) => {
        if (value == 1) {
          board[y + piece.position.y][x + piece.position.x] = 1
        }
      })
    })
    piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
    if (piece.shape == PIECES[0]){
      piece.color = 'orange'
    }
    else if (piece.shape == PIECES[1]){
      piece.color = 'blue'
    }
    else if (piece.shape == PIECES[2]){
      piece.color = 'green'
    }
    else if (piece.shape == PIECES[3]){
      piece.color = 'red'
    }
    else if (piece.shape == PIECES[4]){
      piece.color = 'pink'
    }
    piece.position.x = Math.floor(Math.random() * BOARD_WIDTH)
    if ((piece.position.x - piece.shape[0].length) < 0){
      piece.position.x = 0
    }
    if ((piece.position.x + piece.shape[0].length) > 14){
      piece.position.x = 14 - piece.shape[0].length
    }
    piece.position.y = 0
    // game over
    if (checkCollision()){
      window.alert('Game Over!! Sorry')
      board.forEach((row) => row.fill(0))
      score = 0
    }
  }

  function removeRows() {
    const rowsToRemove = []

    board.forEach((row, y) =>{
      if (row.every(value => value == 1)) {
        rowsToRemove.push(y)
        console.log("ahi va una")
      }
    })
    rowsToRemove.forEach(y => {
      board.splice(y, 1)
      const newRow = Array(BOARD_WIDTH).fill(0)
      board.unshift(newRow)
      score += 10
    })

  }
  update()

}




