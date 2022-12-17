import { CPU_CLOCK_SPEED } from "../constants";
import CPU from "./cpu";
import Display from "./display";
import Keyboard from "./keyboard";
import Memory from "./memory";
import Sound from "./sound";
import Timer from "./timer";

export default class MotherBoard {
  /* The MotherBoard object responsible to control the device "BUS", connecting all pieces togather and 
     responsible to boot the machine */

  private cpu: CPU;
  private ram: Memory;
  private keyboard: Keyboard;
  private display: Display;
  private timer: Timer;
  private sound: Sound;

  constructor() {
    this.cpu = new CPU(this);
    this.ram = new Memory();
    this.keyboard = new Keyboard();
    this.display = new Display();
    this.timer = new Timer(this.cpu);
    this.timer.start();
    this.sound = new Sound(this.cpu);
    this.sound.start();
  }

  getRAM = () => this.ram;
  getKeyboard = () => this.keyboard;
  getDisplay = () => this.display;

  loadRom = async (url: string) => {
    await this.ram.LoadRom(url);
  };

  boot = () => {
    // booting up the device. CPU reset and set up the CPI cycle clock.
    this.cpu.reset();
    setInterval(this.cpu.cycle, CPU_CLOCK_SPEED);
  };
}
