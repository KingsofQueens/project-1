const playerImage = new Image();
playerImage.src = "/Materials/Player/Male 11-1.png"; // 1024 × 1920 // 9 x 20

const playerSpriteWidth = 32;
const playerSpriteHeight = 32;

class Player {
  constructor(game, x, y, speedX, speedY) {
    this.game = game;
    this.x = 32;
    this.y = 96;
    this.width = 32;
    this.height = 32;
    this.speedX = 0;
    this.speedY = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.friction = 0.15;
    this.direction = "right";
    this.isMoving = false;
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
    const keys = this.game.keysPressed;
    this.isMoving = false;
    for (const key of keys) {
      switch (key) {
        case "ArrowRight":
          this.accelerationX = +1.5;
          this.direction = "right";
          this.isMoving = true;
          break;
        case "ArrowDown":
          this.accelerationY = +1.5;
          this.direction = "down";
          this.isMoving = true;
          break;
        case "ArrowLeft":
          this.accelerationX = -1.5;
          this.direction = "left";
          this.isMoving = true;
          break;
        case "ArrowUp":
          this.accelerationY = -1.5;
          this.direction = "up";
          this.isMoving = true;
          break;
      }
    }
    this.runMovementLogic(this.game.boundaries);
  }

  draw() {
    if (!this.isMoving) {
      this.game.context.drawImage(
        playerImage,
        playerSpriteWidth * 1,
        playerSpriteHeight * 0,
        playerSpriteWidth,
        playerSpriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    if (this.direction === "right" && this.isMoving) {
      this.game.context.drawImage(
        playerImage,
        playerSpriteWidth * (Math.floor(this.game.frame / 6) % 3),
        playerSpriteHeight * 2,
        playerSpriteWidth,
        playerSpriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.direction === "down" && this.isMoving) {
      this.game.context.drawImage(
        playerImage,
        playerSpriteWidth * (Math.floor(this.game.frame / 6) % 3),
        playerSpriteHeight * 0,
        playerSpriteWidth,
        playerSpriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.direction === "left" && this.isMoving) {
      this.game.context.drawImage(
        playerImage,
        playerSpriteWidth * (Math.floor(this.game.frame / 6) % 3),
        playerSpriteHeight * 1,
        playerSpriteWidth,
        playerSpriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.direction === "up" && this.isMoving) {
      this.game.context.drawImage(
        playerImage,
        playerSpriteWidth * (Math.floor(this.game.frame / 6) % 3),
        playerSpriteHeight * 3,
        playerSpriteWidth,
        playerSpriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
}
