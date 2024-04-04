import Bulletcontroller from "./bulletController.js";
import InvaderController from "./invaderController.js";
import Player from "./player.js";

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.height=600;
canvas.width=600;

const background = new Image();
background.src="../assets/images/space.png";


const playerBulletController = new Bulletcontroller(canvas,10,"red",true);
const invadersBulletController = new Bulletcontroller(canvas,4,"white",false);
const player = new Player(canvas, 3, playerBulletController);
const invaderController = new InvaderController(canvas,invadersBulletController, playerBulletController);

let isGameOver=false;
let didWin = false;

function game(){
    checkGameOver();
    ctx.drawImage(background, 0,0, canvas.width, canvas.height);
    if(!isGameOver){
        player.draw(ctx);
        invaderController.draw(ctx);
        playerBulletController.draw(ctx);
        invadersBulletController.draw(ctx)
    }else{
        displayGameOver();
    }


}

function displayGameOver() {
    if (isGameOver) {
      let text = didWin ? "You Win" : "Game Over";
      let textOffset = didWin ? 3.5 : 5;
  
      ctx.fillStyle = "white";
      ctx.font = "70px Arial";
      ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
  
    }
  }

function checkGameOver(){
    if(isGameOver){
        return;
    }else if (invadersBulletController.collideWith(player)){
        isGameOver = true;
    }else if(invaderController.collideWith(player)){
        isGameOver = true;
    }else if (invaderController.invadersRow.length===0){
        isGameOver = true;
        didWin = true;
    }
}

setInterval(game, 1000/60);