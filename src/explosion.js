export default class Explosion {
  constructor(missile, canvas, c){
    this.missile = missile
    this.canvas = canvas
    this.c = c
    this.radius = 5
    this.timer = 100
  }

  render(){
    if(this.timer > 0){
      this.timer = this.timer - 1
      this.radius = this.radius + 1
      this.c.beginPath();
      this.c.arc(this.missile.x, this.missile.y, this.radius, 0, 2 * Math.PI, false);
      this.c.fillStyle = 'red';
      this.c.fill();
    }
  }
}

