import Explosion from './explosion';
import Missile from './missile'

const COUNTRIES = [{ country: 'Canada', x: 0.13, y: 0.23 }, { country: 'United States', x: 0.15, y: 0.38 }, { country: 'Mexico', x: 0.15, y: 0.50 }, { country: 'Brazil', x: 0.30, y: 0.73 }, { country: 'European Union', x: 0.53, y: 0.32 }, { country: 'Africa', x: 0.56, y: 0.56 }, { country: 'Russia', x: 0.80, y: 0.24 }, { country: 'China', x: 0.85, y: 0.45 }, { country: 'India', x: 0.75, y: 0.48 }, { country: 'Australia', x: 0.96, y: 0.84 }]
const COLORS = ["Crimson ", "Green", "Red", "Orange", "LimeGreen", "Salmon", "Tomato", "Lime", "OrangeRed", "Coral"]
const canvas = document.getElementsByTagName("canvas")[0];
const c = canvas.getContext('2d');
const level = document.getElementById("level-count");
const intercepted = document.getElementById("intercepted-count");
const score = document.getElementById("score-count");

let timeStart = new Date()
let timeStop = new Date();
let levelCount = 0;
let interceptedCount = 0;
let scoreCount = 0;
let missiles = [];
let explosions = [];

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.90;
let img = new Image;
img.onload = function () {
  c.drawImage(img, 0, 0, canvas.width, canvas.height);
}

img.width = canvas.width;
img.height = canvas.height;
img.src = 'https://github.com/droid4alex/world-missile/blob/main/src/world-map.png?raw=true';

function generateMissile(color){
  let random = Math.floor(Math.random() * 10);
  let xSpeed = Math.random() * 2;
  let ySpeed = 2 - xSpeed;
  if ((Math.random() * 2) >= 1) {
    xSpeed = xSpeed * -1;
  }
  if ((Math.random() * 2) >= 1) {
    ySpeed = ySpeed * -1;
  }
  missiles.push(
    new Missile(COUNTRIES[random].country, canvas.width * COUNTRIES[random].x, canvas.height * COUNTRIES[random].y, 10, 10, color, { x: xSpeed, y: ySpeed}, canvas, c)
  )
}

function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(img, 0, 0, canvas.width, canvas.height);
  missiles.forEach(missile => {
    missile.render()
    missile.fly()
  })
  explosions.forEach(explosion => {
    explosion.render()
  })
  timeStop = new Date();
  if (Math.floor(Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000)>59)){
    alert("You lost! All missiles must be intercepted within 60 seconds.")
    levelCount = levelCount - 1;
    startLevel()
  }
}

canvas.addEventListener('click', (e) => {
  let missilesRemaining = [];
  let mouseX = e.pageX - canvas.offsetLeft;
  let mouseY = e.pageY - canvas.offsetTop;
  missiles.forEach(missile => {
    if (Math.abs(mouseX - missile.x) <= 50 && Math.abs(mouseY - missile.y) <= 50) {
      explosions.push(new Explosion(missile, canvas, c))
      interceptedCount = interceptedCount + 1;
      intercepted.innerHTML = "Missiles Intercepted: " + interceptedCount + " of " + levelCount*5;
    }
    else {
      missilesRemaining.push(missile)
    }
  })
  missiles = missilesRemaining;  
})

canvas.addEventListener('mousemove', (e) => {
  let mouseX = e.pageX - canvas.offsetLeft;
  let mouseY = e.pageY - canvas.offsetTop;
  if (missiles.length > 0){
    missiles.forEach(missile => {
      if (Math.abs(mouseX - missile.x) <= 50 && Math.abs(mouseY - missile.y) <= 50){
        missile.targetOn()
      } else{
        missile.targetOff()
      }
    })
  }
  if (interceptedCount === levelCount * 5){
    timeStop = new Date();
    let seconds = Math.abs((timeStart.getTime() - timeStop.getTime())/1000);
    scoreCount = scoreCount + 100;
    if (Math.floor(seconds)<15){
      scoreCount = scoreCount + (1500 - Math.floor(seconds)*100);
    }
    score.innerHTML = "Score: " + scoreCount;
    alert("Great job! You beat level " + levelCount + " in " + seconds.toFixed(2) + " seconds!")
    startLevel()
  }
})

function startLevel(){
  interceptedCount = 0;
  intercepted.innerHTML = "Missiles Intercepted: " + interceptedCount;
  missiles = [];
  explosions = [];
  timeStart = new Date();
  levelCount = levelCount + 1;
  level.innerHTML = "Level: " + levelCount;
  let random = Math.floor(Math.random() * 10);
  let color = COLORS[random];
  for (let i = 0; i < (5*levelCount); i++){
    generateMissile(color);    
  }
}

startLevel();
animate();
