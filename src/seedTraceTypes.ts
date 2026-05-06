export type SeedMode = 'encrypt' | 'decrypt';

export type SeedStepId =
  | 'input'
  | 'preparation'
  | 'padding'
  | 'subkeys'
  | 'blocks'
  | 'rounds'
  | 'result';

export interface TraceInputSummary {
  mode: SeedMode;
  originalMessage?: string;
  originalCipherHex?: string;
  originalKey: string;
}

export interface KeyPreparationSummary {
  originalKey: string;
  preparedKeyBytes: Uint8Array;
  preparedKeyHex: string;
  preparedKeyTextPreview: string;
}

export interface PaddingSummary {
  messageBytes: Uint8Array;
  messageBytesHex: string;
  paddedBytes: Uint8Array;
  paddedHex: string;
  paddingLength: number;
}

export interface CipherInputSummary {
  cipherHex: string;
  cipherBytes: Uint8Array;
  cipherBytesHex: string;
}

export interface SeedSubkeyTrace {
  index: number;
  label: string;
  k0Hex: string;
  k1Hex: string;
  hex: string;
}

export interface SeedRoundTrace {
  round: number;
  LBeforeWordsHex: [string, string];
  RBeforeWordsHex: [string, string];
  LBeforeHex: string;
  RBeforeHex: string;
  subkeyWordsHex: [string, string];
  subkeyHex: string;
  fResultWordsHex: [string, string];
  fResultHex: string;
  LAfterWordsHex: [string, string];
  RAfterWordsHex: [string, string];
  LAfterHex: string;
  RAfterHex: string;
}

export interface SeedBlockTrace {
  index: number;
  inputBlockHex: string;
  outputBlockHex: string;
  rounds: SeedRoundTrace[];
}

export interface SeedEncryptionTrace {
  input: TraceInputSummary;
  keyPreparation: KeyPreparationSummary;
  padding: PaddingSummary;
  subkeys: SeedSubkeyTrace[];
  blocks: SeedBlockTrace[];
  finalResultHex: string;
}

export interface SeedDecryptionTrace {
  input: TraceInputSummary;
  cipherInput: CipherInputSummary;
  keyPreparation: KeyPreparationSummary;
  subkeys: SeedSubkeyTrace[];
  reversedSubkeys: SeedSubkeyTrace[];
  blocks: SeedBlockTrace[];
  paddingRemoved: {
    paddingLength: number;
    paddedPlaintextBytes: Uint8Array;
    paddedPlaintextHex: string;
    unpaddedPlaintextBytes: Uint8Array;
    unpaddedPlaintextHex: string;
  };
  finalPlaintext: string;
}
