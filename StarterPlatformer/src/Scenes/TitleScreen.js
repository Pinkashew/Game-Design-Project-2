class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    preload() {

    }

    create() {
        let my = this.my;
        let start = this.add.text(game.config.width/2, game.config.height/2, "Press S to Start Game!!!", { fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6' });
        let titleCard = this.add.text(game.config.width/2, game.config.height/2 - 100, "Adventures of Squiggles", { fontFamily: "'Roboto'", fontSize: '80px', fill: '#ADD8E6' });
        start.setOrigin(0.5, 0.5);
        titleCard.setOrigin(0.5, 0.5);
        this.nextScene = this.input.keyboard.addKey("S");
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("selectLevel");
        }
    }
}