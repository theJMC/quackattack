class Powerup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.active = true;
        this.label = "?";
        this.color = "white";
    }

    apply(player) {
        // Override in subclasses
        this.active = false; // Deactivate after applying
        throw new Error("apply() must be implemented by subclass");
    }

    update(deltaTime) {
        // Override in subclasses for animation/movement if needed
    }

    draw() {
        if (!this.active) return;
        // Background shape
        fill(this.color);
        circle(this.x + this.width / 2, this.y + this.height / 2, this.width);

        // Label text
        fill("white");
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }
}

class HealthPack extends Powerup {
    constructor(x, y) {
        super(x, y);
        this.color = "green";
        this.healAmount = 25;
        this.label = "+";
    }

    apply(player) {
        this.active = false;
        player.health = Math.min(player.health + this.healAmount, player.maxHealth);
        player.activePowerup = null; 
    }
}

class Shield extends Powerup {
    constructor(x, y) {
        super(x, y);
        this.color = "blue";
        this.duration = 4000; // 4 seconds
        
    }

    apply(player) {
        this.active = false;
        setTimeout(() => {
            player.activePowerup = null;
        }, this.duration);
    }
}

class MultiShot extends Powerup {
    constructor(x, y) {
        super(x, y);
        this.color = "purple";
        this.duration = 7000;
        
    }

    apply(player) {
        this.active = false;
        player.attackCount = 4; // fire in all 4 directions
        setTimeout(() => {
            player.attackCount = 1;
            player.activePowerup = null;
        }, this.duration);
    }
}

function spawnRandomPowerup(x, y) {
    const powerupTypes = [HealthPack, Shield, MultiShot];
    const RandomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    return new RandomType(x, y);
}