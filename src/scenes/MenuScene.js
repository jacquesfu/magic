class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    // Log when menu scene starts
    console.log("MenuScene: Scene started");

    // Title text
    this.add
      .text(config.width / 2, config.height / 3, "Flappy Bee", {
        fontSize: "64px",
        fill: "#000",
        fontStyle: "bold",
        stroke: "#fff",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Start prompt
    this.add
      .text(config.width / 2, config.height / 2, "Press SPACE to start", {
        fontSize: "32px",
        fill: "#000",
        stroke: "#fff",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Handle start game with spacebar
    this.input.keyboard.once("keydown-SPACE", () => {
      console.log("MenuScene: Starting game via spacebar");
      this.scene.start("GameScene");
    });
  }
}
