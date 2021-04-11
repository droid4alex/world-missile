export default class Country {
  constructor(countryName, x, y, targetName, targetX, targetY, targetSize, canvas){
    this.countryName = countryName
    this.x = x
    this.y = y
    this.targetName = targetName
    this.targetX = targetX * canvas.width
    this.targetY = targetY * canvas.height
    this.targetSize = targetSize
    // this.canvas = canvas
    // this.c = c
    this.radius = 5
  }

  inRange(x, y){
    if (Math.abs(x - this.targetX) <= this.targetSize && Math.abs(y - this.targetY) <= this.targetSize){
      return true
    }else
    {
      return false
    }
  }

  inCircleRange(x, y) {
    if (Math.abs(x - this.targetX) <= this.targetSize * 3 && Math.abs(y - this.targetY) <= this.targetSize*3) {
      return true
    } else {
      return false
    }
  }
}

