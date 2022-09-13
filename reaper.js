const reaperImage = new Image();
reaperImage.src = "/Materials/Reaper/Enemy 15-1.png"; // 1024 × 1920 // 9 x 20

const spriteWidth = 32;
const spriteHeight = 32;

const bloodImage = new Image();
bloodImage.src = "/Materials/Reaper/4_100x100px.png"; // 1024 × 1920 // 9 x 20

const bloodSpriteWidth = 100;
const bloodSpriteHeight = 100;

const ATTRACTION_DISTANCE = 300;
const ATTACK_DISTANCE = 5;

class Reaper {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speedX = 0;
    this.speedY = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.friction = 0.15;
  }

  checkIntersection(item) {
    return (
      this.x + this.width > item.x &&
      this.x < item.x + item.width &&
      this.y + this.height > item.y &&
      this.y < item.y + item.height
    );
  }

  runMovementLogic(obstacles) {
    let newAccelerationX = this.accelerationX * (1 - this.friction);
    let newAccelerationY = this.accelerationY * (1 - this.friction);
    let newSpeedX = this.speedX * (1 - this.friction * 3) + newAccelerationX;
    let newSpeedY = this.speedY * (1 - this.friction * 3) + newAccelerationY;
    let newX = this.x + newSpeedX;
    let newY = this.y + newSpeedY;

    for (let obstacle of obstacles) {
      const horizontalIntersection = obstacle.checkIntersection({
        ...this,
        x: newX,
      });
      const verticalIntersection = obstacle.checkIntersection({
        ...this,
        y: newY,
      });
      if (verticalIntersection) {
        newSpeedY = 0;
        newY = this.y;
      }
      if (horizontalIntersection) {
        newSpeedX = 0;
        newX = this.x;
      }
    }

    Object.assign(this, {
      x: newX,
      y: newY,
      speedX: newSpeedX,
      speedY: newSpeedY,
      accelerationX: newAccelerationX,
      accelerationY: newAccelerationY,
    });
  }

  runLogic() {
    const { x: playerX, y: playerY } = this.game.player;
    let xDelta = this.x - playerX;
    let yDelta = this.y - playerY;
    if (xDelta < ATTRACTION_DISTANCE && yDelta < ATTRACTION_DISTANCE) {
      this.accelerationX = (Math.random() * -10 * xDelta) / 1000;
      this.accelerationY = (Math.random() * -20 * yDelta) / 1000;
    }
    if (
      Math.abs(xDelta) < this.width + ATTACK_DISTANCE &&
      Math.abs(yDelta) < this.height + ATTACK_DISTANCE
    ) {
      this.attack();
      //  this.pause();
    }
    this.runMovementLogic(this.game.boundaries);
  }

  attack() {
    const { x: playerX, y: playerY } = this.game.player;
    if (this.x > playerX) {
      this.game.player.newAccelerationX = -1;
    }
    if (this.x < playerX) {
      this.game.player.newAccelerationX = 1;
    }
    if (this.y > playerY) {
      this.game.player.newAccelerationY = -1;
    }
    if (this.y < playerY) {
      this.game.player.newAccelerationY = 1;
    }
    this.game.lives--;
  }

  draw() {
    const xDelta = this.x - this.game.player.x;
    const yDelta = this.y - this.game.player.y;
    if (xDelta > ATTRACTION_DISTANCE) {
      this.game.context.drawImage(
        reaperImage,
        spriteWidth * (Math.floor(this.game.frame / 6) % 3),
        spriteHeight * 0,
        spriteWidth,
        spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.x > this.game.player.x - this.game.player.width) {
      this.game.context.drawImage(
        reaperImage,
        spriteWidth * (Math.floor(this.game.frame / 6) % 3),
        spriteHeight * 1,
        spriteWidth,
        spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.x + this.width < this.game.player.x) {
      this.game.context.drawImage(
        reaperImage,
        spriteWidth * (Math.floor(this.game.frame / 6) % 3),
        spriteHeight * 2,
        spriteWidth,
        spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    if (yDelta > ATTRACTION_DISTANCE) {
      this.game.context.drawImage(
        reaperImage,
        spriteWidth * (Math.floor(this.game.frame / 6) % 3),
        spriteHeight * 0,
        spriteWidth,
        spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.y > this.game.player.y + this.game.player.height) {
      this.game.context.drawImage(
        reaperImage,
        spriteWidth * (Math.floor(this.game.frame / 6) % 3),
        spriteHeight * 3,
        spriteWidth,
        spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.y + this.height < this.game.player.y) {
      this.game.context.drawImage(
        reaperImage,
        spriteWidth * (Math.floor(this.game.frame / 6) % 3),
        spriteHeight * 0,
        spriteWidth,
        spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
}
