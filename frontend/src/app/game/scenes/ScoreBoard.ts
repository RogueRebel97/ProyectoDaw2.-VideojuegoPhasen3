import { Injectable } from "@angular/core";
import * as Phaser from "phaser";


//Angular context
let contexto: any;


@Injectable({
    providedIn: 'root',
})


export class ScoreBoard extends Phaser.Scene {

    // Propiedades
    private width!: number
    private height!: number

    private scoreText!: Phaser.GameObjects.Text

    private arrayUsuarios: any; // array de usuarios recibidos de la BD
    private idUsuario: any //Id usuario recibido desde servicio de Cookies



    private img!: Phaser.GameObjects.TileSprite

    constructor() {
        super({ key: 'ScoreBoard' });

        console.log("ScoreBoard iniciada");

    }



    init() {


        this.arrayUsuarios = contexto.arrayRecord
        console.log(this.arrayUsuarios);

    }



    create() {
        //Efecto Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.width = this.scale.width;
        this.height = this.scale.height;

        // this.createBackground(this, 'nightBckgr-1', 1, 0)
        // this.createBackground(this, 'nightBckgr-2', 1, 0)
        // this.createBackground(this, 'nightBckgr-3', 1, 0)

        // const img1 = this.add.image(0, this.scale.height, 'nightBckgr-1')
        //     .setOrigin(0, 1)
        // img1.displayWidth = this.sys.canvas.width;
        // img1.displayHeight = this.sys.canvas.height;

        this.img = this.add.tileSprite(this.width / 2, this.height / 2, 0, 0, 'nightBckgr-1')

        this.img.setSize(this.width, this.height)

        // Boton Back to Menu
        const returnButton = this.add.image(this.width - 10, 10, 'small_button').setOrigin(1, 0);

        // Icono
        this.add.image(returnButton.x - returnButton.width * 0.5, returnButton.y + returnButton.height * 0.4, 'returnB').setScale(1);

        //animacion al pulsar
        this.animateButton(returnButton)


        // Array de Puntuaciones:
        if (contexto.arrayRecord) {

        }


        //Id usuario
        this.idUsuario = contexto.getID()

        console.log(`ID del Usuario en el juego:
        ${this.idUsuario}`);;



        // LEADERBOARD -----------------------------

        // header
        this.scoreText = this.add.text(this.width * 0.5, this.height - this.scale.height + 35, 'TOP 10 JUGADORES',
            {
                color: 'WHITE', fontFamily: 'pixel', fontSize: '32px'
            }).setOrigin(0.5, 0.5)

        //top 10 players
        this.createTable()


        //personal Score HEADER
        this.scoreText = this.add.text(this.width * 0.75, (this.scale.height * 0.2) + 50, 'PUNTUACION PERSONAL',
            {
                color: 'WHITE', fontFamily: 'pixel', fontSize: '18px'
            }).setOrigin(0.5, 0.5)

        // personal score
        for (let i = 0; i < this.arrayUsuarios.length; i++) {
            if (this.arrayUsuarios[i].id == this.idUsuario) {

                //Puntuacion
                this.scoreText = this.add.text(this.width * 0.6, (this.scale.height * 0.2) + 100, (i + 1) + '.',
                    {
                        color: 'WHITE', fontFamily: 'pixel', fontSize: '18px'
                    }).setOrigin(0.5, 0.5)

                //Nombre
                this.scoreText = this.add.text(this.width * 0.68, (this.scale.height * 0.2) + 100, this.arrayUsuarios[i].nombre,
                    {
                        color: 'WHITE', fontFamily: 'pixel', fontSize: '18px'
                    }).setOrigin(0.5, 0.5)

                //Score
                this.scoreText = this.add.text(this.width * 0.85, (this.scale.height * 0.2) + 100, this.arrayUsuarios[i].record,
                    {
                        color: 'WHITE', fontFamily: 'pixel', fontSize: '18px'
                    }).setOrigin(0.5, 0.5)

            }
        }





    }


    override update() {
        console.log("scoreBoard corriendo");
        this.img.tilePositionX++
        this.arrayUsuarios = contexto.arrayRecord
    }


    createBackground(scene: Phaser.Scene, texture: string, count: number, scrollFactor: number) {
        let x = 0;
        for (let i = 0; i < count; i++) {
            const img = scene.add.image(x, scene.scale.height, texture)
                .setOrigin(0, 1).setScrollFactor(scrollFactor)
            img.displayWidth = this.sys.canvas.width;
            img.displayHeight = this.sys.canvas.height;
            x += img.displayWidth

        }
    }

    createTable() {
        let y = this.scale.height * 0.2
        let x = this.width * 0.08
        let padding = 50



        for (let i = 0; i < 10; i++) {

            // Posicion
            this.add.text(x, y, (i + 1) + '.',
                {
                    color: 'WHITE', fontFamily: 'pixel', fontSize: '24px',

                }).setOrigin(0.5, 0.5)
            // Nombre
            this.add.text(this.width * 0.18, y, this.arrayUsuarios[i].nombre,
                {
                    color: 'WHITE', fontFamily: 'pixel', fontSize: '24px'
                }).setOrigin(0.5, 0.5)
            // Score
            this.add.text(this.width * 0.35, y, this.arrayUsuarios[i].record,
                {
                    color: 'WHITE', fontFamily: 'pixel', fontSize: '24px'
                }).setOrigin(0.5, 0.5)

            y += padding
        }

    }

    animateButton(button: Phaser.GameObjects.Image) {

        button.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            button.setTint(0xe0e0e0);
        })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                button.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                button.setTint(0xe0e0e0);



            }).on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                button.setTint(0xffffff);
                this.scene.start('MainMenu')
            })
    }

}
export const ScoreBoardScene = (ctx: any) => {

    console.log("contexto:");
    console.log(ctx);

    contexto = ctx;
    return ScoreBoard;
}
