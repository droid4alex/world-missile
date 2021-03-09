export default class Country {
  constructor(countryName, x, y, targetName, targetX, targetY, canvas){
    this.countryName = countryName
    this.x = x * canvas.width
    this.y = y * canvas.height
    this.targetName = targetName
    this.targetX = targetX * canvas.width
    this.targetY = targetY * canvas.height
    // this.canvas = canvas
    // this.c = c
    this.radius = 5
  }

  inRange(x, y){
    if (Math.abs(x - this.targetX) <= 50 && Math.abs(y - this.targetY) <= 50){
      return true
    }else
    {
      return false
    }
  }
}

