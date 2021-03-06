export default class Unit {
  constructor(x, y, radius, color, canvas, c){
    this.x = x
    this.y = y 
    this.radius = radius
    this.color = color
    this.canvas = canvas
    this.c = c

    console.log("Unit instance constructed")
  }

  render(){
    this.c.beginPath()
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.c.fillStyle = this.color
    this.c.fill()
  }
}

