const wallImage = new Image();
wallImage.src = "/Materials/wall.png"; // 1024 × 1920 // 9 x 20

class Boundary {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
  }

  checkIntersection(item) {
    return (
      this.x + this.width > item.x &&
      this.x < item.x + item.width &&
      this.y + this.height > item.y &&
      this.y < item.y + item.height
    );
  }
  draw() {
    this.game.context.save();

    this.game.context.drawImage(
      wallImage,
      0,
      0,
      32,
      32,
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.game.context.restore();
  }
}
