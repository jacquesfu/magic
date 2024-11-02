class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  create() {
    // Create bee sprite using graphics - 50% bigger (48x48 instead of 32x32)
    const beeGraphics = this.add.graphics();

    // Draw bee body (yellow circle) - larger size
    beeGraphics.fillStyle(0xffdd00);
    beeGraphics.fillCircle(24, 24, 24); // Increased radius

    // Draw stripes (black) - adjusted positions and sizes
    beeGraphics.fillStyle(0x000000);
    beeGraphics.fillRect(18, 12, 12, 6); // Adjusted stripe positions
    beeGraphics.fillRect(18, 24, 12, 6);
    beeGraphics.fillRect(18, 36, 12, 6);

    // Generate texture from graphics - larger size
    beeGraphics.generateTexture("bee", 48, 48);
    beeGraphics.destroy();

    console.log("PreloadScene: Graphics generated successfully");
    this.scene.start("MenuScene");
  }
}
