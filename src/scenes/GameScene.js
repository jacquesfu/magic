class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    console.log("GameScene: Scene started");

    this.createBackground();

    this.score = 0;
    this.baseSpeed = -200;
    this.currentSpeed = this.baseSpeed;

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
      fontStyle: "bold",
      stroke: "#fff",
      strokeThickness: 4,
    });

    this.speedText = this.add.text(16, 56, "Speed: 100%", {
      fontSize: "24px",
      fill: "#000",
      fontStyle: "bold",
      stroke: "#fff",
      strokeThickness: 4,
    });

    this.player = this.physics.add.sprite(
      config.width * 0.1,
      config.height / 2,
      "bee"
    );

    this.player.setCollideWorldBounds(false);
    this.player.setBounce(0.6);
    this.player.setGravityY(800);

    this.obstacles = this.physics.add.group();

    this.spawnTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacles,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.gameOver,
      null,
      this
    );

    this.input.on("pointerdown", () => this.flapWings(), this);
    this.input.keyboard.on("keydown-SPACE", () => this.flapWings(), this);

    this.passedObstacles = new Set();
  }

  createBackground() {
    // Create a gradient background using rectangles
    const bg = this.add.graphics();

    // Sky gradient using multiple rectangles
    const totalRects = 20;
    const rectHeight = config.height / totalRects;

    for (let i = 0; i < totalRects; i++) {
      const ratio = i / totalRects;
      // Interpolate between sky blue and light blue
      const red = Math.floor(135 + (224 - 135) * ratio);
      const green = Math.floor(206 + (246 - 206) * ratio);
      const blue = Math.floor(235 + (255 - 235) * ratio);

      bg.fillStyle(Phaser.Display.Color.GetColor(red, green, blue));
      bg.fillRect(0, i * rectHeight, config.width, rectHeight);
    }

    // Add clouds
    bg.fillStyle(0xffffff, 0.5);
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(0, config.width);
      const y = Phaser.Math.Between(0, config.height / 2);
      bg.fillCircle(x, y, 30);
      bg.fillCircle(x + 20, y, 25);
      bg.fillCircle(x - 20, y, 25);
    }
  }

  createObstacleTexture() {
    const graphics = this.add.graphics();

    // Vine stem
    graphics.lineStyle(4, 0x0a5f38);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(0, 600);
    graphics.strokePath();

    // Leaves
    const leafColor = 0x2d8d5b;
    graphics.fillStyle(leafColor);
    for (let i = 0; i < 6; i++) {
      const y = i * 100;
      // Left leaf
      graphics.beginPath();
      graphics.moveTo(-15, y);
      graphics.lineTo(0, y + 20);
      graphics.lineTo(-15, y + 40);
      graphics.closePath();
      graphics.fill();
      // Right leaf
      graphics.beginPath();
      graphics.moveTo(15, y + 50);
      graphics.lineTo(0, y + 70);
      graphics.lineTo(15, y + 90);
      graphics.closePath();
      graphics.fill();
    }

    // Generate texture
    graphics.generateTexture("obstacle", 30, 600);
    graphics.destroy();
  }

  spawnObstacles() {
    const gapHeight = 150;
    const gapPosition = Phaser.Math.Between(
      gapHeight,
      config.height - gapHeight
    );

    // Create top obstacle
    const top = this.obstacles.create(config.width, 0, "obstacle");
    top.setOrigin(0.5, 0);
    top.setImmovable(true);
    top.body.allowGravity = false;
    top.displayHeight = gapPosition - gapHeight / 2;

    // Create bottom obstacle
    const bottom = this.obstacles.create(
      config.width,
      gapPosition + gapHeight / 2,
      "obstacle"
    );
    bottom.setOrigin(0.5, 0);
    bottom.setImmovable(true);
    bottom.body.allowGravity = false;
    bottom.displayHeight = config.height - (gapPosition + gapHeight / 2);

    // Set movement using current speed
    top.setVelocityX(this.currentSpeed);
    bottom.setVelocityX(this.currentSpeed);

    // Add unique ID to track scoring
    const obstacleId = Date.now();
    top.obstacleId = obstacleId;
    bottom.obstacleId = obstacleId;
  }

  flapWings() {
    this.player.setVelocityY(-350);
    this.player.angle = -20;

    this.time.delayedCall(200, () => {
      this.player.angle = 0;
    });

    console.log("GameScene: Wing flap", {
      velocity: this.player.body.velocity.y,
      position: { x: this.player.x, y: this.player.y },
    });
  }

  updateSpeed() {
    // Calculate speed increase based on score
    const speedIncrease = Math.floor(this.score / 10) * 5; // 5% increase every 10 points
    this.currentSpeed = this.baseSpeed * (1 + speedIncrease / 100);

    // Update all existing obstacles to new speed
    this.obstacles.getChildren().forEach((obstacle) => {
      obstacle.setVelocityX(this.currentSpeed);
    });

    // Update speed display (show as percentage)
    const speedPercentage = Math.round(
      (Math.abs(this.currentSpeed) / Math.abs(this.baseSpeed)) * 100
    );
    this.speedText.setText(`Speed: ${speedPercentage}%`);

    console.log("GameScene: Speed updated", {
      score: this.score,
      speedPercentage: speedPercentage,
      currentSpeed: this.currentSpeed,
    });
  }

  update() {
    // Check for passed obstacles and update score
    this.obstacles.getChildren().forEach((obstacle) => {
      if (
        obstacle.x < this.player.x &&
        !this.passedObstacles.has(obstacle.obstacleId)
      ) {
        this.passedObstacles.add(obstacle.obstacleId);
        // Only increment score once per obstacle pair
        if (obstacle.y === 0) {
          // Only count top obstacles
          this.score += 1;
          this.scoreText.setText("Score: " + this.score);

          // Update speed when score changes
          this.updateSpeed();
        }
      }
    });

    // Remove off-screen obstacles
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.x < -obstacle.width) {
        this.passedObstacles.delete(obstacle.obstacleId);
        obstacle.destroy();
      }
    });

    // Tilt downward when falling
    if (this.player.body.velocity.y > 0) {
      this.player.angle = Math.min(this.player.angle + 2, 20);
    }

    // Check for game over conditions
    if (this.player.y > config.height || this.player.y < 0) {
      this.gameOver();
    }
  }

  gameOver() {
    console.log("GameScene: Game Over - Final Score:", this.score);
    this.scene.start("GameOverScene", { score: this.score });
  }
}
