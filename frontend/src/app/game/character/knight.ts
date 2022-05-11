import Constants from "../Constants";
import Slime from "../enemies/slime";

export default class Knight extends Phaser.Physics.Arcade.Sprite {
    // Attributes
    private vRun: number = 125;
    private vJump: number = 250;
    private vSlide: number = 330;
    private maxHealth: number = 20;
    private health: number = this.maxHealth;
    private damage: number = 10;

    // Actions & states
    private actions: any = {
        attack: { state: true, duration: 300, cooldown: 350 },
        slide: { state: true, duration: 300, cooldown: 800 },
        damage: { state: true, duration: 500, cooldown: 1500 },
        invulnerable: { state: true, cooldown: 325 }
    }
    private allowMove: boolean = true;
    private crouch: boolean = false
    private playerIsDead: boolean = false;
    // private allowDamage: boolean = true;

    // Key controls
    private controls!: any;

    // Current Game Scene
    private currentScene!: Phaser.Scene;

    //Sword Hitbox
    private swordHitbox: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

    constructor(config: any) {
        super(config.currentScene, config.x, config.y, config.texture);

        this.currentScene = config.currentScene;
        console.log('caballero creado');
        //Register global Variables
        this.currentScene.registry.set(Constants.PLAYER.STATS.MAXHEALTH, this.maxHealth)
        this.currentScene.registry.set(Constants.PLAYER.STATS.HEALTH, this.health)

        // Player Controls
        this.controls = this.currentScene.input.keyboard.addKeys({
            'UP': Phaser.Input.Keyboard.KeyCodes.UP,
            'DOWN': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'LEFT': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'RIGHT': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'W': Phaser.Input.Keyboard.KeyCodes.W,
            'A': Phaser.Input.Keyboard.KeyCodes.A,
            'S': Phaser.Input.Keyboard.KeyCodes.S,
            'D': Phaser.Input.Keyboard.KeyCodes.D,
            'SHIFT': Phaser.Input.Keyboard.KeyCodes.SHIFT,
            'SPACE': Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        // Sprite Physics
        this.currentScene.physics.world.enable(this);
        this.currentScene.add.existing(this);
        this.setCollideWorldBounds(false);
        this.body.setSize(20, 38);
        // this.displayWidth = 240;
        // this.displayHeight = 160;
        this.body.setOffset(this.width * 0.5 - 15, this.height * 0.5);


        // Initialize Sword HitBox
        this.swordHitbox = this.currentScene.add.rectangle(this.x, this.y, 50, 55, 0xFF0000, 0) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
        this.currentScene.physics.add.existing(this.swordHitbox)
        this.swordHitbox.body.setAllowGravity(false)
        this.swordHitbox.body.enable = false;
        this.currentScene.physics.world.remove(this.swordHitbox.body)
    }

    create() { // Character animations
        this.anims.create({
            key: 'left',
            frames: this.currentScene.anims.generateFrameNumbers('run', { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'idle',
            frames: this.currentScene.anims.generateFrameNumbers('knight', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'left',
            frames: this.currentScene.anims.generateFrameNumbers('run', { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'jump',
            frames: this.currentScene.anims.generateFrameNumbers('jump', { start: 0, end: 2 }),
            frameRate: 20,
        });
        this.anims.create({
            key: 'fall',
            frames: this.currentScene.anims.generateFrameNumbers('fall', { start: 0, end: 2 }),
            frameRate: 20,
        });
        this.anims.create({
            key: 'right',
            frames: this.currentScene.anims.generateFrameNumbers('run', { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'dash',
            frames: this.anims.generateFrameNumbers('dash', { start: 0, end: 1 }),
            frameRate: 40
        });
        this.anims.create({
            key: 'slide',
            frames: this.currentScene.anims.generateFrameNumbers('slide', { start: 0, end: 3 }),
            frameRate: 40
        });
        this.anims.create({
            key: 'downSwing',
            frames: this.currentScene.anims.generateFrameNumbers('downAttack', { start: 0, end: 3 }),
            frameRate: 20,
        });
        this.anims.create({
            key: 'hit',
            frames: this.currentScene.anims.generateFrameNumbers('hit', { start: 0 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'death',
            frames: this.currentScene.anims.generateFrameNumbers('death', { start: 0, end: 9 }),
            frameRate: 20,
        });
        this.anims.create({
            key: 'crouch',
            frames: this.currentScene.anims.generateFrameNumbers('crouch', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'crouchWalk',
            frames: this.currentScene.anims.generateFrameNumbers('crouchWalk', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });

        // Sword and Enemy Colliders
        this.currentScene.physics.add.overlap
            (this.swordHitbox, this.currentScene.registry.get(Constants.GROUPS.ENEMIES), this.attackCollide)

        console.log("Grupo de enemigos:" + this.currentScene.registry.get(Constants.GROUPS.ENEMIES));


    }

    override update() {

        console.log("Agachado: " + this.crouch);

        let key = Phaser.Input.Keyboard;

        if (this.playerIsDead) this.allowMove = false;

        // Actions set
        if (this.allowMove) {

            //crouch
            if ((this.controls.DOWN.isDown || this.controls.S.isDown)) {
                this.setVelocityX(0)
                this.crouch = true
            }
            else {
                this.crouch = false
            }


            // Run
            if (!this.crouch) {
                if ((this.controls.LEFT.isDown || this.controls.A.isDown)) { // Left <==


                    // Left Speed
                    this.setVelocityX(-this.vRun);

                    // Animation and Turn
                    if (this.flipX && this.body.blocked.down) {
                        this.anims.play('left', true);
                    } else {
                        this.anims.stop();
                        this.flipX = true;
                    }

                    // hitbox adjust
                    this.body.setOffset(this.width * 0.5 - 5, this.height * 0.5);

                } else if ((this.controls.RIGHT.isDown || this.controls.D.isDown)) { // Right ==>

                    // Right speed
                    this.setVelocityX(this.vRun);

                    // Animation & Turn
                    if (!this.flipX && this.body.blocked.down) {
                        this.anims.play('right', true);
                    } else {
                        this.anims.stop();
                        this.flipX = false;
                    }

                    // hitbox adjust
                    this.body.setOffset(this.width * 0.5 - 15, this.height * 0.5);

                } else if (this.body.blocked.down) { // Idle
                    this.setVelocityX(0);
                    this.anims.play('idle', true);
                } else {
                    this.setVelocityX(0)
                }
            } else { // Crouch Movement
                // Crouch walk left
                if ((this.controls.LEFT.isDown || this.controls.A.isDown)) {

                    // Left Speed
                    this.setVelocityX(-this.vRun * 0.6);

                    // Animation and Turn
                    if (this.flipX && this.body.blocked.down) {
                        this.anims.play('crouchWalk', true);
                    } else {
                        this.anims.stop();
                        this.flipX = true;
                    }

                } else if ((this.controls.RIGHT.isDown || this.controls.D.isDown)) {
                    // Right speed
                    this.setVelocityX(this.vRun * 0.6);

                    // Animation & Turn
                    if (!this.flipX && this.body.blocked.down) {
                        this.anims.play('crouchWalk', true);
                    } else {
                        this.anims.stop();
                        this.flipX = false;
                    }

                } else if (this.body.blocked.down) //idle crouch
                {
                    this.setVelocityX(0);
                    this.anims.play('crouch');
                } else {
                    this.setVelocityX(0);
                }
            }



            // Jump
            if ((key.JustDown(this.controls.UP) || key.JustDown(this.controls.W)) && this.body.blocked.down) {
                this.anims.stop();
                this.setVelocityY(-this.vJump);
                this.anims.play('jump');

            }


            // Fall
            if (this.body.velocity.y >= 0 && !this.body.blocked.down) {
                this.anims.stop();
                this.anims.play('fall');
            }

            // Attack: Down Swing
            if (key.JustDown(this.controls.SPACE) && this.body.blocked.down && this.actions.attack.state) {
                this.setVelocityX(0); //parar el pj
                this.blockMove('attack') // bloquear otros inputs de usuario por x milisegundos
                this.cooldown('attack');    // impide que se vuelva a ejecutar otro ataque durante x ms
                this.anims.stop(); // detener animaciones en curso
                this.anims.play('downSwing');

                // cambiar el Frame en el ataque es efectivo
                const startHit = (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
                    if (frame.index < 1) { // empieza en el frame 1
                        return
                    }
                    this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit) // apaga evento.

                    this.swordHitbox.x = this.flipX
                        ? this.x - this.width * 0.4
                        : this.x + this.width * 0.4
                    this.swordHitbox.y = this.y + this.body.height * 0.5

                    // To-Do ajustar temporalmente la hitbox del caballero para que se adapte a la animacion

                    // activa la hitbox 
                    this.swordHitbox.body.enable = true
                    this.currentScene.physics.world.add(this.swordHitbox.body)
                }
                this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit) // cuando la animacion avance llama a startHi para saber cuando comenzar

                // desactivar la hitbox al acabar la animacion
                this.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'downSwing', () => {
                    this.swordHitbox.body.enable = false;
                    this.currentScene.physics.world.remove(this.swordHitbox.body)
                })






            }

            // Slide
            if (key.JustDown(this.controls.SHIFT) &&
                (this.controls.RIGHT.isDown || this.controls.LEFT.isDown || this.controls.A.isDown || this.controls.D.isDown) &&
                this.body.blocked.down && this.actions.slide.state) {

                this.blockMove('slide'); // bloquear otros inputs de usuario por x milisegundos
                this.cooldown('slide'); // impide que se vuelva a ejecutar otro slide durante x ms
                this.cooldown('invulnerable')
                this.anims.stop();  // detener animaciones en curso
                this.anims.play('slide');

                if (this.flipX) this.setVelocityX(-this.vSlide);
                else this.setVelocityX(this.vSlide);
            }
        }
    }

    private blockMove(action: string) {
        this.allowMove = false;
        this.currentScene.time.delayedCall(this.actions[action].duration, () => {
            this.allowMove = true
        }, [], this)
    }

    private cooldown(action: string) {
        this.actions[action].state = false;
        this.currentScene.time.delayedCall(this.actions[action].cooldown, () => {
            this.actions[action].state = true
        }, [], this);

    }

    checkIsDead() {
        var health = this.currentScene.registry.get(Constants.PLAYER.STATS.HEALTH);

        if (health <= 0 && !this.playerIsDead && this.allowMove && this.body.blocked.down) {
            this.playerIsDead = true //boolean to check players Death
            this.anims.stop();
            this.setVelocityX(0);
            this.anims.play('death');
            this.currentScene.physics.world.remove(this.body)
            this.body.enable = false;

        }
    }

    deathCheck(): boolean {
        return this.playerIsDead;
    }

    deathFall() {
        console.log("Sa Matao Paco");
        this.currentScene.cameras.main.stopFollow()
        this.playerIsDead = true
        this.health = 0
        this.currentScene.physics.world.removeCollider(this.currentScene.registry.get(Constants.REGISTRY.COLLIDERS.DEATHZONE))
        this.setCollideWorldBounds(false)
    }

    getDamage(damage: number) {
        var health = this.currentScene.registry.get(Constants.PLAYER.STATS.HEALTH);
        if (health > 0 && !this.playerIsDead && this.actions.damage.state && this.actions.invulnerable.state) {

            this.blockMove('damage');
            this.cooldown('damage')
            this.getInvulnerable(1500)

            if (this.body.blocked.left) {
                this.setVelocityX(100)
                this.setVelocityY(-150)
                this.anims.play('hit')



            } else if (this.body.blocked.right) {

                this.setVelocityX(-100)
                this.setVelocityY(-150)
                this.anims.play('hit')


            } else if (this.body.touching.down) {
                var random = Math.floor(Math.random() * 2) + 1;
                this.anims.stop;
                this.setVelocityY(-150)
                if (random == 1) {
                    this.setVelocityX(100)
                    this.anims.play('hit')
                } else {
                    this.setVelocityX(-100)
                    this.anims.play('hit')
                }
            }

            health = health - damage;
            this.currentScene.registry.set(Constants.PLAYER.STATS.HEALTH, health)
            this.currentScene.events.emit(Constants.EVENTS.HEALTH)
        }
    }

    getInvulnerable(time: number) {
        this.currentScene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: 'Sine.InOut',
            duration: 55,
            repeat: 10,
            yoyo: true
        });
        this.currentScene.time.delayedCall(time, () => {
        }, [], this)

    }

    temporalHitBoxAdjust(time: number, x: number, y: number) {
        const offSetx = this.body.offset.x
        const offSety = this.body.offset.y
        this.body.setOffset(x, y)
        this.currentScene.time.delayedCall(time, () => {
            this.body.setOffset(offSetx, offSety)
        }, [], this)

    }



    attackCollide(obj1: any, obj2: any) {
        var enemy: Slime;

        enemy = obj2;
        enemy.getDamage(10)
    }

    reachGoal() {
        console.log("Has llegado a la meta");

        this.anims.stop()
        this.anims.play('idle')
        this.allowMove = false
        this.setVelocityX(0)
        this.setVelocityY(0)

    }


}

