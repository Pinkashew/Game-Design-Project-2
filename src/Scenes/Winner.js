class Winner extends Phaser.Scene {
    constructor() {
        super("winnerLevel");
    }

    preload() {

    }

    create() {
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey("S");
        let winnerText = this.add.text(game.config.width/2, game.config.height/2 - 100, "YOU WIN!!! Press S to return to Main Menu", {fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6'});
        winnerText.setOrigin(0.5, 0.5);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("titleScreen");
        }
    }
}