// Images, Buttons, Animations, and Sounds
var arrow;
var asteroidImg;
var coinImg, moonRockImg;
var rocketImg;
var spaceBg, menuBg;
var playBtnImg;

var music;
var coinSnd;
var dieSnd;

// Sprites
var asteroid;
var coin, moonRock;
var player;
var gameBg, gameBgScroll;
var playBtn;

// Groups
var asteroidGrp;
var collectableGrp;

// Game
var gameState = 1;
var slide = 1;
var moonRockCount = 0;
var score = 0;


// Load all assets for later use
function preload() {
  arrow = loadImage("assets/arrow.png");
  asteroidImg = loadImage("assets/asteroid.png");
  moonRockImg = loadImage("assets/moonRock.png");
  rocketImg = loadImage("assets/rocket.png");
  playBtnImg = loadImage("assets/playBtn.png");

  coinImg = loadAnimation("assets/coin1.png", "assets/coin2.png", "assets/coin3.png", "assets/coin4.png");
  menuBg = loadAnimation("assets/mainMenuBg.png");
  spaceBg = loadAnimation("assets/spaceBg.png");

  music = loadSound("assets/music.mp3");
  dieSnd = loadSound("assets/death.mp3")
  coinSnd = loadSound("assets/coinCollect.mp3")
}

// Runs on start
function setup() {
  createCanvas(1200, 800);

  music.loop()
  music.setVolume(0.5)

  gameBg = createSprite(width / 2, height / 2, width, height);
  gameBg.addAnimation("menu", menuBg);
  gameBg.addAnimation("space", spaceBg)

  gameBgScroll = createSprite(width+width/2, height / 2, width, height);
  gameBgScroll.addAnimation("space", spaceBg)
  gameBgScroll.visible = false;

  playBtn = createSprite(600, 600, 20, 20);
  playBtn.addImage(playBtnImg);
  playBtn.scale = 0.5;
  playBtn.visible = false;

  player = createSprite(200, 400, 20, 20);
  player.addImage(rocketImg);
  player.scale = 0.5
  player.visible = false;
  player.setCollider("rectangle", 90, 0, 250, 150)

  asteroidGrp = new Group();
  collectableGrp = new Group();
}

// Runs every frame
function draw() {
  background(255, 0, 0);
  drawSprites();

  if (gameState == 1) {
    gameBg.changeAnimation("menu");

    textAlign(CENTER, CENTER)
    fill("white")
    stroke("black")
    strokeWeight(7)

    textSize(35)
    if(slide < 6){
      text("Press SPACE to continue", 600, 775)
    }

    textSize(45)
    if(slide == 1){
      text("You have been chosen to go to the moon.", 600, 400)
    }
    if(slide == 2){
      text("You will have to control the rocket.", 600, 400)
    }
    if(slide == 3){
      text("There will be many obstacles you have to avoid.", 600, 400)
    }
    if(slide == 4){
      text("At the moon you will have to collect samples", 600, 400)
    }
    if(slide == 5){
      text("The samples you have to collect are moon rocks and coins.", 600, 400)
    }
    if(slide == 6){
      text("But be aware of the danger that lurks.", 600, 400)
      playBtn.visible = true;
    }

    if(mousePressedOver(playBtn)){
      gameState = 2;
      playBtn.visible = false;
    }
  }

  if(gameState > 1){
    gameBg.changeAnimation("space")
  }

  if(gameState == 2){
    
    player.visible = true
    gameBgScroll.visible = true

    textSize(40)
    textAlign(CENTER, CENTER)
    fill("white")
    stroke("black")
    strokeWeight(5)

    text("SCORE: " + score, 600, 100)

    // Scroll background
    gameBg.velocityX = -4;
    gameBgScroll.velocityX = -4;
    if(gameBg.x == -width/2){
      gameBg.x = width/2
    }
    if(gameBgScroll.x < width/2){
      gameBgScroll.x = width;
    }
    
    if(moonRockCount == 1){
      textSize(16)
      textAlign(CENTER, CENTER)
      fill("white")
      stroke("black")
      strokeWeight(4)
     
        text("You can also collect these!", moonRock.x, moonRock.y - 25)
   
      
    }

    // Player movement
    if(player.y <= 43){
      player.y = 43
    } else if(player.y >= 757){
      player.y = 757
    }
    
    if(keyDown(87) || keyDown(38)){ // Up
      player.y -= 7;
    } else if(keyDown(83) || keyDown(40)){ // Down
      player.y += 7;
    }

    spawnObstacles();
    spawnCollectables()
    checkCollision();
  }

  if(gameState == 3){
    player.visible = false
    gameBgScroll.visible = false
    gameBg.velocityX = 0;
    gameBg.x = width/2;
  

    asteroidGrp.destroyEach();
    collectableGrp.destroyEach();
    moonRockCount = 0;

    textAlign(CENTER, CENTER)
    fill("white")
    stroke("black")

    textSize(150)
    strokeWeight(17)
    text("GAME OVER!", 600, 342)

    textSize(75)
    strokeWeight(12)
    text("You scored: " + score, 600, 458)

    textSize(35)
    strokeWeight(7)
    text("Press SPACE to play again", 600, 775)

    
  }
}

function checkCollision(){
  if(asteroidGrp.isTouching(player)){
    gameState = 3;
    dieSnd.play()
  }
  for(var i = 0; i < collectableGrp.length; i++){
    if(collectableGrp.get(i).isTouching(player)){
      score += Math.round(random(2, 5));
      collectableGrp.get(i).destroy();
      coinSnd.play();
    }
  }

  // if(collectableGrp.isTouching(player)){
  //   score += Math.round(random(2, 5));
  // }
}

function spawnObstacles(){
  if(frameCount%120 == 0){
    asteroid = createSprite(1200, 300);
    asteroid.addImage(asteroidImg);
    asteroid.scale = random(0.2, 0.4);
    asteroid.velocityX = -(4 + Math.round(score/30));
    asteroid.lifetime = 300;
    asteroid.y = Math.round(random(0, 800));
    asteroidGrp.add(asteroid);
  }
}

function spawnCollectables(){
  if(frameCount%120 == 0){
    coin = createSprite(1200, 300);
    coin.addAnimation("coin", coinImg);
    coin.velocityX = -4;
    coin.scale = 0.4
    coin.lifetime = 300;
    coin.y = Math.round(random(0, 800));

    collectableGrp.add(coin);

    if(asteroidGrp.isTouching(coin)){
      coin.destroy()
    }
  }
  if(frameCount%260 == 0){
    moonRockCount ++;

    moonRock = createSprite(1200, 300);
    moonRock.addImage(moonRockImg);
    moonRock.scale = 0.4
    moonRock.velocityX = -4;
    moonRock.lifetime = 300;
    moonRock.y = Math.round(random(0, 800));

    collectableGrp.add(moonRock);

    if(asteroidGrp.isTouching(moonRock)){
      moonRock.y -= 150;
    }
  }
}

function keyReleased() {
  if(gameState == 1){
    if(keyCode == 32 && slide < 6){
      slide += 1;
    }
  }
  if(gameState == 3){
    if(keyCode == 32){
      gameState = 2;
      score = 0;
    }
  }
}