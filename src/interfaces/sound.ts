import { SOUND_CLOCK_SPEED } from "../constants";
import CPU from "./cpu";

export default class Sound {
  /* Responsible for the chip-8 sound which is built on a BEEP sound for the interval of the sound timer register */

  private timer: NodeJS.Timer;
  private cpu: CPU;
  private soundIsOn: Boolean;
  private oscillator: any;
  constructor(cpu: CPU) {
    this.cpu = cpu;
    this.timer = undefined;
  }

  soundTick = () => {
    /* the timer tick , each tick we ask from the CPU to return the sound timer register. 
       If the timer is larger then 0 and sound is off, we need to make the sound start.
       If the timer is larger then 0 and sound is on ,do nothing.
       If the timer is 0 and sound is on we need to turn it off */
    const soundRegisterOn: number = this.cpu.soundTick();
    if (soundRegisterOn && !this.soundIsOn) {
      let context = new AudioContext();
      this.oscillator = context.createOscillator();
      this.oscillator.type = "sine";
      this.oscillator.frequency.value = 800;
      this.oscillator.connect(context.destination);
      this.oscillator.start();
      this.soundIsOn = true;
    }

    if (!soundRegisterOn && this.soundIsOn) {
      this.oscillator.stop();
      this.soundIsOn = false;
    }
  };

  start = () => {
    // Starting up the sound timer.
    this.stop();
    this.timer = setInterval(this.soundTick, SOUND_CLOCK_SPEED);
  };

  stop = () => {
    if (this.timer != undefined) {
      clearInterval(this.timer);
    }

    this.timer = undefined;
  };
}
