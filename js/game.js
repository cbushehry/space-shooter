let gameScene = new Phaser.Scene('Game');

const KEY_W = Phaser.Input.Keyboard.KeyCodes.W;
const KEY_A = Phaser.Input.Keyboard.KeyCodes.A;
const KEY_S = Phaser.Input.Keyboard.KeyCodes.S;
const KEY_D = Phaser.Input.Keyboard.KeyCodes.D;

const BG_WIDTH = 1847;
const BG_HEIGHT = 1706;
const PLAYER_INITIAL_SCALE = 0.4;
const PLAYER_INITIAL_ANGLE = 270;
const PLAYER_SPEED = 500;
const BG_SCROLL_SPEED = 10;

gameScene.preload = function() {
  this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/playerShip.png');
};

gameScene.create = function() {
  // Background sprite grid size
  const cols = 3;
  const rows = 3;

  // Initialize background sprites in a loop
  this.bgSprites = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i - 1) * BG_WIDTH;
      const y = (j - 1) * BG_HEIGHT;
      const bg = this.add.sprite(x, y, 'background').setOrigin(0, 0);
      this.bgSprites.push(bg);
    }
  }

  //PLAYER SPRITE
  this.player = this.add.sprite(BG_WIDTH / 2, BG_HEIGHT / 2, 'player');
  this.player.setScale(PLAYER_INITIAL_SCALE);
  this.player.setOrigin(0.4, 0.5);  // setOrigin(0.4, 0.5) so playerShip spins from the thruster instead of middle of spaceship
  this.player.angle = PLAYER_INITIAL_ANGLE;

  // CAMERA SETTINGS
  this.cameras.main.startFollow(this.player);
  this.cameras.main.setBounds(0, 0, BG_WIDTH, BG_HEIGHT);
  const zoomFactor = Math.min(config.width / BG_WIDTH, config.height / BG_HEIGHT);
  this.cameras.main.setZoom(zoomFactor);

  const cameraPadding = 0; // Adjust based on your needs
  this.cameras.main.setBounds(
    cameraPadding, 
    cameraPadding, 
    BG_WIDTH - cameraPadding * 2, 
    BG_HEIGHT - cameraPadding * 2
  );
};

gameScene.update = function(time, delta) {
  let keyW = this.input.keyboard.addKey(KEY_W);
  let keyA = this.input.keyboard.addKey(KEY_A);
  let keyS = this.input.keyboard.addKey(KEY_S);
  let keyD = this.input.keyboard.addKey(KEY_D);
  let pointer = this.input.activePointer;
  let bgScrollSpeed = BG_SCROLL_SPEED;
  let player = this.player;
  let speed = PLAYER_SPEED;
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
  this.bgSprites.forEach(bg => {
    bg.x -= dx;
    bg.y -= dy - bgScrollSpeed * delta / 1000;

    // Loop background horizontally
    if (bg.x > BG_WIDTH) bg.x -= BG_WIDTH * 3;
    if (bg.x < -BG_WIDTH) bg.x += BG_WIDTH * 3;

    // Loop background vertically
    if (bg.y > BG_HEIGHT) bg.y -= BG_HEIGHT * 3;
    if (bg.y < -BG_HEIGHT) bg.y += BG_HEIGHT * 3;
  });
};

let config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  width: 987,
  height: 876,
  scene: gameScene,
};

let game = new Phaser.Game(config);