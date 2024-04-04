import Invader from "./invader.js";
import MovingDirection from "./movingDirection.js";

export default class InvaderController {
    currentDirection = MovingDirection.right;
    xVelocity=0;
    yVelocity=0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    fireBulletTimerDefault = 100;
    fireBulletTimer =this.fireBulletTimerDefault;

    moveDownTimerDefault = 30;
    moveDownTimer = this.moveDownTimerDefault;

    invaderMap = [
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,2,2,3,3,2,2,1,1],
        [1,1,1,2,1,1,2,1,1,1],
        [1,1,1,2,1,1,2,1,1,1],
        [1,1,1,1,1,1,1,1,1,1]     
    ]

    invadersRow = [];

    constructor(canvas, invaderBulletcontroller, playerBulletController) {
        this.canvas = canvas;
        this.invaderBulletController = invaderBulletcontroller;
        this.playerBulletController = playerBulletController;

        this.createInvaders();
      }

    draw(ctx){
        this.decrementMoveDownTimer();
        this.drawInvaders(ctx);
        this.updateVelocityAndDirection();
        this.resetMoveDownTimer();
        this.fireBullet();
        this.collisionDetection();
    }

    drawInvaders(ctx){
        this.invadersRow.flat().forEach((invader)=>{
            invader.draw(ctx);
            invader.move(this.xVelocity, this.yVelocity);
        })
    }

    createInvaders(){
        this.invaderMap.forEach((row, rowIndex)=>{
            this.invadersRow[rowIndex]=[];
            row.forEach((invaderNumber, invaderIndex)=>{
                if(invaderNumber>0){
                    this.invadersRow[rowIndex].push(
                        new Invader(invaderIndex*50, rowIndex*35, invaderNumber)
                    )
                }
            });
        });
    }

    fireBullet(){
        this.fireBulletTimer--;
        if(this.fireBulletTimer<=0){
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allInvaders = this.invadersRow.flat();
            const invaderIndex = Math.floor(Math.random()*allInvaders.length);
            const invader = allInvaders[invaderIndex];
            this.invaderBulletController.shoot(invader.x+invader.width/2, invader.y,-3);
        }
    }

    updateVelocityAndDirection(){
        for(const invaderRow of this.invadersRow){
            if(this.currentDirection === MovingDirection.right){
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity=0;
                const rightMostInvader = invaderRow[invaderRow.length-1];
                if(rightMostInvader.x+rightMostInvader.width>=this.canvas.width){
                    this.currentDirection = MovingDirection.downLeft;
                    break;
                }
            }else if(this.currentDirection === MovingDirection.downLeft){
                if(this.moveDown(MovingDirection.left)){
                    break;
                }
            }else if(this.currentDirection === MovingDirection.left){
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity=0;
                const leftMostInvader = invaderRow[0];
                if(leftMostInvader.x<=0){
                    this.currentDirection = MovingDirection.downRight;
                    break;
                }
            }else if(this.currentDirection === MovingDirection.downRight){
                if(this.moveDown(MovingDirection.right)){
                    break;
                }
            }
        }
    }

    moveDown(newDirection){
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if(this.moveDownTimer<=0){
            this.currentDirection = newDirection;
            return true;
        }
        return false;
    }

    resetMoveDownTimer(){
        if(this.moveDownTimer<=0){
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    decrementMoveDownTimer(){
        if(this.currentDirection === MovingDirection.downLeft || this.currentDirection === MovingDirection.downRight){
            this.moveDownTimer--;
        }
    }

    collisionDetection(){
        this.invadersRow.forEach((invaderRow)=>{
            invaderRow.forEach((invader, invaderIndex)=>{
                if(this.playerBulletController.collideWith(invader)){

                    console.log(" his.playerBulletController.collideWith");
                    invaderRow.splice(invaderIndex, 1);
                }
            });
        });
        this.invadersRow = this.invadersRow.filter((invaderRow)=> invaderRow.length>0);
    }

    collideWith(sprite) {
        return this.invadersRow.flat().some((invader) => invader.collideWith(sprite));
      }
}