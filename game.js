class Game {
  constructor(gameScreenElement, gameOverScreenElement, restartButton) {
      this.gameScreenElement = gameScreenElement;
      this.gameOverScreenElement = gameOverScreenElement;
      this.restartButton = restartButton;

      this.canvasElement = document.querySelector('canvas');
      this.isRunning = false;
      this.context = this.canvasElement.getContext('2d');
      this.gameMap = [
        ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
        ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
        ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', 'W', 'W', 'W', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W'],
        ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
      ];
      this.boundaries = [];
      this.portals = [];
      this.keysPressed = [];
      this.enableControls();
      this.currentTimestamp = new Date()
      this.previousTimestamp = new Date()
    }

    
    checkTimestampsDifference() {
      this.currentTimestamp = new Date();
      // check difference between current and previous timestamps
      if (this.currentTimestamp - this.previousTimestamp === 30000) { // difference of time passed between each refresh
        // something happens
        this.lose();
      }
      let timeDelta = 30 - Math.floor((this.currentTimestamp - this.previousTimestamp)/1000);
      if (timeDelta > 0){
        this.context.font = '32px sans-serif';
        this.context.fillStyle = 'red';
        this.context.fillText("Time:", 500, 45);
        this.context.fillText(timeDelta, 600, 45);
      }
    }

    start() {
      console.log(this.currentTimestamp);
      this.generateWall();
      this.generatePortal();
      this.player = new Player(this);
      this.reapers = [];
      this.addReaper();
      this.lives = 100;
      this.frame = 0;
      this.isRunning = true;
      this.loop()
      this.previousTimestamp = new Date()
    }

    
    drawLives() {
      this.context.font = '32px sans-serif';
      this.context.fillStyle = 'red';
      this.context.fillText("HP:", 45, 45);
      this.context.fillText(this.lives, 120, 45);
    }

    lose() {
      this.gameScreenElement.style.display = 'none';
      this.gameOverScreenElement.style.display = '';
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
      this.player.winLogic();
    }
  
    enableControls () {
        const keysToPreventDefaultAction = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
        window.addEventListener('keydown', (event) => {
          if (keysToPreventDefaultAction.includes(event.code)) {
            event.preventDefault();
          }
          this.keysPressed.push(event.code);
        });
        window.addEventListener('keyup', (event) => {
          this.keysPressed = this.keysPressed.filter(code => code !== event.code);
        });
    }

    addReaper() {
        this.reapers.push(
            new Reaper(this, 500, 400),
          );
    }

    draw() {
      this.frame++;
      
      this.context.clearRect(0, 0, 800, 600);

      this.drawWall();
      this.drawPortal();
      for (const reaper of this.reapers) {
            reaper.draw();
          }
      this.player.draw();
    }

    generatePortal() {
      this.gameMap.forEach((row, i) => {
        row.forEach((block, j) => {
          switch (block) {
            case 'P':
              this.portals.push(
                new Portal(this, 30 * j, 30 * i)
              )
              break;
          }
        })
      })
    }

    drawPortal() {
      this.portals.forEach((portal) => {
        portal.draw();
      })
    }

    generateWall() {
      this.gameMap.forEach((row, i) => {
        row.forEach((block, j) => {
          switch (block) {
            case 'W':
              this.boundaries.push(
                new Boundary(this, 32 * j, 32 * i)
              )
              break;
          }
        })
      })
    }

    /*
  randomBlock(){
    this.gameMap.forEach((row, i) => {
      row.forEach((block, j) => {
        let randomX = Math.floor(Math.random()*i);
        let randomY = Math.floor(Math.random()*j);
        switch (block) {
          case ' ':
            if (this.boundaries.length < i * j / 8) {
              this.boundaries.push(new Boundary(this, randomX , randomY))
              this.boundaries.push(new Boundary(this, randomX , randomY+1))  
            }
          break;
        }
        console.log(emptyBlock);
      })
    })
  }
*/

    drawWall() {
      this.boundaries.forEach((boundary) => {
        boundary.draw();
      })

    }
  
    loop() {
      if (this.isRunning) {
          this.intervalId = setInterval(() => {
          this.draw()
          this.drawLives();
          this.runLogic()
          this.checkTimestampsDifference()
        }, 1000 / 60);
        /*
        this.randomBlockInterval = setInterval(() => {
          this.randomBlock()
        }, 1000);
        */
      }
  }
}