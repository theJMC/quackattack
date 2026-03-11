let duck
let enemies = []
let attackWaves = []
let duckImage
let powerups = []
let myFont;
let enemySpriteSheet;
let lastPowerupSpawnTime = 0;
let powerupSpawnInterval = 8000;
let gameState = "menu"; // "menu", "playing", "gameover"
let songPaths = [
  '/assets/songs/English Beat - Mirror In the Bathroom Remaster.mp3',
  '/assets/songs/Bubble Pop Electric Remastered 2019.mp3',
  '/assets/songs/Sabrina Carpenter - Tears.mp3'
];
let songNames = [
  'Mirror In the Bathroom',
  'Bubble Pop Electric',
  'Tears'
];
let songspawnInterval = [
  60000 / 86,
  60000 / 113,
  60000 / 194
]
let songs = [];
let selectedSongIndex = 0;
let lastSpawnTime = 0;
let classifier;
// Teachable Machine model URL:
let soundModel = './my_model/'; //TODO TOM UPDATE

function addEnemy(direction) {
  let x = 50;
  let y = 50;
  switch (direction) {
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
  // 20% change to set direction to duck
  if (random() < 0.2) {
    direction = "duck";
  }
  enemies.push(new Enemy(x, y, direction, enemySpriteSheet))
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
  classifier = ml5.soundClassifier(soundModel + 'model.json');
  enemySpriteSheet = loadImage('assets/enemy/enemy_spritesheet.png');
  for (let path of songPaths) {
    songs.push(loadSound(path));
  }
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
  peakDetect = new p5.PeakDetect(20, 20000, 0.15, 20);
  classifier.classify(gotResult);
}

function draw() {
  if (gameState === "menu") {
    drawStartMenu();
  } else if (gameState === "playing") {
    drawGame();
  }
  else if (gameState === "gameover") {
    drawGameOver();
  }
  else if (gameState === "win") {
    drawWinScreen();
  }
}

function startGame() {
  gameState = "playing";
  duck = new Duck(250, 250, 100, duckImage);
  enemies = [];
  attackWaves = [];
  powerups = [];
  lastPowerupSpawnTime = millis();

  // Stop any currently playing song and play the selected one
  for (let s of songs) {
    s.stop();
  }
  sound = songs[selectedSongIndex];
  sound.amp(0.2);
  sound.play();
  sound.onended(() => {
    if (gameState === "playing") {
      gameState = "win";
    }
  });
}
function continueGame() {
  gameState = "playing";
  enemies = [];
  attackWaves = [];
  powerups = [];
  lastPowerupSpawnTime = millis();

  // Stop any currently playing song and play the selected one
  for (let s of songs) {
    s.stop();
  }
  sound = songs[selectedSongIndex];
  sound.amp(0.2);
  sound.play();
  sound.onended(() => {
    if (gameState === "playing") {
      gameState = "win";
    }
  });
}

function drawStartMenu() {
  background('#7CA5B8');

  // Title
  fill('#D2D3DE');
  textSize(32);
  textAlign(CENTER, CENTER);
  text("QUACK", width / 2, height / 2 - 120);
  text("ATTACK", width / 2, height / 2 - 80);

  // Duck image
  if (duckImage) {
    image(duckImage, width / 2, height / 2 - 30, 64, 64);
  }

  // Song selection
  textSize(10);
  fill(200);
  text("SELECT A SONG", width / 2, height / 2 + 30);

  for (let i = 0; i < songNames.length; i++) {
    if (i === selectedSongIndex) {
      fill(255, 255, 0);
      text("> " + songNames[i] + " <", width / 2, height / 2 + 60 + i * 25);
    } else {
      fill(200);
      text(songNames[i], width / 2, height / 2 + 60 + i * 25);
    }
  }

  // Controls hint
  textSize(8);
  fill(180);
  text("UP/DOWN TO SELECT", width / 2, height / 2 + 155);

  // Start prompt (blinking)
  if (frameCount % 60 < 40) {
    fill(255);
    textSize(14);
    text("PRESS ENTER TO START", width / 2, height / 2 + 180);
  }

  textAlign(LEFT, BASELINE);
}

function drawGame() {
  background('#7CA5B8');
  drawLakeRipples();
  // PLUG HOLE
  fill('#787987')
  circle(250, 145, 45);

  powerups.forEach(powerup => {
      powerup.draw()
      duck.collidePowerup(powerup)
  });
  powerups = powerups.filter(p => p.active);

  duck.draw()
  duckX = duck.x;
  duckY = duck.y;

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
    duck.contact(enemy.x, enemy.y, enemy)
  });

  drawBath()
  drawStats(duck.health, duck.activePowerup)
  soundToEnemy()
  soundToPowerup()
}

function drawBath() {
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
  //TAP
  fill('#B4B5C1')
  rect(235, 0, 30, 100);
  circle(210, 15, 45);
  circle(290, 15, 45);
}

function drawLakeRipples() {
  let level = amplitude.getLevel();
  level *= 2; // boost small values
  let lakeRadius = 300;
  let size = map(level, 0, 1, 0, lakeRadius * 2);

  noFill();
  strokeWeight(3);

  // outer ripple
  stroke('#88B0C3')
  circle(250, 145, size);
  // middle ripple
  stroke('#95BACB')
  circle(250, 145, size*0.75);
  // inner ripple
  stroke('#A9C7D6');
  circle(250, 145, size*0.5);
  
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

function resetGame() {
  sound.stop();
  duck = new Duck(250, 250, 100, duckImage);
  enemies = [];
  attackWaves = [];
  powerups = [];
  lastPowerupSpawnTime = 0;
  powerupSpawnInterval = 8000;
  gameState = "menu";
  lastSpawnTime = 0;
  // Reset song selection if you want to start from the first song
  selectedSongIndex = 0;
  // If you use these elsewhere, reset them too:
  // fft, amplitude, peakDetect will be re-initialized in setup()
  // No need to reset duckImage, enemySpriteSheet, myFont, songs, songPaths, songNames, bpm, spawnInterval
}

function drawGameOver() {
  background('#222');
  fill('#fff');
  textAlign(CENTER, CENTER);
  textSize(32);
  text("GAME OVER", width / 2, height / 2 - 40);
  textSize(16);
  text("Press ENTER to try again", width / 2, height / 2 + 20);
  textAlign(LEFT, BASELINE);
  sound.stop();
}

function drawWinScreen() {
  sound.stop();
  background('#86c88c');
  fill('#fff');
  textAlign(CENTER, CENTER);
  textSize(32);
  text("YOU WIN!", width / 2, height / 2 - 60);

  textSize(14);
  fill(250);
  text("SELECT A NEW SONG", width / 2, height / 2);

  for (let i = 0; i < songNames.length; i++) {
    if (i === selectedSongIndex) {
      fill(255, 255, 0);
      text("> " + songNames[i] + " <", width / 2, height / 2 + 30 + i * 25);
    } else {
      fill(250);
      text(songNames[i], width / 2, height / 2 + 30 + i * 25);
    }
  }

  fill(200);
  textSize(12);
  text("UP/DOWN TO SELECT", width / 2, height / 2 + 120);
  text("ENTER TO CONTINUE", width / 2, height / 2 + 140);
  text("M TO RETURN TO MENU", width / 2, height / 2 + 160);

  textAlign(LEFT, BASELINE);
}

function soundToPowerup() {  
  peakDetect.update(fft);
  
  if (peakDetect.isDetected) {
    powerups.push(spawnRandomPowerup(random(80, 420), random(80, 420)));
  }
}

function soundToEnemy() {
  let currentTime = millis();

  // Only spawn if enough time has passed according to BPM
  if ((currentTime - lastSpawnTime) > songspawnInterval[selectedSongIndex]) {
    fft.analyze();
    let bass = fft.getEnergy("bass");
    let lowMid = fft.getEnergy("lowMid");
    let highMid = fft.getEnergy("highMid");
    let treble = fft.getEnergy("treble");

    if (treble > 150) addEnemy('n');
    else if (highMid > 150) addEnemy('w');
    else if (lowMid > 150) addEnemy('e');
    else if (bass > 150) addEnemy('s');
    lastSpawnTime = currentTime;  // reset spawn timer
  }
}

function keyPressed() {
   if (gameState === "menu") {
    if (keyCode === UP_ARROW) {
      selectedSongIndex = (selectedSongIndex - 1 + songNames.length) % songNames.length;
    } else if (keyCode === DOWN_ARROW) {
      selectedSongIndex = (selectedSongIndex + 1) % songNames.length;
    } else if (keyCode === ENTER) {
      startGame();
    }
    return;
  }
  else if (gameState === "gameover") {
    if (keyCode === ENTER) {
      noTint();
      resetGame();
      gameState = "menu";
    }
    return;
  }
  else if (gameState === "win") {
    if (keyCode === UP_ARROW) {
      selectedSongIndex = (selectedSongIndex - 1 + songNames.length) % songNames.length;
    } else if (keyCode === DOWN_ARROW) {
      selectedSongIndex = (selectedSongIndex + 1) % songNames.length;
    } else if (keyCode === ENTER) {
      continueGame(); // Continue with new song
    } else if (keyCode === 'M'.charCodeAt(0)) {
      resetGame(); // Back to menu
      gameState = "menu";
    }
    return;
  }

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
      let directions = ['n', 'e', 's', 'w'];
      let choice = random(directions);
      addEnemy(choice);
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

let label = 'listening...';
// The model recognizing a sound will trigger this event
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  console.log(label)
}