
export default class Missile {
  constructor(country, x, y, width, height, color, speed, canvas, c) {
    this.country = country
    this.x = x
    this.y = y
    this.width = width * speed.x
    this.height = height * speed.y
    this.color = color  
    this.speed = speed
    this.canvas = canvas
    this.c = c
    this.targeted = false
  }


  render() {
    this.c.beginPath()
    this.c.rect(this.x, this.y, this.width, this.height)
    // this.c.arc(this.x, this.y, this.width, 7, 7 * Math.PI, false);
    this.c.fillStyle = this.color
    this.c.fill()
    if (this.targeted) {
      this.c.beginPath();
      this.c.arc(this.x, this.y, 50, 5, 5 * Math.PI);
      this.c.strokeStyle = "gray";
      this.c.stroke();
    }
  }

  fly(){
    this.x = this.x + this.speed.x
    this.y = this.y + this.speed.y
    if (this.x < 0){
      this.x = this.canvas.width
    }
    if (this.x > this.canvas.width) {
      this.x = 0
    }
    if (this.y < 0) {
      this.y = this.canvas.height
    }
    if (this.y > this.canvas.height) {
      this.y = 0
    }
  }

  targetOn(){
    this.targeted = true;
  }

  targetOff() {
    this.targeted = false;
  }
}

