var START = 0;
var PLAY = 1;
var END = 2;
var WIN = 3;
var gameState = START;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart,bg1,gc1;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  gc1 = loadImage("gc.jpg");
  bg1  =  loadImage("bg.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  trex = createSprite(50,height-180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;
  ground = createSprite(200,height-70,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 3;
  ground.visible = true;
  ground.velocityX = -(6 + 3*score/100);
  gameOver = createSprite(width/2,height-500);
  gameOver.addImage(gameOverImg);
  restart = createSprite(width/2,height-350);
  restart.addImage(restartImg);
  gameOver.scale = 1.5;
  restart.scale = 1.5;
  gameOver.visible = false;
  restart.visible = false;
  invisibleGround = createSprite(width /2,height-10,width,125);
  invisibleGround.visible = false;
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}

function draw() {
  background(bg1);
  fill("red");
  textSize(30);
  text("Score : "+ score,width-180,50);
  if (gameState===START){
    fill("red");
    text("AVOID OBSTACLES OR YOU WILL HAVEW TO PLAY FROM START",width/6,height/3-100);
    text("SCORE 1000 TO WIN THE GAME",width-925,height/3);
    text("PRESS 'ENTER' TO START",width-860, height-370);
    if(keyDown("enter") && gameState ===START){
      gameState = PLAY;
    }    
  }
  else if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/50);
    text("Objective : 1000 ",width-230,100);
    
      if(touches.length>0||keyDown("space") && trex.y>= height-250) {
      trex.velocityY = -13;
      touches=[];
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles(); 
    if(score >1000){
      gameState = WIN;     
    }
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if(gameState === WIN){
    background(gc1);
    text("CONGRATULATION YOU HAVE FINISHED THE GAME",width/5+30,height/3);
    text("PRESS 'R' TO RESTART",width-850,height/2);
    ground.visible = false;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.visible=false;
    if(keyDown("r")){
      reset();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}


function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width-180,120,40,10);
    cloud.y = Math.round(random(40,height-250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -4; 
    cloud.lifetime = 300;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.depth = restart.depth;
    restart.depth = restart.depth + 1;
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    cloudsGroup.add(cloud);
  } 
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width-50,height-110,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}



function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  ground.visible = true;
  score = 0;
  trex.visible=true;
}