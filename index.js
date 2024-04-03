

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.height=600;
canvas.width=600;

const background = new Image();
background.src="assets/images/space.png";

function game(){

    ctx.drawImage(background, 0,0, canvas.width, canvas.height);
    
}

setInterval(game, 1000/60);