
export default class Missile {
  constructor(country, x, y, width, height, color, speed, canvas, c) {
    this.country = country
    this.x = x * canvas.width
    this.y = y * canvas.height
    this.width = width * speed.x
    this.height = height * speed.y
    this.color = color  
    this.speed = speed
    this.canvas = canvas
    this.c = c
    this.hovered = false
    this.radius = 5
    this.timer = 100
    this.img = new Image
    this.played = false
  }


  render() {
    this.c.beginPath()
    this.c.rect(this.x, this.y, this.width, this.height)
    // this.c.arc(this.x, this.y, this.width, 7, 7 * Math.PI, false);
    this.c.fillStyle = this.color
    this.c.fill()

    if (this.hovered) {
      this.c.beginPath();
      this.c.arc(this.x, this.y, 50, 5, 5 * Math.PI);
      this.c.strokeStyle = "gray";
      this.c.stroke();
    }
    // this.img.src = 'https://raw.githubusercontent.com/droid4alex/world-missile/main/src/missile.png';
    // c.drawImage(this.img, this.x, this.y);
  }

  increaseSpeed(percent) {
    if (this.speed.x > this.speed.y){
      this.speed.x = this.speed.x + (this.speed.x * percent)
    } else {
      this.speed.y = this.speed.y + (this.speed.y * percent)
    }
  }

  changeDirection(){
    this.speed.x = this.speed.x + (Math.random() * 0.1)
    this.speed.y = this.speed.y + (Math.random() * 0.1)
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
    this.hovered = true;
  }

  targetOff() {
    this.hovered = false;
  }

  renderExplosion() {
    if (this.timer > 0) {
      this.timer = this.timer - 1
      this.radius = this.radius + 1
      this.c.beginPath();
      this.c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      this.c.fillStyle = 'red';
      this.c.fill();
    }
  }

  renderDisarm() {
    this.played = true;
    if (this.timer > 0) {
      this.timer = this.timer - 3
      this.radius = this.radius + 2
      this.c.beginPath();
      this.c.arc(this.x, this.y, 75 - this.radius, 0, 2 * Math.PI, false);
      this.c.fillStyle = 'white';
      this.c.fill();
    }
  }
}

