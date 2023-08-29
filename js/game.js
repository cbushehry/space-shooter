let gameScene = new Phaser.Scene('Game');

gameScene.preload = function() {
  this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/playerShip.png');
  this.load.image('alien1', 'assets/images/alienShip1.png');
  this.load.image('alien2', 'assets/images/alienShip2.png');
  this.load.image('asteroid1', 'assets/images/asteroid1.png');
  this.load.image('asteroid2', 'assets/images/asteroid2.png');
};

gameScene.create = function() {
  let bg = this.add.sprite(0, 0, 'background');
  bg.setOrigin(0, 0);
  
  //PLAYER SPRITE
  this.player = this.add.sprite(140, 1847/2, 'player');
  this.player.setScale(0.7);

  //ALIEN SPRITES
  this.alien1 = this.add.sprite(4700, 1130, 'alien1');
  this.alien1.setScale(0.8);
  this.alien2 = this.add.sprite(4700, 540, 'alien2');
  this.alien2.setScale(0.8);
  
  //ASTEROID SPRITES
  this.asteroid1 = this.add.sprite(3150, 340, 'asteroid1');
  this.asteroid1.setScale(0.7);
  this.asteroid2 = this.add.sprite(2350, 1300, 'asteroid2');
  this.asteroid2.setScale(0.7);
};

gameScene.update = function(time, delta) {
  let speed = 500;
  let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  let player = this.player;  // Now you can access player as it was assigned in `create`
  
  if (keyW.isDown) {
    player.y -= speed * delta / 1000;
  }
  if (keyA.isDown) {
    player.x -= speed * delta / 1000;
  }
  if (keyS.isDown) {
    player.y += speed * delta / 1000;
  }
  if (keyD.isDown) {
    player.x += speed * delta / 1000;
  }

// check for active input then walk (change this to shoot lasers)
   if(this.input.activePointer.isDown) {
     this.player.x += speed * delta / 1000;
  }  

  let playerRect = this.player.getBounds();
  let asteroid1Rect = this.asteroid1.getBounds();

  if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, asteroid1Rect)) {
    console.log('you Crashed!');
      this.scene.restart();
      return;
    }
};

let config = {
  type: Phaser.AUTO,
  width: 1847,
  height: 5119,
  scene: gameScene
};

let game = new Phaser.Game(config);