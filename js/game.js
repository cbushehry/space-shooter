let gameScene = new Phaser.Scene('Game');

gameScene.preload = function() {
  this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/playerShip.png');
  this.load.image('alien', 'assets/images/alienShip.png');
};

gameScene.create = function() {
  let bg = this.add.sprite(0, 0, 'background');
  bg.setOrigin(0, 0);
  
  this.player = this.add.sprite(140, 1847/2, 'player');
  this.player.setScale(0.6, 0.6);

  let alien1 = this.add.sprite(4700, 930, 'alien');
  alien1.setScale(0.8, 0.8);

  let alien2 = this.add.sprite(4700, 740, 'alien');
  alien2.setScale(0.8, 0.8);
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
};

let config = {
  type: Phaser.AUTO,
  width: 5119,
  height: 1847,
  scene: gameScene
};

let game = new Phaser.Game(config);