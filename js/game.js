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

  this.load.image('player1', 'assets/images/playerShip1.png');
  this.load.image('player2', 'assets/images/playerShip2.png');
  this.load.image('player3', 'assets/images/playerShip3.png');
  this.load.image('player4', 'assets/images/playerShip4.png');

  this.load.image('laser1', 'assets/images/laser1.png');

  this.load.image('asteroid1', 'assets/images/asteroid1.png');
  this.load.image('asteroid2', 'assets/images/asteroid2.png');
  this.load.image('asteroid3', 'assets/images/asteroid3.png');
  this.load.image('asteroid4', 'assets/images/asteroid4.png');
  this.load.image('asteroid5', 'assets/images/asteroid5.png');

  this.load.image('explosion1', 'assets/images/explosion1.png');
  this.load.image('explosion2', 'assets/images/explosion2.png');
  this.load.image('explosion3', 'assets/images/explosion3.png');
  this.load.image('explosion4', 'assets/images/explosion4.png');
  this.load.image('explosion5', 'assets/images/explosion5.png');
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

  this.anims.create({
    key: 'fly',
    frames: [
        { key: 'player1' },
        { key: 'player2' },
        { key: 'player3' },
        { key: 'player4' },
    ],
    frameRate: 13,  // Adjust the frame rate to get the desired effect
    repeat: -1, // This will make the animation loop indefinitely
});

  // Initialize player sprite
  this.player = this.physics.add.sprite(BG_WIDTH / 2, BG_HEIGHT / 2, 'player');
  this.player.setOrigin(0.4, 0.5);  //player.setOrigin(0.4, 0.5) so playerShip spins from thrusters
  this.player.setScale(PLAYER_INITIAL_SCALE);
  this.player.angle = PLAYER_INITIAL_ANGLE;
  this.player.setDepth(1);
  this.player.play('fly');

  // Initialize laser sprite
  this.lasers = this.physics.add.group();
  this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  this.anims.create({
    key: 'asteroidFly',
    frames: [
        { key: 'asteroid1' },
        { key: 'asteroid2' },
        { key: 'asteroid3' },
        { key: 'asteroid4' },
        { key: 'asteroid5' },  // Adding asteroid5 here
    ],
    frameRate: 12, 
    repeat: -1,
});

this.anims.create({
  key: 'explosionAnim',
  frames: [
      { key: 'explosion1' },
      { key: 'explosion2' },
      { key: 'explosion3' },
      { key: 'explosion4' },
      { key: 'explosion5' },
  ],
  frameRate: 20,
  repeat: 0,
});

  // Initialize asteroid sprites
  this.asteroids = this.physics.add.group();
  this.time.addEvent({ delay: 1000, callback: this.spawnAsteroid, callbackScope: this, loop: true });

  this.physics.add.collider(this.lasers, this.asteroids, function(laser, asteroid) {
    laser.destroy();
    let scale = asteroid.scale; // Get the scale of the asteroid
    asteroid.destroy();
    this.createExplosion(asteroid.x, asteroid.y, scale); // Pass the scale to the method
  }, null, this);
  
  this.physics.add.collider(this.player, this.asteroids, function(player, asteroid) {
    console.log("Player hit!");
    let scale = asteroid.scale; // Get the scale of the asteroid
    asteroid.destroy();
    this.createExplosion(asteroid.x, asteroid.y, scale); // Pass the scale to the method
  }, null, this);

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

  this.asteroids.getChildren().forEach(asteroid => {
    // Update the position based on stored velocity and elapsed time
    asteroid.x += asteroid.getData('velocityX') * delta / 1000;
    asteroid.y += asteroid.getData('velocityY') * delta / 1000;
  
    // Now adjust the position based on the player's movement
    asteroid.x -= dx;
    asteroid.y -= dy - bgScrollSpeed * delta / 1000;
  
    // Destroy the asteroid if it's off-screen on the left side
    if (asteroid.x < -500) {  // Adjust -20 to fit the width of your asteroid sprite
        asteroid.destroy();
    }
});
};

// Method to shoot lasers
gameScene.shootLaser = function() {
  let laser = this.lasers.create(this.player.x, this.player.y, 'laser1');
  laser.setScale(0.14);
  
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

gameScene.spawnAsteroid = function() {
  // Generate random position and speed
  let x, y, velocityX = 1000, velocityY = 1000;

  // Set up position to spawn from the right side
  x = BG_WIDTH; // Spawn a bit outside of the screen
  y = Math.random() * BG_HEIGHT; // Random position along the right side

  let speed = Math.random() * 250 + 50; // Speed between 50 and 300

  // Setting angle to move asteroids from right to left horizontally
  let angle = Phaser.Math.DegToRad(180); // 180 degrees, pointing left

  // Determine velocity based on the angle and speed
  velocityX = Math.cos(angle) * speed;
  velocityY = Math.sin(angle) * speed;

  // Set rotation to match the movement direction
  let rotation = angle; // Set rotation in radians (not degrees)
  
  // Create asteroid and set properties
  let asteroidKey = 'asteroid' + Phaser.Math.Between(1, 5);  // This will randomly choose a number between 1 and 5
  let asteroid = this.asteroids.create(x, y, asteroidKey);
  asteroid.setRotation(rotation); // Set rotation in radians
  asteroid.setScale(Math.random() * 0.2 + 0.1); // Scale between 0.1 and 0.3
  asteroid.setData('velocityX', velocityX);
  asteroid.setData('velocityY', velocityY);
  asteroid.play('asteroidFly');

  console.log('Asteroid spawned', {x, y, rotation, velocityX, velocityY}); // Log asteroid details to console
};

gameScene.createExplosion = function(x, y, scale) {
  let explosion = this.add.sprite(x, y, 'explosion1');
  explosion.setScale(scale); // Set the scale of the explosion to match the asteroid
  explosion.play('explosionAnim');
  explosion.on('animationcomplete', () => {
    explosion.destroy();
  });
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