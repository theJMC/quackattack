class Duck {
  constructor(x, y, h, duckImage, direction="left", activePowerup = null, move_speed=10, maxHealth = 100) {
    this.x = x
    this.y = y
    this.health = h
    this.maxHealth = maxHealth
    this.image = duckImage
    this.direction = direction
    this.move_speed = move_speed
    this.activePowerup = activePowerup
    this.hitTimer = 0
  }
  draw() {
    if (this.hitTimer > 0) {
      tint(255, 0, 0);
      this.hitTimer--;
    } else if (this.activePowerupTint) {
      tint(...this.activePowerupTint);
    } else {
      noTint();
    }
    if(this.health <= 0) {
      gameState = "gameover"
      return;
    }
    // draw duck
    image(this.image, this.x, this.y, 50, 50)
    noTint();
  }
  moveUp() {
    this.y = this.y - this.move_speed
    this.direction = 'up'
  }
  moveDown() {
    this.y = this.y + this.move_speed
    this.direction = 'down'
  }
  moveLeft() {
    this.x = this.x - this.move_speed
    this.direction = 'left'
  }
  moveRight() {
    this.x = this.x + this.move_speed
    this.direction = 'right'
  }
  attack(attackDirection) {
    let direction 
    if(this.activePowerup != "MultiShot") {
      direction = attackDirection || this.direction
    }else{
      direction = "all"
    }
    newAttackWave(this.x, this.y, direction)
  }
  contact(enemyX, enemyY, enemy) {
    if (
      enemyX >= this.x - 30 &&
      enemyX <= this.x + 30 &&
      enemyY >= this.y - 30 &&
      enemyY <= this.y + 30
    ) {
      if (this.activePowerup != "Shield" && !enemy.hasDealtDamage) {
        this.health -= 10;
        this.hitTimer = 10;
      }
      enemy.health = 0;
      enemy.dying = true;
      enemy.hasDealtDamage = true;
    }
  }
  collidePowerup(powerup) {
    if (this.x < powerup.x + powerup.width &&
      this.x + 50 > powerup.x &&
      this.y < powerup.y + powerup.height &&
      this.y + 50 > powerup.y) {
        this.activePowerup = powerup.constructor.name
        this.activePowerupTint = powerup.tintColor || null;
        powerup.apply(this)
        return true
    }
  }
} 

window.addEventListener('DOMContentLoaded',()=>{
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    console.log('Microphone access granted');
  })
  .catch(function(err) {
    console.error('Microphone access denied: ' + err);
  });
})
