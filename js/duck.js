
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
    this.y--
  }
  moveDown() {
    this.y++
  }
  moveLeft() {
    this.x--
  }
  moveRight() {
    this.x++
  }
  attack() {
    console.log('attack')
  }
}