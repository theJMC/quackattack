class Enemy {
  constructor(x, y, d) {
    this.x = x
    this.y = y
    this.health = 100
    this.direction = d
  }
  draw() {
    // draw enemy
    fill('#C06EF0') // TEMP
    circle(this.x, this.y, 25) // TEMP
  }
  move() {
    switch (this.direction) {
        case 'n':
            this.y++
            break;
        case 'e':
            this.x--
            break;
        case 's':
            this.y--
            break;
        default:
            this.x++
    }
  }
}