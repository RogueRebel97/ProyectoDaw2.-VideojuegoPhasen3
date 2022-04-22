//imports
import * as Phaser from 'phaser';
import UIScene from './UIScene';

//Angular context
let contexto: any;

export default class SettingsMenu {
  // Propiedades
  private activeScene!: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private checkmark!: Phaser.GameObjects.Image;

  private open = false;

  //Funcion booleana para comprobar si el menu esta desplegado o no.
  get isOpen() {
    return this.open;
  }

  constructor(scene: Phaser.Scene) {

    console.log('Escena:' + scene);
    console.log('Abierto:' + this.open);


    this.activeScene = scene;

    const screenCenterX = this.activeScene.cameras.main.worldView.x + this.activeScene.cameras.main.width / 2;
    const screenCenterY = this.activeScene.cameras.main.worldView.y + this.activeScene.cameras.main.height / 2;
    const { width } = scene.scale;

    this.container = scene.add.container(width + 300, screenCenterY - 250); // Comienza escondido en la Derecha (width+300)
    const panel = scene.add.nineslice(0, 0, 340, 250, 'setting_panel', 24).setOrigin(0.5, 0);


    const pauseText = scene.add.text
      ((panel.x - (panel.width / 2)) + 10, panel.y + 10, 'PAUSA',
        { color: 'black', fontFamily: 'pixel', fontSize: '24px' });


    const resumeButton = scene.add.image
      (panel.x / 2, panel.y + 80, 'menuButton-1')

    const resumeText = scene.add.text
      (resumeButton.x / 2, resumeButton.y - 10, 'RESET', {
        color: 'black', fontFamily: 'pixel', fontSize: '18px'
      }).setOrigin(0.5, 0);

    // const toggleButton = scene.add
    //   .image(-panel.width + 10, 250, 'small_button')
    //   .setOrigin(0, 0);

    // this.checkmark = scene.add.image(
    //   toggleButton.x + toggleButton.width * 0.5,
    //   toggleButton.y + toggleButton.height * 0.5,
    //   'checkmark'
    // );

    // const soundText = scene.add.text(
    //   toggleButton.x + toggleButton.width + 10,
    //   toggleButton.y + 14,
    //   'Sonido',
    //   {
    //     color: 'black',
    //     fontFamily: 'pixel',
    //     fontSize: '14px',
    //   }
    // );



    this.container.add(panel);
    this.container.add(pauseText);
    this.container.add(resumeButton)
    this.container.add(resumeText)
    // this.container.add(toggleButton);
    // this.container.add(this.checkmark);
    // this.container.add(soundText);
    // this.container.add(restartButton);

    // toggleButton
    //   .setInteractive()
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
    //     toggleButton.setTint(0xe0e0e0);
    //   })
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
    //     toggleButton.setTint(0xffffff);
    //   })
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
    //     toggleButton.setTint(0xffffff);

    //     this.toggleSound();
    //   });

    resumeButton.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        resumeButton.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        resumeButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        resumeButton.setTint(0xe0e0e0);
        resumeButton.setTexture('menuButton-2')

        this.activeScene.scene.restart
      }).on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        resumeButton.setTint(0xffffff);
        resumeButton.setTexture('menuButton-1')


        for (let i = 0; i <= this.activeScene.scene.manager.scenes.length - 1; i++) {
          if (this.activeScene.scene.manager.scenes[i].scene.key == 'ui-scene') {
          } else if (this.activeScene.scene.manager.scenes[i].scene.isPaused()) {
            // this.activeScene.scene.resume(this.activeScene.scene.manager.scenes[i].scene.key);
            console.log('this.activeScene.scene.manager.scenes[i]');

            this.activeScene.scene.manager.scenes[i].scene.start('MainMenu')
            this.hide()
          }
        }

      })

  }

  // Mostrar y Ocultar Menu
  // si esta abierto no hacer nada.
  show() {
    const { width, height } = this.activeScene.scale;




    if (this.open) {
      return;
    }
    //Animacion de desplazamiento para mostrar
    this.activeScene.tweens.add({
      targets: this.container,
      x: (width / 2),
      duration: 300,
      ease: Phaser.Math.Easing.Sine.InOut,
    }).complete;

    this.open = true;

  }

  hide() {
    if (!this.open) {
      return;
    }
    const { width, height } = this.activeScene.scale;
    //Animacion de desplazamiento para ocultar
    this.activeScene.tweens.add({
      targets: this.container,
      x: width + 300,
      duration: 300,
      ease: Phaser.Math.Easing.Sine.InOut,
    });

    this.open = false;

  }
  // Fin Mostrar y ocultar Menu






  // Funcion para Sonido
  private toggleSound() {
    let isMute = this.checkmark.visible;

    isMute = !isMute;

    this.activeScene.sound.mute = isMute;

    this.checkmark.visible = isMute;
  }

  // funcion para pausar
  // pause(key: string) {
  //   this.show();
  // }

  // resume(key: string) {
  //   this.hide();
  // }
}
