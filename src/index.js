import Country from './country';
import Missile from './missile'

const COUNTRIES = [{ countryName: 'Canada', x: 0.13, y: 0.23 }, { countryName: 'United States', x: 0.15, y: 0.38 }, { countryName: 'Brazil', x: 0.30, y: 0.73 }, { countryName: 'Africa', x: 0.56, y: 0.56 }, { countryName: 'Russia', x: 0.80, y: 0.24 }, { countryName: 'China', x: 0.85, y: 0.45 }]
const COLORS = ["Crimson ", "Red", "Orange", "Tomato", "OrangeRed", "Coral"]
const canvas = document.getElementsByTagName("canvas")[0];
const c = canvas.getContext('2d');
const level = document.getElementById("level-count");
const missileCount = document.getElementById("missile-count");
const disarmed = document.getElementById("disarmed-count");
const exploded = document.getElementById("exploded-count");
const score = document.getElementById("score-count");
const buttonAudio = document.getElementById("buttonAudio");
const documentAudio = document.querySelector("audio");
documentAudio.volume = 0.5;

// canvas.width = window.innerWidth * 0.93;
// canvas.height = window.innerHeight * 0.89;

canvas.width = window.innerWidth - (document.getElementById("header").offsetHeight * 2) - document.getElementById("footer").offsetHeight;
canvas.height = window.innerHeight - (document.getElementById("header").offsetHeight * 2) - document.getElementById("footer").offsetHeight;

const numMissiles = 2;
let timeStart = new Date()
let timeStop = new Date();
let levelCount = 0;
let disarmedCount = 0;
let explodedCount = 0;
let scoreCount = 0;
let missiles = [];
let disarms = [];
let explosions = [];
let targets = [];
let animateCount = 0;
let countriesDestroyed = "";
let gameStarted = false;
let disarmSound = new Audio("https://raw.githubusercontent.com/droid4alex/world-missile/main/src/disarm.mp3");
disarmSound.volume = 0.5;

let img = document.getElementById("world-map");
img.width = canvas.width;
img.height = canvas.height;

let imgIntro = document.getElementById("world-map-intro");
imgIntro.width = canvas.width;
imgIntro.height = canvas.height;
imgIntro.onload = function () {
  c.drawImage(imgIntro, 0, 0, canvas.width, canvas.height);
  }
c.drawImage(imgIntro, 0, 0, canvas.width, canvas.height);

function startGame() {
  document.getElementById("canvas").style.cursor = "crosshair";
  startLevel();
  animate();
  documentAudio.play();
}

canvas.addEventListener('click', (e) => {
  if (!gameStarted){
    gameStarted = true;
    startGame();
  }
  let missilesRemaining = [];
  let mouseX = e.pageX - canvas.offsetLeft;
  let mouseY = e.pageY - canvas.offsetTop;
  missiles.forEach(missile => {
    if (Math.abs(mouseX - missile.x) <= 50 && Math.abs(mouseY - missile.y) <= 50) {
      disarms.push(missile)
      disarmedCount = disarmedCount + 1;
      disarmed.innerHTML = "Disarmed: " + disarmedCount;
      timeStop = new Date();
      let seconds = Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000);
      scoreCount = scoreCount + 100;
      if (Math.floor(seconds) < 15) {
        scoreCount = scoreCount + 100;
      }
      score.innerHTML = "Score: " + scoreCount;
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
})

buttonAudio.addEventListener("click", () => {
  if (documentAudio.paused) {
    documentAudio.volume = 0.5;
    documentAudio.play();

  } else {
    documentAudio.currentTime = 0;
    documentAudio.pause();
  }
});

function animate() {
  animateCount = animateCount + 1;
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(img, 0, 0, canvas.width, canvas.height);
  missiles.forEach(missile => {
    missile.render()
    missile.fly()
  })
  disarms.forEach(missile => {
    if (missile.played === false) {
      disarmSound.currentTime = 0;
      disarmSound.pause();
      disarmSound.play();
    }
    missile.renderDisarm()
  })
  explosions.forEach(explosion => {
    explosion.renderExplosion()
  })
  timeStop = new Date();
  let seconds = Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000);
  if (animateCount > 50 && seconds > 10) {
    animateCount = 0;
    missiles.forEach(missile => {
      // missile.increaseSpeed(0.5)
      missile.changeDirection()
    })
  }
  countryHit()
  checkVictory()
  checkLoss()
}

function generateMissile(color) {
  let random = Math.floor(Math.random() * 5);
  let factor = levelCount * .1;
  let xSpeed = Math.random() * (2 + factor);
  while (xSpeed > 1.9 || xSpeed < 0.1){
    xSpeed = Math.random() * (2 + factor);
  }
  let ySpeed = (2 + factor) - xSpeed;
  if ((Math.random() * 2) >= 1) {
    xSpeed = xSpeed * -1;
  }
  if ((Math.random() * 2) >= 1) {
    ySpeed = ySpeed * -1;
  }
  missiles.push(
    new Missile(targets[random], COUNTRIES[random].x, COUNTRIES[random].y, 10, 10, color, { x: xSpeed, y: ySpeed }, canvas, c)
  )
}

function startLevel(){
  disarmedCount = 0;
  disarmed.innerHTML = "Disarmed: " + disarmedCount;
  disarmedCount = 0;
  explodedCount = 0;
  exploded.innerHTML = "Exploded: " + explodedCount;
  missiles = [];
  disarms = [];
  explosions = [];
  targets = [];
  animateCount = 0;
  countriesDestroyed = "";
  timeStart = new Date();
  levelCount = levelCount + 1;
  level.innerHTML = "Level: " + levelCount;
  missileCount.innerHTML = "Missiles: " + (numMissiles + levelCount * 3);
  let random = Math.floor(Math.random() * 5);
  let color = COLORS[random];
  for (let i = 0; i < COUNTRIES.length; i++) {
    random = Math.floor(Math.random() * 5);
    while (random === i){
      random = Math.floor(Math.random() * 5);
    } 
    targets.push(
      new Country(COUNTRIES[i].countryName, COUNTRIES[i].y, COUNTRIES[i].y, COUNTRIES[random].countryName, COUNTRIES[random].x, COUNTRIES[random].y, canvas)
      )
  }
  for (let i = 0; i < (numMissiles + levelCount*3); i++){
    generateMissile(color);    
  }
}

function checkVictory(){
  let message;
  if (numMissiles + levelCount*3 === disarmedCount + explodedCount) {
    timeStop = new Date();
    let seconds = Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000);
    if (explodedCount > 0){
      message = "Level " + levelCount + " complete. " + disarmedCount + " missiles disarmed. \n" + explodedCount + " missiles exploded:"
    } else {
      message = "Perfect! Level " + levelCount + " complete. " + disarmedCount + " missiles disarmed in " + seconds.toFixed(2) + " seconds."
    }
    alert(message + countriesDestroyed)
    startLevel()
  }
}

function checkLoss(){
  let message;
  if (explodedCount === 6) {
    timeStop = new Date();
    message = "Game Over!"
    alert(message + countriesDestroyed)
    documentAudio.currentTime = 0;
    levelCount = 0;
    scoreCount = 0;
    score.innerHTML = "Score: " + scoreCount;
    startLevel()
  }
}

function countryHit() {
  let missilesRemaining = [];
  missiles.forEach(missile => {
    if(missile.country.inRange(missile.x, missile.y)){
      countriesDestroyed = countriesDestroyed + "\n" + missile.country.countryName + " hit " + missile.country.targetName;
      explodedCount = explodedCount + 1;
      exploded.innerHTML = "Exploded: " + explodedCount;
      if (scoreCount - 300 >= 0){
        scoreCount = scoreCount - 300;
        score.innerHTML = "Score: " + scoreCount;
      } else if (scoreCount > 0){
        scoreCount = 0;
        score.innerHTML = "Score: " + scoreCount;
      }
      explosions.push(missile)
    } else{
      missilesRemaining.push(missile)
    }
  })
  missiles = missilesRemaining;
}


