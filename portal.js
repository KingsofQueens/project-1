const WIN_DISTANCE = 30;

const portalImage = new Image();
portalImage.src = "/Materials/Portal/Portal.png";

const portalEffectImage = new Image();
portalEffectImage.src = "/Materials/Portal/Effect.png"; // 1024 × 1920 // 9 x 20

const portalSpriteWidth = 101;
const portalSpriteHeight = 101;

const portalEffectWidth = 27;
const portalEffectHeight = 27;

class Portal {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
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
    this.game.context.drawImage(
      portalImage,
      0,
      0,
      101,
      101,
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.game.context.drawImage(
        portalEffectImage,
        0,
        portalEffectHeight * (Math.floor(this.game.frame / 6) % 2),
        27,
        27,
        this.x,
        this.y,
        this.width,
        this.height
    )
  }
}
