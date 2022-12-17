const DISPLAY_WIDTH: number = 64;
const DISPLAY_HEIGHT: number = 32;
const DISPLAY_COLOR: string = "green";
/* Emulation of a chip 8 display using canvas */
export default class Display {
  private canvas: HTMLCanvasElement; // Canvas element
  private context: CanvasRenderingContext2D; // Canvas context.
  private width: number; // Canvas width.
  private height: number; // Canvas Height.
  private pixelWidth: number; // Pixel width.
  private pixelHeight: number; // Pixel height.
  private frameBuffer: Uint8Array; // a frame buffer DISPLAY_WIDTH * DISPLAY_HEIGHT

  constructor() {
    // find the canvas elment. and get its context.
    this.canvas = document.getElementById(
      "chip-8-frame-buffer"
    ) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");

    /* calculate sizes , initialize frame buffer */
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.pixelWidth = this.canvas.width / DISPLAY_WIDTH;
    this.pixelHeight = this.canvas.height / DISPLAY_HEIGHT;
    this.frameBuffer = new Uint8Array(DISPLAY_WIDTH * DISPLAY_HEIGHT);
    for (let i = 0; i < DISPLAY_HEIGHT * DISPLAY_WIDTH; i++) {
      this.frameBuffer[i] = 0;
    }
    this.clear();
  }

  /* Clear the frame buffer */
  _clearBuffer = () => {
    for (let i = 0; i < DISPLAY_HEIGHT * DISPLAY_WIDTH; i++) {
      this.frameBuffer[i] = 0;
    }
  };

  /* Clear the display and the buffer */
  clear = () => {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.width, this.height);
    this._clearBuffer();
  };

  /* Draw one pixel on display and frame buffer */
  drawPixel = (x: number, y: number, color: number) => {
    const bufferLocation = x + y * DISPLAY_WIDTH;
    // check if the pixel is already on. if on with need to trigger CPU to set the F register.
    const collision = this.frameBuffer[bufferLocation] & color;

    this.frameBuffer[bufferLocation] ^= color;

    if (this.frameBuffer[bufferLocation]) {
      this.context.fillStyle = DISPLAY_COLOR;
    } else {
      this.context.fillStyle = "black";
    }
    this.context.fillRect(
      x * this.pixelWidth,
      y * this.pixelHeight,
      this.pixelWidth,
      this.pixelHeight
    );

    return collision;
  };
}
