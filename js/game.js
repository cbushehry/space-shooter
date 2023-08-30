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
  //BACKGROUND SPRITE
  this.bg1 = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  this.bg2 = this.add.sprite(0, -this.bg1.height, 'background').setOrigin(0, 0);
  this.bg3 = this.add.sprite(this.bg1.width, 0, 'background').setOrigin(0, 0);
  this.bg4 = this.add.sprite(-this.bg1.width, 0, 'background').setOrigin(0, 0);
  this.bg5 = this.add.sprite(0, this.bg1.height, 'background').setOrigin(0, 0);
  this.bg6 = this.add.sprite(this.bg1.width, this.bg1.height, 'background').setOrigin(0, 0);
  this.bg7 = this.add.sprite(-this.bg1.width, this.bg1.height, 'background').setOrigin(0, 0);
  this.bg8 = this.add.sprite(this.bg1.width, -this.bg1.height, 'background').setOrigin(0, 0);
  this.bg9 = this.add.sprite(-this.bg1.width, -this.bg1.height, 'background').setOrigin(0, 0);
  
  //PLAYER SPRITE
  this.player = this.add.sprite(1570/2, 4900, 'player');
  this.player.setScale(0.4);
  this.player.setOrigin(0.34, 0.5);
  this.player.angle = 270;

  //ALIEN SPRITES
  this.alien1 = this.add.sprite(1130, 100, 'alien1');
  this.alien1.setScale(0.5);
  this.alien2 = this.add.sprite(1540/2, 4400, 'alien2');
  this.alien2.setScale(0.5);
  
  //ASTEROID SPRITES
  this.asteroid1 = this.add.sprite(350, 3140, 'asteroid1');
  this.asteroid1.setScale(0.3);
  this.asteroid2 = this.add.sprite(1350, 2300, 'asteroid2');
  this.asteroid2.setScale(0.3);

  // CAMERA SETTINGS
  this.cameras.main.startFollow(this.player);
  this.cameras.main.setBounds(0, 0, 1847, 5119);
};

gameScene.update = function(time, delta) {
  let speed = 200;
  let bgScrollSpeed = 10;
  let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  let player = this.player;  
  let pointer = this.input.activePointer;
  let dx = 0;
  let dy = 0;

  if (keyW.isDown) {
    dy = -speed * delta / 1000;
  }
  if (keyA.isDown) {
    dx = -speed * delta / 1000;
  }
  if (keyS.isDown) {
    dy = speed * delta / 1000;
  }
  if (keyD.isDown) {
    dx = speed * delta / 1000;
  }

  if (pointer.isDown) {
    let angle = Phaser.Math.Angle.Between(
      player.x, player.y,
      pointer.worldX, pointer.worldY
    );
    player.rotation = angle;
  }

  // Update background positions
  let bgSprites = [this.bg1, this.bg2, this.bg3, this.bg4, this.bg5, this.bg6, this.bg7, this.bg8, this.bg9];
  bgSprites.forEach(bg => {
    bg.x -= dx;
    bg.y -= dy - bgScrollSpeed * delta / 1000;

    // Loop background horizontally
    if (bg.x > this.bg1.width) bg.x -= this.bg1.width * 3;
    if (bg.x < -this.bg1.width) bg.x += this.bg1.width * 3;

    // Loop background vertically
    if (bg.y > this.bg1.height) bg.y -= this.bg1.height * 3;
    if (bg.y < -this.bg1.height) bg.y += this.bg1.height * 3;
  });
};

let config = {
  type: Phaser.AUTO,
  width: 1570,
  height: 729,
  //width: 1847,
  //height: 5119,
  scene: gameScene
};

let game = new Phaser.Game(config);