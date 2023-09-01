// Creating a new game scene
let gameScene = new Phaser.Scene('Game');

// Define key codes for easy reference
const KEY_W = Phaser.Input.Keyboard.KeyCodes.W;
const KEY_A = Phaser.Input.Keyboard.KeyCodes.A;
const KEY_S = Phaser.Input.Keyboard.KeyCodes.S;
const KEY_D = Phaser.Input.Keyboard.KeyCodes.D;

// Define constants for game settings
const BG_WIDTH = 1847;
const BG_HEIGHT = 1706;
const BG_SCROLL_SPEED = 10;
const PLAYER_INITIAL_SCALE = 0.4;
const PLAYER_INITIAL_ANGLE = 270;
const PLAYER_SPEED = 250;
const LASER_SPEED = 1000;

// Preload assets
gameScene.preload = function() {
  this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/playerShip.png');
  this.load.image('laser1', 'assets/images/laser1.png');
};

// Create game objects and initialize settings
gameScene.create = function() {
  // Initialize background grid
  const cols = 3;
  const rows = 3;
  this.bgSprites = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i - 1) * BG_WIDTH;
      const y = (j - 1) * BG_HEIGHT;
      const bg = this.add.sprite(x, y, 'background').setOrigin(0, 0);
      this.bgSprites.push(bg);
    }
  }

  // Initialize keyboard inputs
  this.keyW = this.input.keyboard.addKey(KEY_W);
  this.keyA = this.input.keyboard.addKey(KEY_A);
  this.keyS = this.input.keyboard.addKey(KEY_S);
  this.keyD = this.input.keyboard.addKey(KEY_D);

  // Initialize player sprite
  this.player = this.add.sprite(BG_WIDTH / 2, BG_HEIGHT / 2, 'player');
  this.player.setScale(PLAYER_INITIAL_SCALE);
  this.player.setOrigin(0.4, 0.5);  //player.setOrigin(0.4, 0.5) so playerShip spins from thrusters
  this.player.angle = PLAYER_INITIAL_ANGLE;
  this.player.setDepth(1);

  // Initialize laser sprite
  this.lasers = this.physics.add.group();
  this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Initialize camera settings
  this.cameras.main.startFollow(this.player);
  this.cameras.main.setBounds(0, 0, BG_WIDTH, BG_HEIGHT);
  const zoomFactor = Math.min(config.width / BG_WIDTH, config.height / BG_HEIGHT);
  this.cameras.main.setZoom(zoomFactor);

  const cameraPadding = 0;
  this.cameras.main.setBounds(
    cameraPadding,
    cameraPadding,
    BG_WIDTH - cameraPadding * 2,
    BG_HEIGHT - cameraPadding * 2
  );
};

// Update game objects
gameScene.update = function(time, delta) {
  let pointer = this.input.activePointer;
  let bgScrollSpeed = BG_SCROLL_SPEED;
  let player = this.player;
  let speed = PLAYER_SPEED;
  let dx = 0;
  let dy = 0;

  // Check for keyboard inputs and update player position accordingly
  if (this.keyW.isDown) dy = -speed * delta / 1000;
  if (this.keyA.isDown) dx = -speed * delta / 1000;
  if (this.keyS.isDown) dy = speed * delta / 1000;
  if (this.keyD.isDown) dx = speed * delta / 1000;

  // Rotate player towards pointer if clicked
  if (pointer.isDown) {
    let angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);
    player.rotation = angle;
  }

   // playerShip fires laser when SPACE is clicked
   if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
    this.shootLaser();
  }

  this.lasers.getChildren().forEach(laser => {
    if (laser.y < 0) {
      laser.destroy();
    }
  });

  // Update and loop background positions
  this.bgSprites.forEach(bg => {
    bg.x -= dx;
    bg.y -= dy - bgScrollSpeed * delta / 1000;
    if (bg.x > BG_WIDTH) bg.x -= BG_WIDTH * 3;
    if (bg.x < -BG_WIDTH) bg.x += BG_WIDTH * 3;
    if (bg.y > BG_HEIGHT) bg.y -= BG_HEIGHT * 3;
    if (bg.y < -BG_HEIGHT) bg.y += BG_HEIGHT * 3;
  });

  // Add this block of code to update lasers to move with background
  this.lasers.getChildren().forEach(laser => {
    laser.x -= dx;
    laser.y -= dy - bgScrollSpeed * delta / 1000;
    if (laser.x < 0 || laser.x > BG_WIDTH || laser.y < 0 || laser.y > BG_HEIGHT) {
      laser.destroy();
    }
  });
};

// Method to shoot lasers
gameScene.shootLaser = function() {
  let laser = this.lasers.create(this.player.x, this.player.y, 'laser1');
  laser.setScale(0.2);
  
  // Set the laser's rotation to match the player's rotation
  laser.rotation = this.player.rotation;
  laser.setDepth(0);
  
  // The player's angle in radians
  const angleInRadians = this.player.rotation;
  
  // Calculate the velocity components based on the angle
  const velocityX = Math.cos(angleInRadians) * LASER_SPEED;
  const velocityY = Math.sin(angleInRadians) * LASER_SPEED;
  
  laser.setVelocity(velocityX, velocityY);
};

// Game configuration
let config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  width: 987,
  height: 876,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: gameScene,
};

// Create the game instance
let game = new Phaser.Game(config);