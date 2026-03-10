const MOVEMENT_SPEED = 5

class Duck {
  constructor(x, y, h, duckImage) {
    this.x = x
    this.y = y
    this.health = h
    this.direction = 'left'
    this.image = duckImage
  }
  draw() {
    // draw duck
    image(this.image, this.x, this.y, 50, 50)
  }
  moveUp() {
    this.y = this.y - MOVEMENT_SPEED
    this.direction = 'up'
  }
  moveDown() {
    this.y = this.y + MOVEMENT_SPEED
    this.direction = 'down'
  }
  moveLeft() {
    this.x = this.x - MOVEMENT_SPEED
    this.direction = 'left'
  }
  moveRight() {
    this.x = this.x + MOVEMENT_SPEED
    this.direction = 'right'
  }
  attack() {
    newAttackWave(this.x, this.y, this.direction)
    console.log('attack')
  }
  contact(enemyX, enemyY) {
    if (
      enemyX >= this.x - 30 &&
      enemyX <= this.x + 30 &&
      enemyY >= this.y - 30 &&
      enemyY <= this.y + 30
    ) {
      this.health--;
      console.log('duck owch!', this.health)
    }
  }
}