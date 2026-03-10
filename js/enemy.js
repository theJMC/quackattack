class Enemy {
  constructor(x, y, d, spriteSheet) {
    this.x = x
    this.y = y
    this.health = 100
    this.direction = d
    this.dead = false
    this.spriteSheet = spriteSheet
     // Spritesheet layout: 24x24 frames, 10 columns per row
    this.frameWidth = 24
    this.frameHeight = 24
    this.columns = 10  // 240 / 24

    this.walkAnimations = {start: 0, end: 87}  // frames 0-87 for walking in each direction
    this.deathAnim = { start: 88, end: 93 }  // last ~5 frames for death

    // Animation state
    this.currentFrame = this.walkAnimations?.start || 0
    this.frameCounter = 0
    this.frameSpeed = 10  // draw() calls between frame advances

    // Death animation state
    this.deathFrame = this.deathAnim.start
    this.deathTimer = 0
    this.deathSpeed = 8
    this.dying = false
    this.displaySize = 32
  }

  getFramePosition(frameIndex) {
    let col = frameIndex % this.columns
    let row = Math.floor(frameIndex / this.columns)
    return { x: col * this.frameWidth, y: row * this.frameHeight }
  }

  draw() {
    if (this.dying) {
      // Death animation
      let pos = this.getFramePosition(this.deathFrame)
      image(
        this.spriteSheet,
        this.x, this.y,
        this.displaySize, this.displaySize,
        pos.x, pos.y,
        this.frameWidth, this.frameHeight
      )

      this.deathTimer++
      if (this.deathTimer >= this.deathSpeed) {
        this.deathTimer = 0
        this.deathFrame++
        if (this.deathFrame > this.deathAnim.end) {
          this.dead = true
        }
      }
    } else {
      // Walk animation
      let anim = this.walkAnimations
      let pos = this.getFramePosition(this.currentFrame)
      image(
        this.spriteSheet,
        this.x, this.y,
        this.displaySize, this.displaySize,
        pos.x, pos.y,
        this.frameWidth, this.frameHeight
      )

      this.frameCounter++
      if (this.frameCounter >= this.frameSpeed) {
        this.frameCounter = 0
        this.currentFrame++
        if (this.currentFrame > anim.end) {
          this.currentFrame = anim.start
        }
      }
    }
  }
  move() {
    if(this.dying) return;
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
    if(this.dying) return;
    if (
      attackX >= this.x - 25 &&
      attackX <= this.x + 25 &&
      attackY >= this.y - 25 &&
      attackY <= this.y + 25
    ) {
      this.health-=100;
    }
    if (this.health <= 0){
      this.dying = true
    }
  }
}