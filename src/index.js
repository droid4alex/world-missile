import Unit from './unit'
import Missile from './missile'

const canvas = document.getElementsByTagName("canvas")[0];
const c = canvas.getContext('2d');
const level = document.getElementById("level-count");
const intercepted = document.getElementById("intercepted-count");
const score = document.getElementById("score-count");
var levelCount = 0;
var interceptedCount = 0;
var scoreCount = 0;

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.90;

c.fillStyle = "gray";
c.fillRect(0, 0, canvas.width, canvas.height);

// const unitImage = new Image();
// unitImage.src = './src/unit.png'
// c.drawImage(unitImage, 50, 50);

const unit1 = new Unit(25, 25, 25, "brown", canvas, c);
const unit2 = new Unit(25, canvas.height - 25, 25, "brown", canvas, c);
const unit3 = new Unit(canvas.width - 25, 25, 25, "brown", canvas, c);
const unit4 = new Unit(canvas.width - 25, canvas.height - 25, 25, "brown", canvas, c);
unit1.render();
unit2.render();
unit3.render();
unit4.render();
const missile1 = new Missile(25, 25, 100, 2, "red", 0, canvas, c);
const missile2 = new Missile(25, canvas.height - 25, 100, 2, "red", 0, canvas, c);
const missile3 = new Missile(canvas.width - 125, 25, 100, 2, "red", 0, canvas, c);
const missile4 = new Missile(canvas.width - 125, canvas.height - 25, 100, 2, "red", 0, canvas, c);
missile1.render();
missile2.render();
missile3.render();
missile4.render();

canvas.addEventListener('click', (e) => {
  let x = e.clientX;
  let y = e.clientY;
  interceptedCount = interceptedCount + 1/4;
  intercepted.innerHTML = "Missiles Intercepted: " + interceptedCount;
  scoreCount = scoreCount + 1;
  score.innerHTML = "Score: " + scoreCount;
  levelCount = Math.floor(scoreCount / 10);
  level.innerHTML = "Level: " + levelCount;
})

// canvas.addEventListener('mousemove', () => {
//   const cRect = canvas.getBoundingClientRect(); 
//   console.log(cRect)
// })

