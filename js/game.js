(function (Phaser) {

    var game = new Phaser.Game(
            900, 600, // The width and height of the game in pixels
            Phaser.AUTO, // The type of graphic rendering to use
            // (AUTO tells Phaser to detect if WebGL is supported.
            //  If not, it will default to Canvas.)
            'phaser', // The parent element of the game
            {
                preload: preload, // The preloading function
                create: create, // The creation function
                update: update   // The update (game-loop) function
            }
    );

    function preload() {
        // Load the spritesheet 'character.png', telling Phaser each frame is 40x64
        game.load.spritesheet('unicorn', 'assets/unicorn-sprite-less.png', 150, 150);
        game.load.spritesheet('zombie', 'assets/zombie-sprite-70.png', 69, 70);
        // game.load.atlasJSONHash('zombie', 'assets/zomb.png', 'assets/zomb.json')

        //Start Part 2
        game.load.tilemap('map', 'assets/map3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('level', "assets/level.png");
    }

    var player; // The player-controlled sprite
    var enemy; // The player-controlled sprite
    var facing = "left"; // Which direction the character is facing (default is 'left')
    var hozMove = 160; // The amount to move horizontally
    var vertMove = -380; // The amount to move vertically (when 'jumping')
    var jumpTimer = 0; // The initial value of the timer

    //Start Part 2
    var map;
    var layer;

    function create() {

        // Make the background color of the game's stage
        game.stage.backgroundColor = '#ffb6c1';

        // Start the physics system ARCADE
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Start Part 2 Tilemap Loading
        map = game.add.tilemap('map'); // 'map' needs to match the Tilemap cache-key
        map.addTilesetImage('level'); // 'map' needs to match the Image cache-key
        map.setCollisionBetween(1, 5);
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        // End Part 2 Tilemap Loading

        // Create and add a sprite to the game at the position (2*48 x 6 *48)
        // and using, in this case, the spritesheet 'character'
        player = game.add.sprite(7 * 64, 3 * 64, 'zombie');
        enemy = game.add.sprite(3 * 64, 3 * 64, 'unicorn');
        // enemy2 = game.add.sprite(9 * 64, 4 * 64, 'unicorn');

        // By default, sprites do not have a physics 'body'
        // Before we can adjust its physics properties,
        // we need to add a 'body' by enabling
        // (As a second argument, we can specify the
        //  physics system to use too. However, since we
        //  started the Arcade system already, it will
        //  default to that.)
        game.physics.enable(player);
        game.physics.enable(enemy);
        // game.physics.enable(enemy2);

        // We want the player to collide with the bounds of the world
        // player.body.collideWorldBounds = true;

        // Set the amount of gravity to apply to the physics body of the 'player' sprite
        player.body.gravity.y = 800;
        enemy.body.gravity.y = 400;

        enemy.animations.add('left', [1, 2, 3, 4,5], 5, true);
        enemy.animations.add('right', [6,7,8,9,10], 5, true);

        player.animations.add('left', [7,6,5,4,3,2,1,0], 10, true);
        player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        player.animations.add('still', [17], 10, true);

      scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // Set the camera to follow the 'player'
        game.camera.follow(player);

    }

    function fight(player, enemy){
      console.log("enemy");
      enemy.kill();
    }

    function update() {

        // Start of Part 2 Player-Layer collision
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(enemy, layer);

        game.physics.arcade.overlap(player, enemy, fight, null, this)
        // End of Part 2 Player-Layer collision

        // Reset the x (horizontal) velocity
        player.body.velocity.x = 0;

        // Check if the left arrow key is being pressed
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            // Set the 'player' sprite's x velocity to a negative number:
            //  have it move left on the screen.
            player.body.velocity.x = -hozMove;

            // Check if 'facing' is not "left"
            if (facing !== "left")
            {
                // Set 'facing' to "left"
                facing = "left";
            }
        }
        // Check if the right arrow key is being pressed
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            // Set the 'player' sprite's x velocity to a positive number:
            //  have it move right on the screen.
            player.body.velocity.x = hozMove;

            // Check if 'facing' is not "right"
            if (facing !== "right")
            {
                // Set 'facing' to "right"
                facing = "right";
            }
        }

        // Check if the jumpButton (SPACEBAR) is down AND
        //  if the 'player' physics body is onFloor (touching a tile) AND
        //  if the current game.time is greater than the value of 'jumpTimer'
        //  (Here, we need to make sure the player cannot jump while alreay in the air
        //   AND that jumping takes place while the sprite is colliding with
        //   a tile in order to jump off it.)
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.body.onFloor() && game.time.now > jumpTimer)
        {
            // Set the 'player' sprite's y velocity to a negative number
            //  (vertMove is -90) and thus have it move up on the screen.
            player.body.velocity.y = vertMove;
            // Add 650 and the current time together and set that value to 'jumpTimer'
            // (The 'jumpTimer' is how long in milliseconds between jumps.
            //   Here, that is 650 ms.)
            jumpTimer = game.time.now + 650;
        }

        // Check if 'facing' is "left"
        if (facing === "left") {
            // Set the 'player' to the second (1) frame
            //  ('facing' is "left")
            // player.frame = 1;
            player.animations.play('left');
        } else {
            // Set the 'player' to the first (0) frame
            //  ('facing' is "right").
            // player.frame = 0;
            player.animations.play('right');
        }
            enemy.animations.play('left');




    }

}(Phaser));
