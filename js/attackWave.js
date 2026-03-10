const WAVE_SPEED = 5

class AttackWave {
  constructor(x, y, direction) {
    this.x = x
    this.y = y
    this.direction = direction
    console.log('attack wave created')
  }

  draw() {
    // draw attack
    fill('#777777') // TEMP
    circle(this.x, this.y, 50) // TEMP
  }
  move() {
    switch (this.direction) {
      case 'up':
        this.y = this.y - WAVE_SPEED
        break;
      case 'down':
        this.y = this.y + WAVE_SPEED
        break; 
      case 'left':
        this.x = this.x - WAVE_SPEED
        break;
      case 'right':
        this.x = this.x + WAVE_SPEED
        break;
    }
  }
}