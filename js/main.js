let duck
let enemies = []
let attackWaves = []
let duckImage
let powerups = []
let myFont;
let enemySpriteSheet;
let sound;
let lastPowerupSpawnTime = 0;
let powerupSpawnInterval = 8000;

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
  enemies.push(new Enemy(x, y, choice, enemySpriteSheet))
}

function newAttackWave(x, y, direction) {
  let waves = []
   if (direction === 'all') {
    waves.push(new AttackWave(x, y, 'up'))
    waves.push(new AttackWave(x, y, 'down'))
    waves.push(new AttackWave(x, y, 'left'))
    waves.push(new AttackWave(x, y, 'right'))
  } else {
    waves.push(new AttackWave(x, y, direction))
  }
  attackWaves.push(...waves)
}

function preload() {
  myFont = loadFont('assets/font/PressStart2P-Regular.ttf');
  duckImage = loadImage('assets/duck/duck_water.png');
  enemySpriteSheet = loadImage('assets/enemy/enemy_spritesheet.png');
  sound = loadSound('/assets/songs/English Beat - Mirror In the Bathroom Remaster.mp3');
}

function setup() {
  createCanvas(500, 500);
  imageMode(CENTER)
  ellipseMode(CENTER);
  noStroke()
  textFont(myFont);
  duck = new Duck(250, 250, 100, duckImage)
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  sound.amp(0.2);
}

function draw() {
  background('#7CA5B8');
  drawLakeRipples();
  // PLUG HOLE
  fill('#787987')
  circle(250, 145, 45);

  if (millis() - lastPowerupSpawnTime > powerupSpawnInterval && powerups.length < 2) {
    powerups.push(spawnRandomPowerup(random(80, 420), random(80, 420)));
    lastPowerupSpawnTime = millis();
    // Randomize next interval between 6–12 seconds so it feels less predictable
    powerupSpawnInterval = random(6000, 12000);
  }
  powerups.forEach(powerup => {
      powerup.draw()
      duck.collidePowerup(powerup)
  });
  powerups = powerups.filter(p => p.active);

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
  drawStats(duck.health, duck.activePowerup)
}

function drawBath() {
  //TAP
  fill('#B4B5C1')
  rect(235, 0, 30, 100);
  circle(210, 15, 45);
  circle(290, 15, 45);
  // SINK
  fill('#D2D3DE')
  rect(0, 0, 500, 50);
  rect(0, 450, 500, 50);
  rect(0, 0, 50, 500);
  rect(450, 0, 50, 500);
  //ENTRANCE
  fill('#6B8AB1')
  rect(440, 200, 60, 100);
  rect(0, 200, 60, 100);
  rect(200, 440, 100, 60);
}

function drawLakeRipples() {
  let level = amplitude.getLevel();
  level *= 5; // boost small values
  let lakeRadius = 300;
  let size = map(level, 0, 1, 0, lakeRadius * 2);

  noFill();
  strokeWeight(3);

  // outer ripple
  stroke('#88B0C3')
  ellipse(width/2, height/2, size, size);
  // middle ripple
  stroke('#95BACB')
  ellipse(width/2, height/2, size*0.75, size*0.75);
  // inner ripple
  stroke('#A9C7D6');
  ellipse(width/2, height/2, size*0.5, size*0.5);
  
  noStroke();
}

function drawStats(health, activePowerup) {
  textSize(30);
  if (activePowerup && activePowerup === "Shield") {
    fill(0, 0, 255);
  } else {
    fill(0);
  }
  circle(20, 24, 30)
  text(health, 40, 35);
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
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
    case BACKSPACE:
      console.log("backspace");
      powerups.push(spawnRandomPowerup(random(50, 400), random(50, 400)))
      break;
  } 
  switch (key) {
    case " ":
      this.direction = duck.direction
      duck.attack()
      break;
    case "w":
      console.log("w");
      duck.attack("up")
      break;
    case "a":
      console.log("a");
      duck.attack("left")
      break;
    case "s":
      console.log("s");
      duck.attack("down")
      break;
    case "d":
      console.log("d");
      duck.attack("right")
      break;
    case "p":
      togglePlay();
      break;
  }
}