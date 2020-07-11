const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const socket = io();

ctx.beginPath()

let pts = []
let first = true
let isMouseDown = false
let mouseUpFirst = false

window.onmousedown = () => isMouseDown = true
window.onmouseup = () => {
  isMouseDown = false
  mouseUpFirst = true
}

const sendData = () => {
  const str = JSON.stringify(pts)
  socket.emit('data', str)
}

socket.on('data', msg => {
  const data = JSON.parse(msg)
  let f = true
  data.forEach(d => {
    if (f) {
      f = false
      ctx.moveTo(d.x, d.y)
      return
    }
    ctx.lineTo(d.x, d.y)
  })
  ctx.stroke()
})

const startNewLine = () => {
  ctx.stroke()
  ctx.beginPath()
  sendData()
  pts = []
}

window.onmousemove = (e) => {
  if (!isMouseDown) {
    if (mouseUpFirst) {
      mouseUpFirst = false
      startNewLine()
    }
    return
  }

  const x = e.offsetX
  const y = e.offsetY

  if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
    startNewLine()
    return
  }

  pts.push({ x, y })

  if (first) {
    ctx.moveTo(x, y)
    first = false
    return
  }

  ctx.lineTo(x, y)
  ctx.stroke()
}