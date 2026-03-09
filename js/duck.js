const MOVEMENT_SPEED = 5


class Duck {
  constructor(x, y, h) {
    this.x = x
    this.y = y
    this.health = h
  }
  draw() {
    // draw duck
    fill('#EFC66F') // TEMP
    circle(this.x, this.y, 50) // TEMP
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
    console.log('attack')
  }
}