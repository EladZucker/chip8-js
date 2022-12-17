// font set save in memory at location 0x0000, 16 characters from 0-F each char built from 5 bytes.
//prettier-ignore
const FONT_SET = [
  0xf0, 0x90, 0x90, 0x90, 0xf0, 
  0x20, 0x60, 0x20, 0x20, 0x70, 
  0xf0, 0x10, 0xf0, 0x80, 0xf0, 
  0xf0, 0x10, 0xf0, 0x10, 0xf0,
  0x90, 0x90, 0xf0, 0x10, 0x10, 
  0xf0, 0x80, 0xf0, 0x10, 0xf0, 
  0xf0, 0x80, 0xf0, 0x90, 0xf0, 
  0xf0, 0x10, 0x20, 0x40, 0x40, 
  0xf0, 0x90, 0xf0, 0x90, 0xf0,
  0xf0, 0x90, 0xf0, 0x10, 0xf0,
  0xf0, 0x90, 0xf0, 0x90, 0x90, 
  0xe0, 0x90, 0xe0, 0x90, 0xe0, 
  0xf0, 0x80, 0x80, 0x80, 0xf0,
  0xe0, 0x90, 0x90, 0x90, 0xe0, 
  0xf0, 0x80, 0xf0, 0x80, 0xf0,
  0xf0, 0x80, 0xf0, 0x80, 0x80,
];

export default class Memory {
  /* The memory object responsible for the chip-8 RAM. and loading ROMS */
  private ram: Uint8Array;
  constructor() {
    this.ram = new Uint8Array(4096);
    for (let i = 0; i < FONT_SET.length; i++) {
      this.ram[i] = FONT_SET[i];
    }
  }
  LoadRom = async (url: string) => {
    /* Load ROM by URL */
    const response: Response = await fetch(url);
    const romData: ArrayBuffer = await response.arrayBuffer();
    const romArray: Uint8Array = new Uint8Array(romData);

    // place ROM data from 0x200
    let romAddress = 0x200;
    for (let i = 0; i < romArray.length; i++) {
      this.ram[romAddress + i] = romArray[i];
    }
  };

  getByte = (address: number): number => {
    return this.ram[address];
  };

  getWord = (address: number): number => {
    return (this.ram[address] << 8) + this.ram[address + 1];
  };

  setByte = (address: number, value: number) => {
    this.ram[address] = value;
  };

  setWord = (address: number, value: number) => {
    this.ram[address] = (value & 0xff00) >> 8;
    this.ram[address + 1] = value & 0xff;
  };
}
