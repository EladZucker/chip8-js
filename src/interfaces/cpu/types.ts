export type OpcodeArgument = {
  mask: number;
  shift: number;
};
export type OpcodeDefinitions = {
  name: string;
  mask: number;
  code: number;
  args: OpcodeArgument[];
};
