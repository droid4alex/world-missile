export default class Missile {
  constructor(x, y, width, height, color, speed, canvas, c) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color  
    this.speed = speed
    this.canvas = canvas
    this.c = c

    console.log("Missile instance constructed")
  }

  render() {
    this.c.beginPath()
    this.c.rect(this.x, this.y, this.width, this.height)
    this.c.fillStyle = this.color
    this.c.fill()
  }
}

