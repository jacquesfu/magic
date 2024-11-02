class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    console.log("GameOverScene: Started with score:", this.finalScore);

    // Game Over text
    this.add
      .text(config.width / 2, config.height / 3, "Game Over!", {
        fontSize: "64px",
        fill: "#000",
        fontStyle: "bold",
        stroke: "#fff",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Score display
    this.add
      .text(
        config.width / 2,
        config.height / 2,
        `Final Score: ${this.finalScore}`,
        {
          fontSize: "48px",
          fill: "#000",
          fontStyle: "bold",
          stroke: "#fff",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    // Restart prompt
    this.add
      .text(
        config.width / 2,
        (config.height * 2) / 3,
        "Press SPACE to play again",
        {
          fontSize: "32px",
          fill: "#000",
          stroke: "#fff",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5);

    // Handle restart with spacebar
    this.input.keyboard.once("keydown-SPACE", () => {
      console.log("GameOverScene: Starting new game via spacebar");
      this.scene.start("GameScene");
    });
  }
}
