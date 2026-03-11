const WAVE_SPEED = 5

class AttackWave {
  constructor(x, y, direction, speed = WAVE_SPEED, size = 20) {
    this.x = x
    this.y = y
    this.direction = direction
    this.speed = speed
    this.size = size
  }

  draw() {
    // draw attack
    fill('#777777') // TEMP
    circle(this.x, this.y, this.size) // TEMP
  }
  move() {
    switch (this.direction) {
      case 'up':
        this.y = this.y - this.speed
        break;
      case 'down':
        this.y = this.y + this.speed
        break; 
      case 'left':
        this.x = this.x - this.speed
        break;
      case 'right':
        this.x = this.x + this.speed
        break;
      case 'all':
        this.y = this.y - this.speed
        this.x = this.x - this.speed
        this.x = this.x + this.speed
        this.y = this.y + this.speed
        break;
    }
  }
}