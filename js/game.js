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
        game.load.tilemap('map', 'assets/purple-level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('level-80', "assets/level-80.png");
    }

    var player; // The player-controlled sprite
    var enemies = [];
    var score = 0;

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
        map.addTilesetImage('level-80'); // 'map' needs to match the Image cache-key
        map.setCollisionBetween(1, 5);
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        // End Part 2 Tilemap Loading

        // Create and add a sprite to the game at the position (2*48 x 6 *48)
        // and using, in this case, the spritesheet 'character'
        new Enemy(3,3, 'left');
        new Enemy(9,3, 'right');
        new Enemy(15,9, 'right');
        new Enemy(20,9, 'left');
        new Enemy(20,3, 'left');
        new Enemy(30,10, 'left');
        player = new Player(7, 3);

        // Set the camera to follow the 'player'
        game.camera.follow(player.sprite);
        updateScore();
    }

    function updateScore(){
      document.querySelector("#score #num").innerHTML= score + " /" + enemies.length;

    }

    function fight(player, enemy){
      score++;
      updateScore();
      enemy.kill();
    }

    function update() {
      enemies.forEach(function(enemy){
        enemy.updateMove();
      });

      player.updateMove()
    }

    var Player = function(x, y){
      playerSprite = game.add.sprite(x * 64, y * 64, 'zombie');
      game.physics.enable(playerSprite);
      playerSprite.body.gravity.y = 800;

      playerSprite.animations.add('left', [7,6,5,4,3,2,1,0], 10, true);
      playerSprite.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
      playerSprite.animations.add('still', [17], 10, true);
      this.sprite = playerSprite;

      this.facing = "left"; // Which direction the character is facing (default is 'left')
      this.normMove = 160; // The amount to move horizontally
      this.rageMove = 360; // The amount to move horizontally
      this.vertMove = -380; // The amount to move vertically (when 'jumping')
      this.jumpTimer = 0; // The initial value of the timer
      this.rageTimer = 0; // The initial value of the timer
    }

    Player.prototype.updateMove = function(){
      playerSprite = this.sprite;
      game.physics.arcade.collide(playerSprite, layer);
      playerSprite.body.velocity.x = 0;

      var hozMove = this.normMove;
      if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        this.rageTimer = this.rageTimer || game.time.now + 650;
        hozMove = this.rageMove;
      }else{
        this.rageTimer = null;
      }

      if(game.time.now > this.rageTimer){
        hozMove = this.normMove;
      }


      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
          playerSprite.body.velocity.x = -hozMove;
          if (this.facing !== "left"){
              this.facing = "left";
          }
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
          playerSprite.body.velocity.x = hozMove;
          if (this.facing !== "right"){
              this.facing = "right";
          }
      }

      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && playerSprite.body.onFloor() && game.time.now > this.jumpTimer){
          playerSprite.body.velocity.y = vertMove;
          this.jumpTimer = game.time.now + 650;
      }

      if (this.facing === "left") {
          playerSprite.animations.play('left');
      } else {
          playerSprite.animations.play('right');
      }
    }

    var Enemy = function(x, y, facing){
      var enemy = game.add.sprite(x * 64, y * 64, 'unicorn');
      game.physics.enable(enemy);
      enemy.body.gravity.y = 400;

      enemy.animations.add('left', [1, 2, 3, 4,5], 5, true);
      enemy.animations.add('right', [6,7,8,9,10], 5, true);

      game.physics.enable(enemy)
      enemies.push(this);
      this.sprite = enemy;
      this.facing = facing;
    }

    Enemy.prototype.updateMove = function(){
      var enemy = this.sprite;
      if(this.facing === "left"){
        this.sprite.animations.play('left');
      }else{
        this.sprite.animations.play('right');
      }
      game.physics.arcade.collide(enemy, layer);
      game.physics.arcade.overlap(player.sprite, enemy, fight, null, this)
    }



}(Phaser));
