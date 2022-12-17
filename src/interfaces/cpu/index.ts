import MotherBoard from "../motherboard";
import { OpcodeData } from "../types";
import { opcodeDecoderTable } from "./instructions";

/* implementation of a Chip 8 CPU */
export default class CPU {
  private motherBoard: MotherBoard;
  private registers: Uint8Array; // registers (V0/VF)
  private stack: Uint16Array; // Stack
  private SP: number; // Stack pointer
  private DT: number; // Clock
  private ST: number; // Sound Timer
  private I: number; // Memory register
  private PC: number; // Program counter

  constructor(motherBoard: MotherBoard) {
    this.motherBoard = motherBoard;
    this.reset();
  }

  /* Reset the cpu to the intial state */
  reset = () => {
    this.registers = new Uint8Array(16);
    this.stack = new Uint16Array(16);
    this.SP = -1;
    this.I = 0;
    this.ST = 0;
    this.DT = 0;
    this.PC = 0x200;
  };

  /* Given an opcode, return an parsed OpcodeData */
  decode = (opcode: number): OpcodeData => {
    let opcodeData: OpcodeData = {
      opcodeName: "UNKOWN",
      opcode: opcode,
      args: [],
    };
    // iterate over all instruction and test if the current code match one of them.
    for (const instruction of opcodeDecoderTable) {
      if ((opcode & instruction.mask) === instruction.code) {
        // we found the instruction. save it.
        opcodeData.opcodeName = instruction.name;
        opcodeData.opcode = opcode;
        // start parsing arguments.
        for (const arg of instruction.args) {
          // for each argument in the instruction , we mask and shift .
          const newArgument = (opcode & arg.mask) >> arg.shift;
          opcodeData.args.push(newArgument);
        }
        break;
      }
    }
    return opcodeData;
  };

  /* Execute an opcode by the given opcode data */
  execute = (opcodeData: OpcodeData) => {
    let nextInstruction: boolean = true;
    switch (opcodeData.opcodeName) {
      case "CLS":
        // Clear display.
        this.motherBoard.getDisplay().clear();
        break;
      case "RET":
        // Return from sub routine. (PC = current address in the stack and reduce the stack)
        this.PC = this.stack[this.SP];
        this.SP--;
        nextInstruction = false;
        break;
      case "JP_ADDR":
        // Jump to address in arg1.
        this.PC = opcodeData.args[0];
        nextInstruction = false;
        break;
      case "CALL_ADDR":
        // call address in arg1 and save current location in stack.
        this.SP++;
        this.stack[this.SP] = this.PC + 2;
        this.PC = opcodeData.args[0];
        nextInstruction = false;
        break;
      case "SE_VX_BYTE":
        // skip instruction if VX equal to arg1.
        if (this.registers[opcodeData.args[0]] === opcodeData.args[1])
          this.PC += 2;
        break;
      case "SNE_VX_BYTE":
        // skip instruction if VX not equal to arg1.
        if (this.registers[opcodeData.args[0]] !== opcodeData.args[1])
          this.PC += 2;
        break;
      case "SE_VX_VY":
        // skip instruction if VX not equal to arg1.
        if (
          this.registers[opcodeData.args[0]] ===
          this.registers[opcodeData.args[1]]
        )
          this.PC += 2;
        break;
      case "LD_VX_BYTE":
        // set register arg1 to arg2.
        this.registers[opcodeData.args[0]] = opcodeData.args[1];
        break;
      case "ADD_VX_BYTE":
        // add byte in arg2 to register arg1.
        let v = this.registers[opcodeData.args[0]] + opcodeData.args[1];

        if (v > 255) {
          v -= 256;
        }

        this.registers[opcodeData.args[0]] = v;
        break;
      case "LD_VX_VY":
        // Vx = Vy
        this.registers[opcodeData.args[0]] = this.registers[opcodeData.args[1]];
        break;
      case "OR_VX_VY":
        // Vx = Vx OR Vy
        this.registers[opcodeData.args[0]] |=
          this.registers[opcodeData.args[1]];
        break;
      case "AND_VX_VY":
        //  Vx = Vx AND Vy
        this.registers[opcodeData.args[0]] &=
          this.registers[opcodeData.args[1]];
        break;
      case "XOR_VX_VY":
        // Vx = Vx XOR Vy
        this.registers[opcodeData.args[0]] ^=
          this.registers[opcodeData.args[1]];
        break;
      case "ADD_VX_VY":
        // Vx = Vx + Vy, if overflow VF = 1
        this.registers[0xf] =
          this.registers[opcodeData.args[0]] +
            this.registers[opcodeData.args[1]] >
          0xff
            ? 1
            : 0;
        this.registers[opcodeData.args[0]] +=
          this.registers[opcodeData.args[1]];
        break;
      case "SUB_VX_VY":
        // Vx = Vx - Vy , VF = Not Borrow
        this.registers[0xf] =
          this.registers[opcodeData.args[0]] >
          this.registers[opcodeData.args[1]]
            ? 1
            : 0;

        this.registers[opcodeData.args[0]] -=
          this.registers[opcodeData.args[1]];
        break;
      case "SHR_VX_VY":
        // Vx = VX SHR 1, if LSB of Vx == 1, VF = 1
        this.registers[0xf] = this.registers[opcodeData.args[0]] & 1;
        this.registers[opcodeData.args[0]] >>= 1;
        break;
      case "SUBN_VX_VY":
        // Vx = Vy - Vx, VF = NOT Borrow
        this.registers[0xf] =
          this.registers[opcodeData.args[1]] >
          this.registers[opcodeData.args[0]]
            ? 1
            : 0;

        this.registers[opcodeData.args[0]] =
          this.registers[opcodeData.args[1]] -
          this.registers[opcodeData.args[0]];

        break;
      case "SHL_VX_VY":
        // Vx = VX SHL 1, if LMSB of Vx == 1, VF = 1
        this.registers[0xf] = this.registers[opcodeData.args[0]] >> 7;
        this.registers[opcodeData.args[0]] <<= 1;
        break;
      case "SNE_VX_VY":
        // Skip instruction if Vx and Vy are not equal.
        if (
          this.registers[opcodeData.args[0]] !==
          this.registers[opcodeData.args[1]]
        )
          this.PC += 2;
        break;
      case "LD_I_ADDR":
        // I = Memory address
        this.I = opcodeData.args[0];
        break;
      case "JP_V0_ADDR":
        // PC = V0 + ADDR
        this.PC = this.registers[0] + opcodeData.args[0];
        nextInstruction = false;
        break;
      case "RND_VX_BYTE":
        // Rand number into V[arg1] AND arg2
        this.registers[opcodeData.args[0]] =
          (Math.random() * 255) & opcodeData.args[1];
      case "DRW_VX_VY_NIBBLE":
        /* Draw on display location V[x] V[y] data from I. Each byte contains 8 pixels line.
        // arg3 represent the number of lines if the location already contains a pixel set V[f] */
        this.registers[0xf] = 0;
        for (let y = 0; y < opcodeData.args[2]; y++) {
          const line: number = this.motherBoard.getRAM().getByte(this.I + y);
          for (let x = 0; x < 8; x++) {
            const pixel: number = line & (1 << (7 - x)) ? 1 : 0;
            const currentX: number = this.registers[opcodeData.args[0]] + x;
            const currentY: number = this.registers[opcodeData.args[1]] + y;

            if (
              this.motherBoard.getDisplay().drawPixel(currentX, currentY, pixel)
            ) {
              this.registers[0xf] = 1;
            }
          }
        }
        break;
      case "SKP_VX":
        // Skip instruction if key in V[x] pressed .
        if (
          this.motherBoard
            .getKeyboard()
            .isPressed(this.registers[opcodeData.args[0]])
        ) {
          this.PC += 2;
        }
        break;
      case "SKNP_VX":
        // Skip instruction if key V[x] is not pressed.
        if (
          !this.motherBoard
            .getKeyboard()
            .isPressed(this.registers[opcodeData.args[0]])
        ) {
          this.PC += 2;
        }
        break;
      case "LD_VX_DT":
        // Load clock value in V[x].
        this.registers[opcodeData.args[0]] = this.DT;
        break;
      case "LD_VX_K":
        // Load pressed keys into V[x].
        const keyPressed: number = this.motherBoard
          .getKeyboard()
          .getCurrentPressed();
        if (keyPressed === undefined) {
          nextInstruction = false;
          break;
        }
        this.registers[opcodeData.args[0]] = keyPressed;
        break;
      case "LD_DT_VX":
        // Load clock with V[x] value.
        this.DT = this.registers[opcodeData.args[0]];
        break;
      case "LD_ST_VX":
        // Load sound timer with V[x] value.
        this.ST = this.registers[opcodeData.args[0]];
        break;
      case "ADD_I_VX":
        // V[x] to I
        this.I += this.registers[opcodeData.args[0]];
        break;
      case "LD_F_VX":
        // Load font number from sprite from V[x] into I
        this.I = this.registers[opcodeData.args[0]] * 5;
        break;
      case "LD_B_VX":
        //Load BCD representation of the number given in V[x]
        let number: number = this.registers[opcodeData.args[0]];
        const hundreds: number = Math.floor(number / 100);
        number -= hundreds * 100;
        const tens: number = Math.floor(number / 10);
        number -= tens * 10;
        const ones: number = Math.floor(number);

        this.motherBoard.getRAM().setByte(this.I, hundreds);
        this.motherBoard.getRAM().setByte(this.I + 1, tens);
        this.motherBoard.getRAM().setByte(this.I + 2, ones);
        break;
      case "LD_[I]_VX":
        // Load into I V0 to arg1, increment I by the number of registers stored.
        for (let i = 0; i <= opcodeData.args[0]; i++) {
          this.motherBoard.getRAM().setByte(this.I + i, this.registers[i]);
        }
        this.I += opcodeData.args[0];
        break;
      case "LD_VX_[I]":
        // Load I into V0..to arg1
        for (let i = 0; i <= opcodeData.args[0]; i++) {
          this.registers[i] = this.motherBoard.getRAM().getByte(this.I + i);
        }
        this.I += opcodeData.args[0];
        break;
      default:
    }

    // Each iteration forward to next instruction.
    if (nextInstruction) {
      this.PC += 2;
    }
  };

  /* Execute one opcode */
  cycle = () => {
    // Fetch next opcode from PC
    const opcode = this.motherBoard.getRAM().getWord(this.PC);

    // Decode
    const data: OpcodeData = this.decode(opcode);

    // Debug to console :)
    let printData = data.opcode.toString(16) + " " + data.opcodeName + " ";
    for (const arg of data.args) {
      printData += arg.toString(16) + " ";
    }

    console.log(printData);
    // Execute
    this.execute(data);
  };

  /* Timer callback handler */
  timerTick = () => {
    // Each tick reduce DT until zero reached.
    if (this.DT != 0) {
      this.DT--;
    }
  };

  /* Sound timer handler */
  soundTick = (): number => {
    // Each Tick reduce ST until zero reached.
    if (this.ST != 0) {
      this.ST--;
    }

    return this.ST;
  };
}
