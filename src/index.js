import Country from './country';
import Missile from './missile'

const COUNTRIES = [{ countryName: 'Canada', x: 0.13, y: 0.23, quandrant: 2 }, { countryName: 'United States', x: 0.15, y: 0.38, quandrant: 2 }, { countryName: 'Brazil', x: 0.30, y: 0.73, quandrant: 3 }, { countryName: 'Africa', x: 0.56, y: 0.56, quandrant: 4 }, { countryName: 'Russia', x: 0.80, y: 0.24, quandrant: 1 }, { countryName: 'China', x: 0.85, y: 0.45, quandrant: 1 }]
const TRACKS = ["https://github.com/droid4alex/world-missile/blob/main/src/01_below_the_asteroids.mp3?raw=true",
               "https://github.com/droid4alex/world-missile/blob/main/src/02_tomorrows_neverending_yesterday.mp3?raw=true",
                "https://github.com/droid4alex/world-missile/blob/main/src/03_i_saw_your_ship.mp3?raw=true",
                "https://github.com/droid4alex/world-missile/blob/main/src/04_gallentean_refuge.mp3?raw=true"]
const canvas = document.getElementsByTagName("canvas")[0];
const c = canvas.getContext('2d');
const canvasDiv = document.getElementById("canvas-div");
const img = document.getElementById("world-map");
const buttonAudio = document.getElementById("buttonAudio");
const documentAudio = document.querySelector("audio");
const disarmSound = new Audio("https://raw.githubusercontent.com/droid4alex/world-missile/main/src/disarm.mp3");
const explodedSound = new Audio("https://raw.githubusercontent.com/droid4alex/world-missile/main/src/explosion.mp3");
documentAudio.volume = 0.5;
disarmSound.volume = 0.5;
explodedSound.volume = 0.5;

window.onresize = function () { location.reload(); }
canvas.width = window.innerWidth - (document.getElementById("header").offsetHeight * 2) - document.getElementById("footer").offsetHeight;
canvas.height = window.innerHeight - (document.getElementById("header").offsetHeight * 2) - document.getElementById("footer").offsetHeight;

let targetSize = canvas.width * 0.07;
if (targetSize < canvas.height * 0.09){
  targetSize = canvas.height * 0.09;
}
if (targetSize > 70){
  targetSize = 70;
}

let missileWidth = canvas.width * 0.03;
if (missileWidth < 15){
  missileWidth = 15;
}
if (missileWidth > 30) {
  missileWidth = 30;
}
let missileHeight = canvas.height * 0.1;
if (missileHeight < 30){
  missileHeight = 30
}
if (missileHeight > 60) {
  missileHeight = 60
}

const numMissiles = 7;
let timeStart = new Date();
let timeStop = new Date();
let seconds = 0;
let levelCount = 0;
let disarmedCount = 0;
let explodedCount = 0;
let scoreCount = 0;
let missiles = [];
let disarms = [];
let explosions = [];
let targets = [];
let animateCount = 0;
let idleCount = 0;
let idleLogged = 0;
let idleArray = [];
let idleFps = 0;
let countriesDestroyed = "";
let gameStarted = false;
let musicTrack = 0;
let framesCount = 0;
let avgFps = [];
let basespeed = 1;

function startGame() {
  canvasDiv.style.backgroundImage = "url(" + img.src + ")";
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
    if (Math.abs(mouseX - missile.x) <= targetSize && Math.abs(mouseY - missile.y) <= targetSize) {
      disarms.push(missile);
      disarmedCount = disarmedCount + 1;
      document.getElementById("disarmed-count").innerHTML = disarmedCount;
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
      if (Math.abs(mouseX - missile.x) <= targetSize && Math.abs(mouseY - missile.y) <= targetSize) {
        if (missile.animateCount > 6000) {
          missile.animateCount = 0;
          missile.changeDirection();
        }
      }
      if (Math.abs(mouseX - missile.x) <= targetSize && Math.abs(mouseY - missile.y) <= targetSize){
        missile.targetOn();
      } else{
        missile.targetOff();
      }
    })
  }
})

buttonAudio.addEventListener("click", () => {
  if (documentAudio.paused) {
    musicTrack = musicTrack + 1;
    if (musicTrack >= TRACKS.length) {
      musicTrack = 0;
    }
    documentAudio.src = TRACKS[musicTrack];
    documentAudio.volume = 0.5;
    documentAudio.play();

  } else {
    documentAudio.currentTime = 0;
    documentAudio.pause();
  }
});

function animateIdle() {
  timeStop = new Date();
  idleCount = idleCount + 1;  
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillRect(0, 0, 1+Math.random() * 5, 1+Math.random()*5)
  if (Math.abs((timeStart.getTime() - timeStop.getTime()) / 100) > idleLogged) {
    idleLogged = idleLogged + 1;
    if (idleLogged > 1) {
      idleArray.push(idleCount)
      idleCount = 0;
      idleFps = idleArray.reduce((acc, el) => acc + el, 0) / idleArray.length;
      console.log(idleFps);
    }
  }
  if (!gameStarted && Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000) < 1.1) {
    requestAnimationFrame(animateIdle);
  }
}

function animate() {
  requestAnimationFrame(animate);
  animateCount = animateCount + 1;
  c.clearRect(0, 0, canvas.width, canvas.height);
  timeStop = new Date();
  seconds = Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000);
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
  if (animateCount > 50 && seconds > 5) {
    animateCount = 0;
    missiles.forEach(missile => {
      missile.increaseSpeed(.01)
    })
  }  
  countryHit();
  checkVictory();
  checkLoss();
  showFps();
}

function generateMissile() {
  console.log(idleFps);
  let factor = levelCount * basespeed * .05;
  let xSpeed = Math.random() * (basespeed + factor);
  while (xSpeed > basespeed * 0.9 || xSpeed < basespeed*0.1){
    xSpeed = Math.random() * (1 + factor);
  }
  let ySpeed = (basespeed + factor) - xSpeed;
  console.log("xSpeed " + xSpeed)
  console.log("ySpeed " + ySpeed)
  if ((Math.random() * 2) >= 1) {
    xSpeed = xSpeed * -1;
  }
  if ((Math.random() * 2) >= 1) {
    ySpeed = ySpeed * -1;
  }
  let random = Math.floor(Math.random() * 5);
  missiles.push(
    new Missile(targets[random], targets[random].x, targets[random].y, missileWidth, missileHeight, targetSize, { x: xSpeed, y: ySpeed }, canvas, c)
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
  framesCount = 0;
  avgFps = [];
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
    let startX = 0;
    let startY = 0;
    switch (COUNTRIES[random].quandrant) {
      case 1:
        startX = 0 + (Math.random() * canvas.width * .33);
        startY = canvas.height - (Math.random() * canvas.height * .33);
        break;
      case 2:
        startX = canvas.width - (Math.random() * canvas.width * .33);
        startY = canvas.height - (Math.random() * canvas.height * .33);
        break;
      case 3:
        startX = canvas.width - (Math.random() * canvas.width * .33);
        startY = 0 + (Math.random() * canvas.height * .33);
        break;
      case 4:
        startX = 0 + (Math.random() * canvas.width * .33);
        startY = 0 + (Math.random() * canvas.height * .33);
        break;
    }
    targets.push(
      new Country(COUNTRIES[i].countryName, startX, startY, COUNTRIES[random].countryName, COUNTRIES[random].x, COUNTRIES[random].y, targetSize, canvas)
      )
    }
    for (let i = 0; i < (numMissiles + levelCount*3); i++){
      generateMissile();
    }
}

function checkVictory(){
  let message;
  if (numMissiles + levelCount*3 === disarmedCount + explodedCount) {
    if (explodedCount > 0){
      message = "Level " + levelCount + " complete.\n" + disarmedCount + " missiles disarmed in " + seconds.toFixed(2) + " seconds.\n" + explodedCount + " missiles exploded.\n";
    } else {
      message = "Perfect! Level " + levelCount + " complete.\n" + disarmedCount + " missiles disarmed in " + seconds.toFixed(2) + " seconds.\n";
    }
    alert(message + countriesDestroyed);
    startLevel();
  }
}

function checkLoss(){
  let message;
  if (explodedCount === 10) {
    message = "Game Over! " + explodedCount + " missiles exploded.\n";
    alert(message + countriesDestroyed);    
    documentAudio.currentTime = 0;
    musicTrack = musicTrack + 1;
    if (musicTrack >= TRACKS.length){
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
      if (missile.country.inCircleRange(missile.x, missile.y)){
        missile.circleOn();
      } else {
        missile.circleOff();
      }
    }
  })
  missiles = missilesRemaining;
}

function showFps(){
  framesCount = framesCount + 1;
  if (avgFps.length < seconds - 1){
    avgFps.push(framesCount)
    framesCount = 0
  }
  if (seconds > 1){
    document.getElementById("fps").innerHTML = "Frames Per Second: " + (avgFps[avgFps.length - 1]);
    document.getElementById("fps-avg").innerHTML = "&nbspAverage: " + (avgFps.reduce((acc, el) => acc + el, 0) / avgFps.length).toFixed(1);
  }
  if (seconds > 2 && basespeed === 1) {
    basespeed = basespeed + 20 / avgFps.reduce((acc, el) => acc + el, 0) / avgFps.length;
    console.log("Basespeed updated to: " + basespeed)
  }
}

animateIdle();