class Enemy {
  constructor(x, y, d) {
    this.x = x
    this.y = y
    this.health = 100
    this.direction = d
    this.dead = false
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
    if (this.x > 550 || 
        this.x < 0 ||
        this.y > 550 || 
        this.y < 0) {
      this.dead = true
    }
  }
  contact(attackX, attackY) {
    if (
      attackX >= this.x - 25 &&
      attackX <= this.x + 25 &&
      attackY >= this.y - 25 &&
      attackY <= this.y + 25
    ) {
      this.health-=100;
    }
    if (this.health <= 0){
      this.dead = true
    }
  }
}