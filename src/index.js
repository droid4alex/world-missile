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
const imgLevel = document.getElementById("level-count-img");
const imgMissile = document.getElementById("missile-count-img");
const imgDisarmed = document.getElementById("disarmed-count-img");
const imgExploded = document.getElementById("exploded-count-img");
const imgScore = document.getElementById("score-count-img");
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

const numMissiles = 10;
let numMissilesIncrease = 0;
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
let animateCountNewMissileLaunch = 0;
let animateCountFrozen = 0;
let idleCount = 0;
let idleLogged = 0;
let idleArray = [];
let idleFps = 10;
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
    buttonAudio.src = "https://raw.githubusercontent.com/droid4alex/world-missile/main/src/music-on.PNG";
    disarmSound.volume = 0.5;
    explodedSound.volume = 0.5;
    musicTrack = musicTrack + 1;
    if (musicTrack >= TRACKS.length) {
      musicTrack = 0;
    }
    documentAudio.src = TRACKS[musicTrack];
    documentAudio.volume = 0.5;
    documentAudio.play();

  } else {
    buttonAudio.src = "https://raw.githubusercontent.com/droid4alex/world-missile/main/src/music-off.PNG";
    disarmSound.volume = 0.0;
    explodedSound.volume = 0.0;
    documentAudio.currentTime = 0;
    documentAudio.pause();
  }
});

imgLevel.addEventListener("click", () => {
  console.log("Level " + (levelCount + 1) + "!")
  startLevel()
});

imgMissile.addEventListener("click", () => {
  animateCountFrozen = 0;
  missiles.forEach(missile => {
    missile.freezeMissile();
  })
});

imgDisarmed.addEventListener("click", () => {
  let message = "";
  missiles.forEach(missile => {
    if(missile.slowed > 0){
      missile.increaseSpeed(-.5)
      missile.slowMissile()
      message = "All missiles slowed."
    }
  })
  if (message != ""){
    console.log(message)
  }
});

imgExploded.addEventListener("click", () => {
  let i = Math.floor(Math.random() * missiles.length)
  console.log(missiles[i].country.countryName + " exploded " + missiles[i].country.targetName)
  missiles[i].x = missiles[i].country.targetX
  missiles[i].y = missiles[i].country.targetY
});

imgScore.addEventListener("click", () => {
  let x = Math.floor(Math.random() * 20);
  for (let i = 0; i < 5 + x; i++) {
    generateMissile()
  }
  numMissilesIncrease = numMissilesIncrease + 5 + x;
  document.getElementById("missile-count").innerHTML = (numMissiles + levelCount + numMissilesIncrease);
  missiles.forEach(missile => {
    if (missile.slowed > 0) {
      missile.increaseSpeed(-.5)
      missile.slowMissile()
    }
  })
  console.log((5 + x) + " missiles generated. x" + (4 - missiles[0].slowed))
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
    }
  }
  if (!gameStarted && Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000) < 1.1) {
    requestAnimationFrame(animateIdle);
  }
}

function animate() {
  requestAnimationFrame(animate);
  animateCount = animateCount + 1;
  animateCountFrozen = animateCountFrozen + 1;
  animateCountNewMissileLaunch = animateCountNewMissileLaunch + 1;
  let frozen = false;
  c.clearRect(0, 0, canvas.width, canvas.height);
  timeStop = new Date();
  seconds = Math.abs((timeStart.getTime() - timeStop.getTime()) / 1000);
  missiles.forEach(missile => {
    missile.animateCount = missile.animateCount + 1
    missile.render();
    missile.fly();
    if (missile.frozen){
      frozen = true;
    }
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
  if (animateCountFrozen > 250 && frozen) {
    animateCountFrozen = 0;
    frozen = false;
    missiles.forEach(missile => {
      missile.freezeMissile()
    })
    console.log("Missiles unfrozen!")
  }
  if (animateCount > 125 && seconds > 5) {
    animateCount = 0;
    missiles.forEach(missile => {
      missile.increaseSpeed(.015)
    })    
  }
  if (animateCountNewMissileLaunch > 375 && seconds > 5) {
    animateCountNewMissileLaunch = 0;
    generateMissile()
    numMissilesIncrease = numMissilesIncrease + 1;
    document.getElementById("missile-count").innerHTML = (numMissiles + levelCount + numMissilesIncrease);
  }
  
  countryHit();
  checkVictory();
  checkLoss();
  showFps();
}

function generateMissile() {
  if (idleFps < 7){
    basespeed = 8 - idleFps;
  }
  let factor;
  if (levelCount < 10){
    factor = levelCount * .05;
  } else {
    factor = 9 * .05;
  }
  let xSpeed = Math.random() * (basespeed + factor);
  while (xSpeed > basespeed * 0.9 || xSpeed < basespeed*0.1){
    xSpeed = Math.random() * (1 + factor);
  }
  let ySpeed = (basespeed + factor) - xSpeed;
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
  if (levelCount >= 10) {
    numMissilesIncrease = numMissilesIncrease + 5 + Math.floor(Math.random() * 20);
  }
  document.getElementById("level-count").innerHTML = levelCount;
  document.getElementById("missile-count").innerHTML = (numMissiles + levelCount + numMissilesIncrease);
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
    for (let i = 0; i < (numMissiles + levelCount+ numMissilesIncrease); i++){
      generateMissile();
    }
  missiles.forEach(missile => {
    if (levelCount <= 10){
      missile.increaseSpeed(levelCount * (.06))
    }
    else {
      missile.increaseSpeed(-.5)
    }
  })
}

function checkVictory(){
  let message;
  let additionalMessage;
  switch (levelCount) {
    case 1:
      additionalMessage = " Click on header images for hacks!";
      break;
    case 2:
      additionalMessage = ".. Just warming up :) ";
      break;
    case 3:
      additionalMessage = ".. You lose if 10 missiles explode, btw. ";
      break;
    case 4:
      additionalMessage = ".. Number of missiles increasing! ";
      break;
    case 5:
      additionalMessage = ".. Keep it up! Halfway to level 10. ";
      break;
    case 6:
      additionalMessage = ".. Missile velocity is increasing! ";
      break;
    case 7:
      additionalMessage = ".. Try not to start any wildfires. ";
      break;
    case 8:
      additionalMessage = ".. Doing good, keep on saving lives.  ";
      break;
    case 9:
      additionalMessage = " ...Almost there! ";
      break;
    case 10:
      additionalMessage = "\nCONGRATS!!! YOU MADE IT. You are a top World Missile player! Thanks for playing! Visit my GitHub if you want (link at bottom left). \n\nFrom here on, things just get ridiculous. Hint: hack the game by clicking on the icons 'Level, Missiles, etc...' at the top.";
      break;      
    default:
      additionalMessage = "";
  }
  if (numMissiles + levelCount + numMissilesIncrease === disarmedCount + explodedCount) {
    if (explodedCount > 0){
      message = "Level " + levelCount + " complete." + additionalMessage + "\n\n" + disarmedCount + " missiles disarmed in " + seconds.toFixed(2) + " seconds.\n" + explodedCount + " missiles exploded:";
    } else {
      message = "Level " + levelCount + " complete." + additionalMessage + "\n\n" + disarmedCount + " missiles disarmed in " + seconds.toFixed(2) + " seconds." + "\nPerfect! ";
    }
    alert(message + countriesDestroyed);
    startLevel();
  }
}

function checkLoss(){
  let message;
  if (explodedCount === 10) {
    message = "Game Over! " + explodedCount + " missiles exploded.";
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
    numMissilesIncrease = 0;
    document.getElementById("score-count").innerHTML = scoreCount;
    startLevel();
  }
}

function countryHit() {
  let missilesRemaining = [];
  missiles.forEach(missile => {
    if(missile.country.inRange(missile.x, missile.y)){
      countriesDestroyed = countriesDestroyed + "\n• " + missile.country.countryName + " hit " + missile.country.targetName;
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
}

animateIdle();