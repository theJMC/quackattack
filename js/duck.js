const MOVEMENT_SPEED = 5


class Duck {
  constructor(x, y, h, duckImage) {
    this.x = x
    this.y = y
    this.health = h
    this.image = duckImage
  }
  draw() {
    // draw duck
    image(this.image, this.x, this.y, 50, 50)
  }
  moveUp() {
    this.y = this.y - MOVEMENT_SPEED
  }
  moveDown() {
    this.y = this.y + MOVEMENT_SPEED
  }
  moveLeft() {
    this.x = this.x - MOVEMENT_SPEED
  }
  moveRight() {
    this.x = this.x + MOVEMENT_SPEED
  }
  attack() {
    let direction = "left"
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
      this.health--;
    }
  }
}