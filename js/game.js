(function (Phaser) {

    var game = new Phaser.Game(
            900, 550, // The width and height of the game in pixels
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
        game.load.spritesheet('zombie', 'assets/zombie-rage-red-sprite.png', 69, 70);
        // game.load.atlasJSONHash('zombie', 'assets/zomb.png', 'assets/zomb.json')

        //Start Part 2
        game.load.tilemap('map', 'assets/long-level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('level-80', "assets/level-80.png");
    }

    var player; // The player-controlled sprite
    var enemies = [];
    var score = 0;
    var gameIsOver = true;
    var gameIsWon = false;
    var nudgeGiven = false;

    //Start Part 2
    var map;
    var layer;

    function startGame(){
      enemies.forEach(function(enemy){
        enemy.sprite.kill()
      });
      enemies = [];
      new Enemy(216,200, 'left');
      new Enemy(992,200, 'right');
      new Enemy(340,500, 'right');
      new Enemy(1232,400, 'right');
      new Enemy(1356,100, 'left');
      new Enemy(2076,500, 'right');
      new Enemy(2104,100, 'right');
      new Enemy(2436,300, 'right');
      new Enemy(2524,500, 'left');
      new Enemy(3400,300, 'right');
      new Enemy(3540,100, 'left');
      new Enemy(3956,100, 'right');
      new Enemy(4020,500, 'right');
      new Enemy(4588,500, 'left');
      gameIsOver = false;
      if(player){
        player.sprite.kill();
        player = null;
      }
      player = new Player(6, 5);
      game.camera.follow(player.sprite);
      updateLives();
      document.querySelector("#directions").className = "hide";
      document.querySelector("#textScreen").className = "hide";
      score = 0
      updateScore();
    }


    function create() {
      document.querySelector("#start").onclick = function(){
        startGame();
      }
        document.onkeypress = function(){
          if(gameIsOver){
            startGame();
          }
        }

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

        // Set the camera to follow the 'player'
    }

    function updateScore(){
      document.querySelector("#score #num").innerHTML= score + " /" + enemies.length;
    }
    function updateLives(){
      document.querySelector("#lives #num").innerHTML= Array(player.lives+1).join(" &#9829");
    }

    function gameOver(){
      document.querySelector("#textScreen").innerHTML= "Game Over <div class='sub'>spacebar to restart</div>";
      document.querySelector("#textScreen").className = "";
      gameIsOver = true;
    }

    function youWin(){
      document.querySelector("#textScreen").innerHTML= "You Win!";
      document.querySelector("#textScreen").className = "";
      gameIsWon = true;
    }

    function fight(playerSprite, enemy){
      if(player.isRaging){
        score++;
        updateScore();
        enemy.kill();
      }else{
        if(!player.gettingHurt){
          player.lives--;
          updateLives()
          // playerSprite.tint = Math.random() * 0xffffff;
          player.gettingHurt = true;
          window.setTimeout(function(){
            player.gettingHurt = false;
          }, 1000);
        }
        if(player.lives === 0){
          gameOver();
        }
      }

      if(score === enemies.length){
        gameIsOver = true;
        youWin();
      }
    }

    function update() {
      enemies.forEach(function(enemy){
        enemy.updateMove();
      });

      if(player){
        player.updateMove()
      }
    }

    var Player = function(x, y){
      playerSprite = game.add.sprite(x * 64, y * 64, 'zombie');
      game.physics.enable(playerSprite);
      playerSprite.body.gravity.y = 800;

      playerSprite.animations.add('left', [7,6,5,4,3,2,1,0], 10, true);
      playerSprite.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
      playerSprite.animations.add('still', [17], 10, true);
      playerSprite.animations.add('rageLeft', [19, 20, 21, 22, 23, 24, 25, 26], 10, true);
      playerSprite.animations.add('rageRight', [27, 28, 29, 30, 31, 32, 33, 34], 10, true);
      playerSprite.animations.add('dead', [18], 10, true);
      this.sprite = playerSprite;

      // this.facing = "still"; // Which direction the character is facing (default is 'left')
      this.normMove = 160; // The amount to move horizontally
      this.rageHitMove = 360; // The amount to move horizontally
      this.vertMove = -380; // The amount to move vertically (when 'jumping')
      this.jumpTimer = 0; // The initial value of the timer
      this.rageTimer = 0; // The initial value of the timer
      this.rageHit = false;
      this.isRaging = false;
      this.lives = 3;
      this.gettingHurt = false;
      this.lastFacing = "left";
    }

    Player.prototype.updateMove = function(){
      playerSprite = this.sprite;
      game.physics.arcade.collide(playerSprite, layer);
      playerSprite.body.velocity.x = 0;

      if (playerSprite.bottom >= game.world.height) {
          gameOver();
      }

      if(!gameIsOver){
        movePlayer(this);
      }else{
        if(gameIsWon){
          this.sprite.animations.play('still');
          this.sprite.tint = 0xffffff;
        }else{
          this.sprite.animations.play('dead');
          this.sprite.tint = 15833293.907824585;
        }
      }

    }

    function movePlayer(thisP){
      if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        if(!thisP.rageHit){
          thisP.rageHit = true;
          thisP.rageTimer = game.time.now + 650;
        }
      }else{
        player.rage = false;
        thisP.rageHit = false;
      }

      thisP.isRaging = (thisP.rageHit && game.time.now < thisP.rageTimer);

      var hozMove = thisP.normMove;
      if(thisP.isRaging){
        hozMove = thisP.rageHitMove;
      }


      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
          playerSprite.body.velocity.x = -hozMove;
          if (thisP.facing !== "left"){
              thisP.facing = "left";
              thisP.lastFacing = "left";
          }
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
          playerSprite.body.velocity.x = hozMove;
          if (thisP.facing !== "right"){
              thisP.facing = "right";
              thisP.lastFacing = "right";
          }
      }else{
        thisP.facing = "front";
      }


      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && playerSprite.body.onFloor() && game.time.now > thisP.jumpTimer){
          playerSprite.body.velocity.y = thisP.vertMove;
          thisP.jumpTimer = game.time.now + 650;
      }

      if (thisP.facing === "left") {
        if(thisP.isRaging){
          playerSprite.animations.play('rageLeft');
        }else{
          playerSprite.animations.play('left');
        }
      } else if (thisP.facing === "right") {
        if(thisP.isRaging){
          playerSprite.animations.play('rageRight');
        }else{
          playerSprite.animations.play('right');
        }      }else{
          if(game.time.now > thisP.jumpTimer){
            if(thisP.isRaging){
              playerSprite.animations.play('rageRight');
            }else{
              playerSprite.animations.play('still');
            }
          }else if(thisP.lastFacing === "right"){
            playerSprite.animations.play('right');
          }else{
            playerSprite.animations.play('left');
          }
      }

      if(thisP.gettingHurt){
        if(!nudgeGiven){
          nudgeGiven = true;
          document.querySelector("#nudgeInstructions").className = "";
          setTimeout(function(){
            document.querySelector("#nudgeInstructions").className = "hide";
          }, 6000);
        }
        if(Math.random() >= 0.5){
          thisP.sprite.tint = 15833293.907824585;
        }else{
          thisP.sprite.tint = 0xffffff;
        }
      }else{
        thisP.sprite.tint = 0xffffff;
      }
    }

    var Enemy = function(x, y, facing){
      var enemy = game.add.sprite(x, y, 'unicorn');
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
      if(!gameIsOver){
        game.physics.arcade.overlap(player.sprite, enemy, fight, null, this)
      }
    }



}(Phaser));
