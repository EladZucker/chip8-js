import MotherBoard from "./interfaces/motherboard";

const motherBoard = new MotherBoard();

const start = async () => {
  await motherBoard.loadRom("/roms/missle.ch8");
  motherBoard.boot();
};

start();
