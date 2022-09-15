class Game {
  constructor(
    gameScreenElement,
    gameOverScreenElement,
    youWinScreenElement,
    mapsArray,
  ) {
    this.gameScreenElement = gameScreenElement;
    this.gameOverScreenElement = gameOverScreenElement;
    this.youWinScreenElement = youWinScreenElement;
    this.maps = mapsArray;

    this.canvasElement = document.querySelector("canvas");
    this.isRunning = false;
    this.context = this.canvasElement.getContext("2d");
    this.gameMap = mapsArray[0];
    this.boundaries = [];
    this.suddenWalls = [];
    this.portals = [];

    this.keysPressed = [];
    this.enableControls();
    this.currentTimestamp = new Date();
    this.previousTimestamp = new Date();
  }

  checkTimestampsDifference() {
    this.currentTimestamp = new Date();
    // check difference between current and previous timestamps
    let timeDelta =
      30 - Math.floor((this.currentTimestamp - this.previousTimestamp) / 1000);
    if (timeDelta === 0) {
      // difference of time passed between each refresh
      // something happens
      this.lose();
    }
    if (timeDelta > 0) {
      this.context.font = "32px monospace";
      this.context.fillStyle = "red";
      this.context.fillText("Time:", 500, 45);
      this.context.fillText(timeDelta, 600, 45);
    }
  }

  start() {
    console.log(this.currentTimestamp);
    this.generateWall();
    this.generateSuddenWall();
    this.generatePortal();
    this.player = new Player(this);
    this.reapers = [];
    this.addReaper();
    this.lives = 100;
    this.frame = 0;
    this.isRunning = true;
    this.loop();
    this.previousTimestamp = new Date();
  }

  restart() {
    console.log("Game has restarted.");
    this.generateWall();
    this.generateSuddenWall();
    this.generatePortal();
    this.reapers = [];
    this.addReaper();
    this.lives = 100;
    this.frame = 0;
    this.isRunning = true;
    this.player.x = 32;
    this.player.y = 96;
    this.loop();
    this.previousTimestamp = new Date();
  }

  drawLives() {
    const heartImage = new Image();
    heartImage.src = "/Materials/Player/heart2.png";
    this.context.drawImage(
      heartImage,
      16 * (Math.floor(this.frame / 9) % 5),
      0,
      16,
      16,
      45,
      23,
      32,
      32
    );
    this.context.font = "32px monospace";
    this.context.fillStyle = "red";
    this.context.fillText("HP:", 100, 45);
    this.context.fillText(this.lives, 180, 45);
  }

  lose() {
    this.gameScreenElement.style.display = "none";
    this.gameOverScreenElement.style.display = "";
    clearInterval(this.intervalId);
  }

  runLogic() {
    this.player.runLogic();
    for (const reaper of this.reapers) {
      reaper.runLogic();
    }
    if (this.lives <= 0) {
      this.lose();
    }
    this.winLogic();
  }

  enableControls() {
    const keysToPreventDefaultAction = [
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "ArrowLeft",
    ];
    window.addEventListener("keydown", (event) => {
      if (keysToPreventDefaultAction.includes(event.code)) {
        event.preventDefault();
      }
      this.keysPressed.push(event.code);
    });
    window.addEventListener("keyup", (event) => {
      this.keysPressed = this.keysPressed.filter((code) => code !== event.code);
    });
  }

  addReaper() {
    this.reapers.push(new Reaper(this, 400, 400));
    setTimeout(() => {
      this.reapers.push(new Reaper(this, 100, 200));
    }, 2000);
    setTimeout(() => {
      this.reapers.push(new Reaper(this, 550, 100));
    }, 3000);
    if ((this.gameMap = this.maps[1])) {
      setTimeout(() => {
        this.reapers.push(new Reaper(this, 150, 520));
      }, 4000);
    }
  }

  draw() {
    this.frame++;

    this.context.clearRect(0, 0, 800, 600);

    this.drawWall();
    this.drawPortal();
    this.setSuddenWallInterval();
    for (const reaper of this.reapers) {
      reaper.draw();
    }
    this.player.draw();
  }

  generatePortal() {

    this.gameMap.forEach((row, i) => {
      row.forEach((block, j) => {
        switch (block) {
          case "P":
            this.portals.push(new Portal(this, 30 * j, 30 * i));
            break;
        }
      });
    });
  }

  drawPortal() {
    this.portals.forEach((portal) => {
      portal.draw();
    });
  }

  generateWall() {
    this.gameMap.forEach((row, i) => {
      row.forEach((block, j) => {
        switch (block) {
          case "W":
            this.boundaries.push(new Boundary(this, 32 * j, 32 * i));
            break;
        }
      });
    });
  }

  drawWall() {
    this.context.save();
    this.boundaries.forEach((boundary) => {
      boundary.draw();
    });
    this.context.restore();
  }

  generateSuddenWall() {
    this.context.save();
    this.gameMap.forEach((row, i) => {
      row.forEach((block, j) => {
        switch (block) {
          case "Z":
            this.boundaries.visible = false;
            this.suddenWallAppearInterval = setInterval(() => {
              this.boundaries.push(new Boundary(this, 32 * j, 32 * i));
            }, 4000);
            break;
        }
      });
    });
    this.context.restore();
  }

  /*
  drawWSuddenWall() {
    this.suddenWalls.forEach((suddenWall) => { 
      suddenWall.draw();
    });
  }
*/

  setSuddenWallInterval() {
    this.context.save();
    //   this.suddenWallAppearInterval = setInterval(() => {
    this.boundaries.forEach((boundary) => {
      this.boundaries.visible = true;
      boundary.draw();
    });
    this.context.restore();
    //   }, 5000);
    /*
    for (let t = 0; t < 30; t++) {
      this.suddenWallAppearInterval = setInterval(() => {
        this.boundary.visible = true;
        this.suddenWalls.forEach((suddenWall) => {
      suddenWall.draw();
    });
      }, 1000 * (2 * t + 1));
      this.suddenWallDisappearInterval = setInterval(() => {
        this.boundary.visible = false;
      }, 1000 * 2 * t);
    }
    */
  }

  winLogic() {

        for (let portal of this.portals) {
          const isIntersectingWithPortal = this.player.checkIntersection(portal);
        if (isIntersectingWithPortal) {
          this.gameScreenElement.style.display = "none";
          this.youWinScreenElement.style.display = "";
          this.isRunning = false;
          this.gameMap = this.maps[1];
          clearInterval(this.intervalId);
        }} 
  }
  

  loop() {
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.draw();
        this.drawLives();
        this.runLogic();
        this.checkTimestampsDifference();
      }
    }, 1000 / 60);
  }
}
