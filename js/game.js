let gameScene = new Phaser.Scene('Game');
 
gameScene.preload = function(){
  this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/playerShip.png');
};

gameScene.create = function() {
  let bg = this.add.sprite(0, 0, 'background');
 
  bg.setPosition(1280/2, 720/2);
 
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;
  
  let player = this.add.sprite(70, 180, 'player');
};
 
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 1280,
  height: 720,
  scene: gameScene
};
 
let game = new Phaser.Game(config);