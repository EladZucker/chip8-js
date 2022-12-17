/* Emulate Chip 8 keyboard */
export default class Keyboard {
  private keyMap: String[]; // contains the map from keyboard to chip 8 keys.
  private keys: number; // 16 bit number. each bit represent one of the keypad buttons.
  private currentPressed: number; // contains the current (last) key pressed.
  constructor() {
    /* chip-8 key pad is 
       1 2 3 C
       4 5 6 D
       7 8 9 E
       A 0 B F

       We map the keyboard matrix of 1-4 to 1-Z to this pad. so 0=x and 1=1 C=4 F=V 
       */
    // prettier-ignore
    this.keyMap = [
      "x","1","2",
      "3","q","w",
      "e","a","s",
      "d","z","c",
      "4","r","f",
      "v",
    ];
    this.keys = 0;
    this.currentPressed = undefined;

    document.addEventListener("keydown", (event) => {
      // when a key is down we map it to chip-8 key by its index and set the right bit in keys variable.
      const key = this.keyMap.indexOf(event.key);
      if (key !== -1) {
        // save last key pressed.
        this.currentPressed = key;
        this.keys |= 1 << key;
      }
    });

    document.addEventListener("keyup", (event) => {
      // on keyup , we unset the key from the keys variable.
      const key = this.keyMap.indexOf(event.key);

      if (key !== -1) {
        if (key === this.currentPressed) {
          this.currentPressed = undefined;
        }

        const keyMask = 0xffff ^ (1 << key);
        this.keys &= keyMask;
      }
    });
  }
  getKeys = () => {
    return this.keys;
  };

  getCurrentPressed = () => {
    // this is a one shot function. it is used for the LD_VX_K opcode which wait for a key press.
    const pressed = this.currentPressed;
    this.currentPressed = undefined;
    return pressed;
  };

  isPressed = (key: number) => this.keys & (1 << key);
}
