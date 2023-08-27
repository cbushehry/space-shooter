let gameScene = new Phaser.Scene('Game');
 
gameScene.preload = function(){
  this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/playerShip.png');
  this.load.image('alien', 'assets/images/alienShip.png');
};

gameScene.create = function() {
  let bg = this.add.sprite(0, 0, 'background');
  bg.setOrigin(0, 0);
  
  let player = this.add.sprite(140, 1847/2, 'player');
  player.setScale(0.6, 0.6);

  let alien1 = this.add.sprite(4700, 930, 'alien');
  alien1.setScale(0.8, 0.8);

  let alien2 = this.add.sprite(4700, 740, 'alien');
  alien2.setScale(0.8, 0.8);
  
};
 
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 5119,
  height: 1847,
  scene: gameScene
};
 
let game = new Phaser.Game(config);