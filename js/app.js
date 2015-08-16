// each tile is 101px wide
var tileWidth = 101;
// each tile is 83px high
var tileHeight = 83;
// boundry location of the game character in the stage
var leftBoundry = 0;
var upBoundry = tileHeight;
var rightBoundry = tileWidth * 4;
var downBoundry = 390;
// initially select character that correspond to 0
var player1Character = 0;
// initially select character that correspond to 4
var player2Character = 4;
// Upon choosing characters from the the menu selection we need to clean up the input twice
var removeOldInput = 2;
// isReset variable will determine if game needs to display game character selection screen before
// jumping into to main game
var isReset = true;
var isRestartButton = true;
/*
* Enemy class displays bug images and calculate its movement.
*/
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // initial x position of bug should be outside of the game stage
    this.x = -100;
    // initial y position of bug should be in a random row within stone block area
    this.y = (tileHeight-20) + Math.floor(Math.random() * 3) * tileHeight;
    // the speed is in following range: (100 <= speed < 800)
    this.speed = 100 + Math.floor(Math.random() * 7) * 100;
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // if the bug moved outside of right boundry reset bug location to the left
    if(this.x >=tileWidth * 5 + 100) {
        this.x = -100;
        this.y = (tileHeight - 20) + Math.floor(Math.random() * 3) * tileHeight;
        this.speed = 100 + Math.floor(Math.random() * 7) * 100;
    }
    // multiply dt by the speed calculated when initialized or reset
    else {
        this.x += dt * this.speed;
    }
    // check if a bug collide with each player
    for (var i=0; i<players.length; i++) {
        // check if a bug and player are in the same column
        if(players[i].y - this.y  < 20 && players[i].y - this.y  > -10 ) {
            // check if any parts of x position of bug is within the range of player image
            if(players[i].x -this.x  < 77 && players[i].x - this.x  > -80 ) {
                //remove a heart of the player
                players[i].hearts.life--;
                // if player has spare heart, reset its location
                if(players[i].hearts.life > 0) {
                    //relocate player
                    players[i].x = tileWidth * 2;
                    players[i].y = 390;
                }
            }
        }
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/*
* Player class display its choosen character and draw its move its character location
* upon user interaction
*/
var Player = function(playerNumber, col) {
    this.sprite = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    this.x = tileWidth * (col - 1);
    this.y = 390;
    this.currentKey = null;
    this.playerNumber = playerNumber;
    this.hearts;
    this.score;
};
// handle keyboard input and update player's location
Player.prototype.update = function() {
    // ignore the key pressed from selecting character initially
    // since this is two player game, we need to ignore the key press twice
    if(removeOldInput != 0 ){
        removeOldInput--;
    }
    // update location of the player1 upon user interaction
    else if(this.playerNumber == 1) {
        // move left
        if(this.currentKey == 'a' && this.x > leftBoundry) {
            this.x -= tileWidth;
        }
        // move to up
        else if(this.currentKey == 'w' && this.y > upBoundry) {
            this.y -= tileHeight;
        }
        // move ight
        else if(this.currentKey == 'd' && this.x < rightBoundry) {
            this.x += tileWidth;
        }
        // move down
        else if(this.currentKey == 's' && this.y < downBoundry) {
            this.y += tileHeight;
        }
    }
    // update location of the player2 upon user interaction
    else if(this.playerNumber == 2) {
        // move left
        if(this.currentKey == 'left' && this.x > leftBoundry) {
            this.x -= tileWidth;
        }
        // move up
        else if(this.currentKey == 'up' && this.y > upBoundry) {
            this.y -= tileHeight;
        }
        // move right
        else if(this.currentKey == 'right' && this.x < rightBoundry) {
            this.x += tileWidth;
        }
        // move down
        else if(this.currentKey == 'down' && this.y < downBoundry) {
            this.y += tileHeight;
        }
    }
    // clean up the user key code for the next interaction
    this.currentKey = null;
};
// render choosen character
Player.prototype.render = function() {
    // draw player1 character
    if(this.playerNumber == 1){
        ctx.drawImage(Resources.get(this.sprite[player1Character]), this.x, this.y);
    }
    // draw player2 character
    else {
        ctx.drawImage(Resources.get(this.sprite[player2Character]), this.x, this.y);
    }
};
Player.prototype.handleInput = function(keyString) {
    // check if the keyboard input was what the game supports
    if(keyString != undefined) {
        this.currentKey = keyString;
    }
};
/*
* Display gem within random location within stone blocks
*
*/
var Gem = function() {
    //store array of gem images
    this.gems = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
    //randomly pick gem image from gems array
    this.sprite = this.gems[Math.floor(Math.random() * 3)];
    // Gem must be displayed anywhere on the stone block
    // calculate the random x location of the Gem within the stone block
    this.x = tileWidth * Math.floor(Math.random() * 5);
    // calculate the random y location of the Gem within the stone block
    this.y = tileHeight * (Math.floor(Math.random() * 3) + 1) - 30;
};
Gem.prototype.update = function() {
    //loop through each players to check collision
    for(i=0; i< players.length; i++) {
        //if the gem is in the same column where the player is move to next condition
        if(players[i].y -this.y  < 20 && players[i].y - this.y  > -10 ) {
            //if the gem is in the same block update
            if(players[i].x - this.x < 20 && players[i].x - this.x > -10) {
                //update score for the player
                players[i].score.isScoreNeedUpdate = true;
                //pick random color of the gem
                this.sprite = gem.gems[Math.floor(Math.random() * 3)];
                // make sure the location of the gem is not the same as previous gem to prevent
                // double score
                var sameLocation = true;
                var tempX;
                var tempY;
                while(sameLocation) {
                    tempX = tileWidth * Math.floor(Math.random() * 5);
                    tempY = tileHeight * (Math.floor(Math.random() * 3) + 1) - 30;
                    if(this.x != tempX || this.y != tempY) {
                        //relocate the gem
                        this.x = tileWidth * Math.floor(Math.random() * 5);
                        // calculate the random y location of the Gem within the stone block
                        this.y = tileHeight * (Math.floor(Math.random() * 3) + 1) - 30;
                        sameLocation = false;
                    }
                }
            }
        }
    }
};
// render gem
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/*
* Display score for each player and update appropriate score
*
*/
var Score = function(x) {
    this.x = x;
    this.y = 40;
    // number of gems to collect is 11 but update to 10 as soon as the game starts
    this.numOfGems = 11;
    // flag to determine if score is needed to be updated
    this.isScoreNeedUpdate = true;
};
// update score
Score.prototype.update = function() {
    // if score needs to be updated update score
    if(this.isScoreNeedUpdate) {
        this.numOfGems--;
    }
};
// render score if neeeded
Score.prototype.render = function(playerNumber) {
    // is score needs to be updated, display updated score
    if(this.isScoreNeedUpdate) {
        // redraw black background behind score to clean up the old score
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x,25,220,20);
        // redraw black background behind player (1/2) letters
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x,5,80,20);
        ctx.font='20px Georgia';
        ctx.fillStyle = 'white';
        // Player (1/2):
        ctx.fillText('Player' + playerNumber + ':', this.x, 20);
        // score
        ctx.fillStyle = 'yellow';
        ctx.fillText(this.numOfGems, this.x, this.y);
        // explanation
        ctx.fillStyle = 'white';
        ctx.fillText('more gems to collect!', this.x + 23, 40);
        //reset to false to prevent update on next cycle
        this.isScoreNeedUpdate = false;
    }
};
/*
*  Display number of hearts for each player
*
*/
var Heart = function(x) {
    this.sprite = ['images/Heart.png'];
    this.x = x;
    this.y = tileHeight * 7 - 10;
    // life of a character is set to 3
    this.life = 3;
};
// render heart
Heart.prototype.render = function() {
    // create temp heart variable to store the current first heart's location
    var tempHeartX = this.x;
    // draw black background behind heart to clean up hearts from last cycle
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x,this.y + 21,150,50);
    // draw correct number of heart for a player
    for(i=0; i<this.life; i++) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 75);
        this.x += 45;
    }
    this.x = tempHeartX;
};
/*
* Display game over screen upon game ends
*
*/
var Gameover =  function() {
    this.isGameOver = false;
    this.isWon = false;
};
// render game over page
Gameover.prototype.render = function() {
    var winner = 0;
    for(i=0; i< players.length; i++) {
        if(players[i].score.numOfGems == 0) {
            winner = players[i];
            this.isWon = true;
            break;
        }
        if(players[i].hearts.life <= 0) {
           //remove the player from the players array
           players.splice(i,1);
        }
    }
    // if players array is empty it means player lost all hearts
    if(players.length == 0) {
        this.isGameOver = true;
    }
    // display game over page
    if(this.isGameOver) {
        ctx.globalAlpha = 1.0;
        ctx.font='60px Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Game Over', 115, 200);
        ctx.globalAlpha = 0.2;
        if(isRestartButton) {
            // display restart button
            $(".restart").toggle();
            isRestartButton = false;
        }
    }
    // else display which player won
    else if(this.isWon) {
        ctx.globalAlpha = 1.0;
        ctx.font='60px Georgia';
        ctx.fillStyle = 'black';
        ctx.fillText('Player ' + winner.playerNumber + ' Won!', 70, 200);
        ctx.globalAlpha = 0.2;
        for(i=0; i< players.length; i++) {
            //make sure player does not collide against bug when the game is over
            players[i].x = -100;
            players[i].y = -500;
        }
        if(isRestartButton) {
            // display restart button
            $(".restart").toggle();
            isRestartButton = false;
        }
    }
};
/*
* main game: initialze necessary objects to play game on the stage
*
*/
//select character
// Now instantiate your objects.
// place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
// place the player 1 object in a variable called player
var player1 = new Player(1,2);
// assign heart object to player1
player1.hearts = new Heart(0);
// assign socre object to player1
player1.score  = new Score(0);
// place the player 2 object in a variable called player
var player2 = new Player(2,4);
//  heart object to player2
player2.hearts = new Heart(360);
//  score object to player2
player2.score  = new Score(290);
// array contains player1 and player2 object. useful for iterating each player throughout code
var players = [player1, player2];
// create gem object
var gem = new Gem();
// create gameover object
var gameover = new Gameover();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a',
        68: 'd',
        83: 's',
        87: 'w'
    };
    // prevent scroll up or down
    if (e.keyCode == 38 || e.keyCode == 40) {
        e.preventDefault();
    }
    // iterate each player and handle key input
    players.forEach(function(player) {
            player.handleInput(allowedKeys[e.keyCode]);
    });
});