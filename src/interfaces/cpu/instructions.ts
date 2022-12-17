import { OpcodeDefinitions } from "./types";

export const opcodeDecoderTable: OpcodeDefinitions[] = [
  { name: "CLS", mask: 0xffff, code: 0x00e0, args: [] },
  { name: "RET", mask: 0xffff, code: 0x00ee, args: [] },
  {
    name: "JP_ADDR",
    mask: 0xf000,
    code: 0x1000,
    args: [{ mask: 0x0fff, shift: 0 }],
  },
  {
    name: "CALL_ADDR",
    mask: 0xf000,
    code: 0x2000,
    args: [{ mask: 0x0fff, shift: 0 }],
  },
  {
    name: "SE_VX_BYTE",
    mask: 0xf000,
    code: 0x3000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00ff, shift: 0 },
    ],
  },
  {
    name: "SNE_VX_BYTE",
    mask: 0xf000,
    code: 0x4000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00ff, shift: 0 },
    ],
  },
  {
    name: "SE_VX_VY",
    mask: 0xf00f,
    code: 0x5000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "LD_VX_BYTE",
    mask: 0xf000,
    code: 0x6000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00ff, shift: 0 },
    ],
  },
  {
    name: "ADD_VX_BYTE",
    mask: 0xf000,
    code: 0x7000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00ff, shift: 0 },
    ],
  },
  {
    name: "LD_VX_VY",
    mask: 0xf00f,
    code: 0x8000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "OR_VX_VY",
    mask: 0xf00f,
    code: 0x8001,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "AND_VX_VY",
    mask: 0xf00f,
    code: 0x8002,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "XOR_VX_VY",
    mask: 0xf00f,
    code: 0x8003,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "ADD_VX_VY",
    mask: 0xf00f,
    code: 0x8004,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "SUB_VX_VY",
    mask: 0xf00f,
    code: 0x8005,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "SHR_VX_VY",
    mask: 0xf00f,
    code: 0x8006,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "SUBN_VX_VY",
    mask: 0xf00f,
    code: 0x8007,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "SHL_VX_VY",
    mask: 0xf00f,
    code: 0x800e,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "SNE_VX_VY",
    mask: 0xf00f,
    code: 0x9000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
    ],
  },
  {
    name: "LD_I_ADDR",
    mask: 0xf000,
    code: 0xa000,
    args: [{ mask: 0x0fff, shift: 0 }],
  },
  {
    name: "JP_VP_ADDR",
    mask: 0xf000,
    code: 0xb000,
    args: [{ mask: 0x0fff, shift: 0 }],
  },
  {
    name: "RND_VX_BYTE",
    mask: 0xf000,
    code: 0xc000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00ff, shift: 0 },
    ],
  },
  {
    name: "DRW_VX_VY_NIBBLE",
    mask: 0xf000,
    code: 0xd000,
    args: [
      { mask: 0x0f00, shift: 8 },
      { mask: 0x00f0, shift: 4 },
      { mask: 0x000f, shift: 0 },
    ],
  },
  {
    name: "SKP_VX",
    mask: 0xf0ff,
    code: 0xe09e,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "SKNP_VX",
    mask: 0xf0ff,
    code: 0xe0a1,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_VX_DT",
    mask: 0xf0ff,
    code: 0xf007,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_VX_K",
    mask: 0xf0ff,
    code: 0xf00a,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_DT_VX",
    mask: 0xf0ff,
    code: 0xf015,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_ST_VX",
    mask: 0xf0ff,
    code: 0xf018,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "ADD_I_VX",
    mask: 0xf0ff,
    code: 0xf01e,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_F_VX",
    mask: 0xf0ff,
    code: 0xf029,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_B_VX",
    mask: 0xf0ff,
    code: 0xf033,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_[I]_VX",
    mask: 0xf0ff,
    code: 0xf055,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
  {
    name: "LD_VX_[I]",
    mask: 0xf0ff,
    code: 0xf065,
    args: [{ mask: 0x0f00, shift: 8 }],
  },
];
