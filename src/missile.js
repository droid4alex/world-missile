
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
    this.img = document.getElementById("missile");    
    this.radians = 0
    this.angle = 0
    this.disarmed = false
    this.exploded = false
    this.animateCount = 0
  }

  render() {
    this.radians = Math.atan2(this.speed.y, this.speed.x);
    this.angle = 180 * this.radians / Math.PI;
    this.c.translate(this.x, this.y);
    this.c.rotate(Math.PI / 180 * (this.angle + 90));
    this.c.translate(-this.x, -this.y);
    this.c.drawImage(this.img, this.x - 10, this.y - 15, 20, 30);
    this.c.setTransform(1, 0, 0, 1, 0, 0);
    if (this.hovered) {
      this.c.beginPath();
      this.c.arc(this.x, this.y, 60, 5, 5 * Math.PI);
      this.c.strokeStyle = "gray";
      this.c.stroke();
    }
  }

  increaseSpeed(percent) {
    // if (this.speed.x > this.speed.y){
    //   this.speed.x = this.speed.x + (this.speed.x * percent)
    // } else {
    //   this.speed.y = this.speed.y + (this.speed.y * percent)
    // }
    this.speed.x = this.speed.x + (this.speed.x * percent)
    this.speed.y = this.speed.y + (this.speed.y * percent)
  }

  changeDirection(){
    let max = Math.abs(this.speed.x) + Math.abs(this.speed.y)
    let xSpeed = Math.random() * (max);
    while (xSpeed > 0.9 || xSpeed < 0.1) {
      xSpeed = Math.random() * (max);
    }
    let ySpeed = (max) - xSpeed;
    while (ySpeed > 0.9 || ySpeed < 0.1) {
      ySpeed = Math.random() * (max);
    }
    if ((Math.random() * 2) >= 1) {
      xSpeed = xSpeed * -1;
    }
    if ((Math.random() * 2) >= 1) {
      ySpeed = ySpeed * -1;
    }
    this.speed.x = xSpeed;
    this.speed.y = ySpeed;
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
    this.exploded = true;
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
    this.disarmed = true;
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

