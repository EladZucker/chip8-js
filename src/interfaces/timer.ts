import { TIMER_CLOCK_SPEED } from "../constants";
import CPU from "./cpu";

export default class Timer {
  // The Timer object responsible for the chip-8 timer.
  private timer: NodeJS.Timer;
  private cpu: CPU;
  constructor(cpu: CPU) {
    this.cpu = cpu;
    this.timer = undefined;
  }
  start = () => {
    /* starting the timer. the CPU timer tick will be called each interval and 
       responsible to reduce the delay timer register by 1 each time. */
    this.stop();
    this.timer = setInterval(this.cpu.timerTick, TIMER_CLOCK_SPEED);
  };

  stop = () => {
    if (this.timer != undefined) {
      clearInterval(this.timer);
    }

    this.timer = undefined;
  };
}
