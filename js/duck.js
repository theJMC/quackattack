const MOVEMENT_SPEED = 5

class Duck {
  constructor(x, y, h, duckImage, direction="left", activePowerup = null, move_speed=MOVEMENT_SPEED, maxHealth = 100) {
    this.x = x
    this.y = y
    this.health = h
    this.maxHealth = maxHealth
    this.image = duckImage
    this.direction = direction
    this.move_speed = move_speed
    this.activePowerup = activePowerup
  }
  draw() {
    // draw duck
    image(this.image, this.x, this.y, 50, 50)
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
  attack() {
    let direction
    if(this.activePowerup != "MultiShot") {
      direction = this.direction
    }else{
      direction = "all"
    }
    newAttackWave(this.x, this.y, direction)
    console.log('attack')
  }
  contact(enemyX, enemyY) {
    if (
      enemyX >= this.x - 75 &&
      enemyX <= this.x + 75 &&
      enemyY >= this.y - 75 &&
      enemyY <= this.y + 75
    ) {
      if (this.activePowerup != "Shield") {
        this.health--;
      }
      console.log('duck owch!', this.health)
    }
  }
  collidePowerup(powerup) {
    if (this.x < powerup.x + powerup.width &&
      this.x + 50 > powerup.x &&
      this.y < powerup.y + powerup.height &&
      this.y + 50 > powerup.y) {
        console.log('collided with powerup')
        this.activePowerup = powerup.constructor.name
        powerup.apply(this)
        return true
    }
  }
}