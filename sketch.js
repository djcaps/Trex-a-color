var trex, trex_running,trex_collided;
var ground,groundimg,invisibleground;
var cloud,cloudimg,clouds_group;
var obstacles,obs1,obs2,obs3,obs4,obs5,obs6,obstacle_group;
var GameOver,GameOverimg;
var Restart,Restartimg;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var CheckPS,DieS,JumpS;
var sun,sunAnimation;
var backgroundImg;

function preload(){
  // Precarga una animacion (entre un conjunto de imagenes)
  backgroundImg=loadImage("backgroundImg.png");
  sunAnimation=loadImage("sun.png");
  trex_running = loadAnimation ("trex_1.png", "trex_2.png", "trex_3-1.png");
  trex_collided=loadAnimation("trex_collided-1-1.png");
  //Este es para precargar(imagenes)
  groundimg=loadImage("ground.png");
  cloudimg=loadImage("cloud-1.png");
  obs1=loadImage("obstacle1-1.png");
  obs2=loadImage("obstacle2-1.png");
  obs3=loadImage("obstacle3-1.png");
  obs4=loadImage("obstacle4-1.png");
  obs5=loadImage("obstacle5.png");
  obs6=loadImage("obstacle6.png");
  GameOverimg=loadImage("gameOver-1.png");
  Restartimg=loadImage("restart-1.png");
  //Este es para precargar el sonido
  CheckPS = loadSound ("checkPoint.mp3");
  DieS = loadSound ("die.mp3");
  JumpS = loadSound ("jump.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  //crea el sol
  sun=createSprite(width-50,100,10,10);
  sun.addImage(sunAnimation);
  sun.scale=0.1;
  
  //crea el sprite del trex
  trex = createSprite(60,height-70,20,50);
  //Aquí agrego la animacion precargada a mi trex/sprite
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.09;
  //Configuración para el rayo de colición
  trex.setCollider("circle",0,0,350);
  trex.debug=true;
 
  //Todo lo relacionado para el suelo
  ground=createSprite(width/2,height,width,2);  
  ground.addImage("suelo",groundimg);
  trex.depth=ground.depth;
  trex.depth=trex.depth+1;
  
  //crea el suelo invisible
  invisibleground=createSprite(width/2,height-0,width,125);
  invisibleground.visible=false;
  invisibleground.shapeColor="#f4cbaa";
  
  //Creacion de grupos
  clouds_group = new Group();
  obstacles_group = new Group();
  
  //crea los sprites para Gameover y restart
  GameOver=createSprite(width/2,height/2-50);
  GameOver.addImage(GameOverimg);
  GameOver.scale=0.5;
  GameOver.visible=false;
  Restart=createSprite(width/2,height/2);
  Restart.addImage(Restartimg);
  Restart.scale=0.1;
  Restart.visible=false;
  
  
  score=0;
  
}
 
function draw() {
  background(backgroundImg);
 
 //Añadir puntaje
  stroke("black");
  textSize(30);
  fill("white");
  text("Score: "+score,30,50);
  
  
  if (gameState===PLAY){
    //velocidad del suelo aumenta de acuerdo a mi score 
    ground.velocityX=-(3+2*score/100);
      score=score+Math.round(getFrameRate()/60); 
    // Aquí mi sonido de CheckPS se reproduce cada 250 puntos de mi score  
    if (score>0 && score%250===0){
        CheckPS.play();
      }
     //Condición para hacer el suelo infinito
      if(ground.x<0){
         ground.x=ground.width/2;
      }
    //Aquí mi trex no puede saltar cuando este sea mayor a 150
    if(touches.length>0||keyDown("space")&&trex.y>=height-120){
         trex.velocityY = -10;
         JumpS.play();
         touches=[];
      }
    //Asigna mi gravedad
    trex.velocityY = trex.velocityY + 0.5;
       //Aparecen las nubes
       spawnClouds();
       //Aparecen los obstaculos
       spawnObstacles();
       if(trex.isTouching(obstacles_group)){
         gameState=END;
         DieS.play();
       }
  }
  else if(gameState===END){
      ground.velocityX=0;
      clouds_group.setVelocityXEach(0);
      //cambia la animacioon del trex
      trex.changeAnimation("collided",trex_collided);
      obstacles_group.setVelocityXEach(0);
      //establece el ciclo de vida de los objetos     para que nunca sean destruidos
      obstacles_group.setLifetimeEach(-1);
      clouds_group.setLifetimeEach(-1);
      trex.velocityY=0;
      GameOver.visible=true;
      Restart.visible=true;
      if(touches.lenghth>0||keyDown("SPACE")||mousePressedOver(Restart)){
        reset();
        touches=[];
      }
 } 
  
  trex.collide(invisibleground);
  
  
 
  drawSprites();
  
}
function spawnClouds(){
  if(frameCount%60===0){
    cloud=createSprite(width+20,height-300,40,10);
    cloud.velocityX=-3;
    cloud.y=Math.round(random(100,220));
    cloud.addImage(cloudimg);
    cloud.scale=0.6;
    //tiempo de vida para las nubes
    cloud.lifetime=450;
    //Ajusta la profundidad
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    //Añade cada nube al grupo de nubes
    clouds_group.add(cloud);
  }
}
function spawnObstacles(){
  if(frameCount%60===0){
    obstacles=createSprite(1200,height-95,20,30);
   // aumenta la velocidad de los obstaculos dependiendo el score
    obstacles.velocityX=-(6+score/100);
    //Genera ostaculos al azar
    var rand=Math.round(random(1,2));
    switch(rand){
      case 1: obstacles.addImage(obs1);
        break;
      case 2: obstacles.addImage(obs2);
        break;
      //case 3: obstacles.addImage(obs3);
       // break;
     // case 4: obstacles.addImage(obs4);
       // break;
     // case 5: obstacles.addImage(obs5);
       // break;
      //case 6: obstacles.addImage(obs6);
        //break;
        default: break;  
    }
    //Asigna una escala
    obstacles.scale=0.5;
    //Asigna tiempo de vida
    obstacles.lifetime=230;
    //Añade cada obstaculo a cada grupo de obstaculos
    obstacles_group.add(obstacles);
  }
}
function reset(){
  gameState=PLAY;
  GameOver.visible=false;
  Restart.visible=false;
  obstacles_group.destroyEach();
  clouds_group.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
  
}
