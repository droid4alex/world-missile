import Country from './country';
import Missile from './missile'

const COUNTRIES = [{ countryName: 'Canada', x: 0.13, y: 0.23 }, { countryName: 'United States', x: 0.15, y: 0.38 }, { countryName: 'Brazil', x: 0.30, y: 0.73 }, { countryName: 'Africa', x: 0.56, y: 0.56 }, { countryName: 'Russia', x: 0.80, y: 0.24 }, { countryName: 'China', x: 0.85, y: 0.45 }]
const TRACKS = ["https://github.com/droid4alex/world-missile/blob/main/src/01_below_the_asteroids.mp3?raw=true",
               "https://github.com/droid4alex/world-missile/blob/main/src/02_tomorrows_neverending_yesterday.mp3?raw=true",
                "https://github.com/droid4alex/world-missile/blob/main/src/03_i_saw_your_ship.mp3?raw=true",
                "https://github.com/droid4alex/world-missile/blob/main/src/04_gallentean_refuge.mp3?raw=true"]
const canvas = document.getElementsByTagName("canvas")[0];
const c = canvas.getContext('2d');
const buttonAudio = document.getElementById("buttonAudio");
const documentAudio = document.querySelector("audio");
documentAudio.volume = 0.5;

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
let musicTrack = 0;

let disarmSound = new Audio("https://raw.githubusercontent.com/droid4alex/world-missile/main/src/disarm.mp3");
disarmSound.volume = 0.5;

let explodedSound = new Audio("https://raw.githubusercontent.com/droid4alex/world-missile/main/src/explosion.mp3");
explodedSound.volume = 0.5;

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
    if (Math.abs(mouseX - missile.x) <= 60 && Math.abs(mouseY - missile.y) <= 60) {
      disarms.push(missile);
      disarmedCount = disarmedCount + 1;
      document.getElementById("disarmed-count").innerHTML = disarmedCount;
      timeStop = new Date();
      let seconds = Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000);
      scoreCount = scoreCount + 100;
      if (Math.floor(seconds) < 15) {
        scoreCount = scoreCount + 100;
      }
      document.getElementById("score-count").innerHTML = scoreCount;
    }
    else {
      missilesRemaining.push(missile);
    }
  })
  missiles = missilesRemaining;  
})

canvas.addEventListener('mousemove', (e) => {
  let mouseX = e.pageX - canvas.offsetLeft;
  let mouseY = e.pageY - canvas.offsetTop;
  if (missiles.length > 0){
    missiles.forEach(missile => {
      if (Math.abs(mouseX - missile.x) <= 100 && Math.abs(mouseY - missile.y) <= 100) {
        if (missile.animateCount > 600) {
          missile.animateCount = 0;
          missile.changeDirection();
        }
      }
      if (Math.abs(mouseX - missile.x) <= 50 && Math.abs(mouseY - missile.y) <= 50){
        missile.targetOn();
      } else{
        missile.targetOff();
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
    missile.animateCount = missile.animateCount + 1
    missile.render();
    missile.fly();
  })
  disarms.forEach(missile => {
    if (missile.disarmed === false) {
      disarmSound.currentTime = 0;
      disarmSound.play();
    }
    missile.renderDisarm();
  })
  explosions.forEach(missile => {
    if (missile.exploded === false) {
      explodedSound.currentTime = 0;
      explodedSound.play();
    }
    missile.renderExplosion();
  })
  timeStop = new Date();
  let seconds = Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000);
  if (animateCount > 100 && seconds > 5) {
    animateCount = 0;
    missiles.forEach(missile => {
      missile.increaseSpeed(levelCount * .01)
    })
  }
  
  countryHit();
  checkVictory();
  checkLoss();
}

function generateMissile(color) {
  let factor = levelCount * .5;
  let xSpeed = Math.random() * (1 + factor);
  while (xSpeed > 0.9 || xSpeed < 0.1){
    xSpeed = Math.random() * (1 + factor);
  }
  let ySpeed = (1 + factor) - xSpeed;
  while (ySpeed > 0.9 || ySpeed < 0.1) {
    ySpeed = Math.random() * (1 + factor);
  }
  if ((Math.random() * 2) >= 1) {
    xSpeed = xSpeed * -1;
  }
  if ((Math.random() * 2) >= 1) {
    ySpeed = ySpeed * -1;
  }
  let random = Math.floor(Math.random() * 5);
  missiles.push(
    new Missile(targets[random], COUNTRIES[random].x, COUNTRIES[random].y, 10, 10, color, { x: xSpeed, y: ySpeed }, canvas, c)
  )
}

function startLevel(){
  disarmedCount = 0;
  document.getElementById("disarmed-count").innerHTML = disarmedCount;
  disarmedCount = 0;
  explodedCount = 0;
  document.getElementById("exploded-count").innerHTML = explodedCount;
  missiles = [];
  disarms = [];
  explosions = [];
  targets = [];
  animateCount = 0;
  countriesDestroyed = "";
  timeStart = new Date();
  levelCount = levelCount + 1;
  document.getElementById("level-count").innerHTML = levelCount;
  document.getElementById("missile-count").innerHTML = (numMissiles + levelCount * 3);
  let random = Math.floor(Math.random() * 5);
  for (let i = 0; i < COUNTRIES.length; i++) {
    random = Math.floor(Math.random() * 5);
    while (random === i){
      random = Math.floor(Math.random() * 5);
    } 
    targets.push(
      new Country(COUNTRIES[i].countryName, COUNTRIES[i].y, COUNTRIES[i].y, COUNTRIES[random].countryName, COUNTRIES[random].x, COUNTRIES[random].y, canvas)
      )
    }
  let color = "red";
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
      message = "Level " + levelCount + " complete. " + disarmedCount + " missiles disarmed. \n" + explodedCount + " missiles exploded:";
    } else {
      message = "Perfect! Level " + levelCount + " complete. " + disarmedCount + " missiles disarmed in " + seconds.toFixed(2) + " seconds.";
    }
    alert(message + countriesDestroyed);
    startLevel();
  }
}

function checkLoss(){
  let message;
  if (explodedCount === 6) {
    timeStop = new Date();
    message = "Game Over!";
    alert(message + countriesDestroyed);    
    documentAudio.currentTime = 0;
    musicTrack = musicTrack + 1;
    if (musicTrack > TRACKS.length){
      musicTrack = 0;
    }
    documentAudio.src = TRACKS[musicTrack];
    documentAudio.play();
    levelCount = 0;
    scoreCount = 0;
    document.getElementById("score-count").innerHTML = scoreCount;
    startLevel();
  }
}

function countryHit() {
  let missilesRemaining = [];
  missiles.forEach(missile => {
    if(missile.country.inRange(missile.x, missile.y)){
      countriesDestroyed = countriesDestroyed + "\n" + missile.country.countryName + " hit " + missile.country.targetName;
      explodedCount = explodedCount + 1;
      document.getElementById("exploded-count").innerHTML = explodedCount;
      if (scoreCount - 300 >= 0){
        scoreCount = scoreCount - 300;
        document.getElementById("score-count").innerHTML = scoreCount;
      } else if (scoreCount > 0){
        scoreCount = 0;
        document.getElementById("score-count").innerHTML = scoreCount;
      }
      explosions.push(missile);
    } else{
      missilesRemaining.push(missile);
    }
  })
  missiles = missilesRemaining;
}


