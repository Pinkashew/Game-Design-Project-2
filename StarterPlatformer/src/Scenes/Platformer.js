class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        this.respawn = this.respawn.bind(this);
        this.winner = this.winner.bind(this);
    }

    init() {
        // variables and settings
        this.ACCELERATION = 300;
        this.MAX_X_VEL = 200
        this.MAX_Y_VEL = 2000
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 2000;
        this.JUMP_VELOCITY = -750;
        
    }

    respawn() {
        const p1Spawn = this.map.findObject("Objects", obj => obj.name === "SpawnPoint")
        my.sprite.player.body.x = p1Spawn.x;
        my.sprite.player.body.y = p1Spawn.y - 50;
    }

    winner () {

    }

    create() {
        this.physics.world.setBounds(0,0, 18 * 120 * 2, 20 * 18 *2);
        this.cameras.main.setBounds(0, 0, 18 * 120 * 2, 20 * 18 *2);
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level", 18, 18, 120, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.background = this.map.addTilesetImage("PixelBackground", "tilemap_background");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass-n-Bushes", this.tileset, 0, 0);
        this.spikes = this.map.createLayer("Spikes", this.tileset, 0, 0);
        this.background = this.map.createLayer("Background", this.tileset, 0, 0);
        this.winner = this.map.createLayer("Winner", this.tileset, 0, 0);


        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true,
        });
        this.grassLayer.setCollisionByProperty({
            collides: true,
        });
        this.spikes.setCollisionByProperty({
            death: true,
        });
        this.winner.setCollisionByProperty({
            collides: true,
        });

        const p1Spawn = this.map.findObject("Objects", obj => obj.name === "SpawnPoint")
        my.sprite.player = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, "platformer_characters", "tile_0000.png").setScale(1)
        // set player physics properties
        //my.sprite.player.setCollideWorldBounds(true)

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.grassLayer);
        this.physics.add.collider(my.sprite.player, this.winner, this.winner);
        this.physics.add.collider(my.sprite.player, this.spikes, this.respawn);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(2);

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.flag = this.map.createFromObjects("Objects", {
            name: "WinnerFlag",
            key: "tilemap_sheet",
            frame: 151
        });
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {

            obj2.destroy(); // remove coin on overlap
        });
    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }
    }
}