let duck
let enemies = []
let attackWaves = []
let duckImage
let myFont;

function addEnemy() {
  let directions = ['n', 'e', 's', 'w'];
  let choice = random(directions);
  let x = 50;
  let y = 50;
  switch (choice) {
    case 'n':
      y = 50;
      x = random(210, 290);
      break;
    case 'e':
      x = 450;
      y = random(210, 290);
      break;
    case 's':
      y = 450;
      x = random(210, 290);
      break;
    default:
      x = 50;
      y = random(210, 290);
  }
  enemies.push(new Enemy(x, y, choice))
}

function newAttackWave(x, y, direction) {
  let wave = new AttackWave(x, y, direction)
  attackWaves.push(wave)
}

function preload() {
  myFont = loadFont('assets/font/PressStart2P-Regular.ttf');
  duckImage = loadImage('assets/duck/duck_water.png')
}

function setup() {
  createCanvas(500, 500);
  imageMode(CENTER)
  ellipseMode(CENTER);
  noStroke()
  textFont(myFont);
  duck = new Duck(250, 250, 100, duckImage)
  addEnemy()
}

function draw() {
  background('#7CA5B8');

  duck.draw()

  for (let wave of attackWaves) {
    wave.draw()
    wave.move()

    for (let enemy of enemies) {
      enemy.contact(wave.x, wave.y);
    }
  }

  enemies = enemies.filter(e => !e.dead);
  enemies.forEach(enemy => {
    enemy.move()
    enemy.draw()
    duck.contact(enemy.x, enemy.y)
  });

  drawBath()
  drawStats(duck.health)
}

function drawBath() {
  // SINK
  fill('#D2D3DE')
  rect(0, 0, 500, 50);
  rect(0, 450, 500, 50);
  rect(0, 0, 50, 500);
  rect(450, 0, 50, 500);
  //TAP
  fill('#B4B5C1')
  rect(235, 0, 30, 100);
  circle(210, 15, 45);
  circle(290, 15, 45);
  // PLUG HOLE
  fill('#787987')
  circle(250, 145, 45);
  //ENTRANCE
  fill('#6B8AB1')
  rect(440, 200, 60, 100);
  rect(0, 200, 60, 100);
  rect(200, 440, 100, 60);
}

function drawStats(health) {
  textSize(30);
  fill(0);
  circle(20, 24, 30)
  text(health, 40, 35);
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      duck.moveLeft()
      break;
    case RIGHT_ARROW:
      duck.moveRight()
      break;
    case UP_ARROW:
      duck.moveUp()
      break;
    case DOWN_ARROW:
      duck.moveDown()
      break;
    case ENTER:
      console.log("enter");
      addEnemy();
      break;
  } 
  switch (key) {
    case " ":
      duck.attack()
      break;
    case "w":
      console.log("w");
      break;
    case "a":
      console.log("a");
      break;
    case "s":
      console.log("s");
      break;
    case "d":
      console.log("d");
      break;

  }
}