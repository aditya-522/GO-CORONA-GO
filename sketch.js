var PLAY = 1;
var END = 0;
var gameState = PLAY;

var man, man_running, man_collided;
var ground, groungImage, invisibleground;
var cloudsGroup, cloudImage, obstacle, obstacleImage, obstacleGroup;
var obstacle, mask, maskImage, maskGroup;
var score=0;

var gameOver, restart;

var token = 0

function preload(){
  man_running =   loadAnimation("running1.jpg","running2.jpg","running3.jpg","running4.jpg");
  man_collided = loadAnimation("running5.jpg","running6.jpg","running7.jpg");
  
  groundImage = loadImage("ground2.png");
  maskImage = loadImage("mask.jpg");
  cloudImage = loadImage("cloud.png");
  obstacleImage=loadImage("corona.PNG");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  canvas = createCanvas(displayWidth - 20, displayHeight-30);
  man = createSprite(50,150,40,50);
  
  man.addAnimation("running", man_running);
  man.addAnimation("collided", man_collided);
  man.scale = 0.8;
  
 
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(750,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(750,120);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstacleGroup = new Group();
  maskGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("white");
  
  fill("black");
  text("Score: "+ score, 1400,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("UP_ARROW") && man.y >= 140) {
      man.velocityY = -12;
    }
  
    man.velocityY = man.velocityY + 0.8
  
    if (ground.x < 0){
     ground.x = ground.width/2;
    }
  
    man.collide(invisibleGround);
    spawnClouds();
    spawnobstacle();
    
    //callong the function mask 
    if(token === 0){
      mask();
      if (man.isTouching(maskGroup)){
        maskGroup.destroyEach();
        maskGroup.Lifetime=0;  
        man.changeAnimation("collided",man_collided)

        token = token +1
        console.log(token)
       }
    
    }  
   
    if(obstacleGroup.isTouching(man)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    man.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    maskGroup.setVelocityXEach(0)
    
    //set lifetime of the game objects so that they are never destroyed
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     maskGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
    
  }

  drawSprites();

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = man.depth;
    man.depth = man.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
  maskGroup.destroyEach();
  man.changeAnimation("running", man_running);
  
  score = 0;
  token = 0;

}

function spawnobstacle() {
  if(frameCount % 80    === 0) {
    var obstacle = createSprite(800,180,10,40);
    obstacle.velocityX = -6;
    
    //add image to the obstacle 
    obstacle.addImage(obstacleImage);
    obstacle.scale=0.2
    
    //lifetime to the obstacle     
    obstacle.lifetime = 300;
    
    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}

function mask(){
   if (score>0 && score % 350=== 0) {
      var mask = createSprite(400 ,100,40,10);

      mask.addImage(maskImage);
      mask.scale = 0.5 ;
      mask.velocityX = -3;

      //assign lifetime to the variable
      mask.lifetime = 400;

      //adjust the depth
      mask.depth = man.depth;
      man.depth = man.depth + 1;

      //add each cloud to the group
      maskGroup.add(mask);
  }   
}









