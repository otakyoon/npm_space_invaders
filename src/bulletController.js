import Bullet from "./bullet.js";

export default class Bulletcontroller {
    bullets = [];

    constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
        this.canvas = canvas;
        this.maxBulletsAtATime = maxBulletsAtATime;
        this.bulletColor = bulletColor;
        this.soundEnabled = soundEnabled;
        this.shootSound = new Audio();
        this.shootSound.src = "../assets/sounds/shoot.wav";
        this.shootSound.volume = 0.1;
    }

    draw(ctx) {
        /*this.bullets = this.bullets.filter(
            (bullet) => (bullet.y + bullet.width > 0 && bullet.y+bullet.width<this.canvas.height) 
          );*/

        if (this.timeTillNextBulletAllowed > 0) {
            this.timeTillNextBulletAllowed--;
        }
        this.bullets.forEach((bullet) => bullet.draw(ctx));
    }

    shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
        if (this.bullets.length < this.maxBulletsAtATime && this.timeTillNextBulletAllowed <= 0) {
            const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
            this.bullets.push(bullet);
            if (this.soundEnabled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }
        }
        this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }

    collideWith(sprite){
        const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet)=>bullet.collideWith(sprite));
        if(bulletThatHitSpriteIndex>=0){
            this.bullets.splice(bulletThatHitSpriteIndex,1);
            return true;
        }
        return false;
    }
}