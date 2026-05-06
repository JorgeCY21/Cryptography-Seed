import {
  F,
  agregar_padding,
  bigint_a_bytes64,
  bytes64_a_bigint,
  cifrar_bloque,
  generarSubclaves,
  prepararClave,
  seed_cifrar,
  seed_descifrar,
} from '../archivo';
import {
  bigintToHex64,
  bytesToHex,
  safeTextPreview,
  sanitizeHex,
  splitBlocks,
} from './seedFormatters';
import type {
  SeedBlockTrace,
  SeedDecryptionTrace,
  SeedEncryptionTrace,
  SeedRoundTrace,
  SeedSubkeyTrace,
} from './seedTraceTypes';

const bytesFromHex = (hex: string): Uint8Array =>
  new Uint8Array(hex.match(/.{1,2}/g)?.map((part) => parseInt(part, 16)) ?? []);

const subkeysToTrace = (subkeys: Uint8Array[]): SeedSubkeyTrace[] =>
  subkeys.map((subkey, index) => ({
    index,
    label: `K${index}`,
    hex: bytesToHex(subkey),
  }));

const createRoundTrace = (
  round: number,
  L: bigint,
  R: bigint,
  subkey: Uint8Array,
  isLastRound: boolean,
): { roundTrace: SeedRoundTrace; nextL: bigint; nextR: bigint } => {
  const fResult = F(R, subkey);
  const nextR = isLastRound ? R : (L ^ fResult);
  const nextL = isLastRound ? (L ^ fResult) : R;

  return {
    roundTrace: {
      round,
      LBeforeHex: bigintToHex64(L),
      RBeforeHex: bigintToHex64(R),
      subkeyHex: bytesToHex(subkey),
      fResultHex: bigintToHex64(fResult),
      LAfterHex: bigintToHex64(nextL),
      RAfterHex: bigintToHex64(nextR),
    },
    nextL,
    nextR,
  };
};

const traceBlock = (block: Uint8Array, subkeys: Uint8Array[], index: number): SeedBlockTrace => {
  let L = bytes64_a_bigint(block.slice(0, 8));
  let R = bytes64_a_bigint(block.slice(8, 16));
  const rounds: SeedRoundTrace[] = [];

  for (let roundIndex = 0; roundIndex < subkeys.length; roundIndex += 1) {
    const { roundTrace, nextL, nextR } = createRoundTrace(
      roundIndex + 1,
      L,
      R,
      subkeys[roundIndex],
      roundIndex === subkeys.length - 1,
    );

    rounds.push(roundTrace);
    L = nextL;
    R = nextR;
  }

  const outputBlock = new Uint8Array([...bigint_a_bytes64(L), ...bigint_a_bytes64(R)]);

  return {
    index,
    inputBlockHex: bytesToHex(block),
    outputBlockHex: bytesToHex(outputBlock),
    rounds,
  };
};

export const createEncryptionTrace = (message: string, key: string): SeedEncryptionTrace => {
  const preparedKey = prepararClave(key);
  const subkeys = generarSubclaves(preparedKey);
  const paddedMessage = agregar_padding(message);
  const messageBytes = new TextEncoder().encode(message);
  const blocks = splitBlocks(paddedMessage).map((block, index) => traceBlock(block, subkeys, index));

  const tracedResultHex = blocks.map((block) => block.outputBlockHex).join('');
  const referenceResultHex = seed_cifrar(message, key);

  if (tracedResultHex !== referenceResultHex) {
    throw new Error('La traza de cifrado no coincide con seed_cifrar.');
  }

  return {
    input: {
      mode: 'encrypt',
      originalMessage: message,
      originalKey: key,
    },
    keyPreparation: {
      originalKey: key,
      preparedKeyBytes: preparedKey,
      preparedKeyHex: bytesToHex(preparedKey),
      preparedKeyTextPreview: safeTextPreview(preparedKey),
    },
    padding: {
      messageBytes,
      messageBytesHex: bytesToHex(messageBytes),
      paddedBytes: paddedMessage,
      paddedHex: bytesToHex(paddedMessage),
      paddingLength: paddedMessage.length - messageBytes.length,
    },
    subkeys: subkeysToTrace(subkeys),
    blocks,
    finalResultHex: referenceResultHex,
  };
};

export const createDecryptionTrace = (cipherHexInput: string, key: string): SeedDecryptionTrace => {
  const cipherHex = sanitizeHex(cipherHexInput);
  const cipherBytes = bytesFromHex(cipherHex);
  const preparedKey = prepararClave(key);
  const subkeys = generarSubclaves(preparedKey);
  const reversedSubkeys = [...subkeys].reverse();
  const blocks = splitBlocks(cipherBytes).map((block, index) => traceBlock(block, reversedSubkeys, index));
  const paddedPlaintextBytes = new Uint8Array(
    blocks.flatMap((block) => Array.from(bytesFromHex(block.outputBlockHex))),
  );
  const paddingLength = paddedPlaintextBytes[paddedPlaintextBytes.length - 1] ?? 0;
  const unpaddedPlaintextBytes = paddedPlaintextBytes.slice(0, -paddingLength || paddedPlaintextBytes.length);
  const finalPlaintext = new TextDecoder().decode(unpaddedPlaintextBytes);
  const referencePlaintext = seed_descifrar(cipherHex, key);

  if (finalPlaintext !== referencePlaintext) {
    throw new Error('La traza de descifrado no coincide con seed_descifrar.');
  }

  return {
    input: {
      mode: 'decrypt',
      originalCipherHex: cipherHex,
      originalKey: key,
    },
    cipherInput: {
      cipherHex,
      cipherBytes,
      cipherBytesHex: bytesToHex(cipherBytes),
    },
    keyPreparation: {
      originalKey: key,
      preparedKeyBytes: preparedKey,
      preparedKeyHex: bytesToHex(preparedKey),
      preparedKeyTextPreview: safeTextPreview(preparedKey),
    },
    subkeys: subkeysToTrace(subkeys),
    reversedSubkeys: subkeysToTrace(reversedSubkeys),
    blocks,
    paddingRemoved: {
      paddingLength,
      paddedPlaintextBytes,
      paddedPlaintextHex: bytesToHex(paddedPlaintextBytes),
      unpaddedPlaintextBytes,
      unpaddedPlaintextHex: bytesToHex(unpaddedPlaintextBytes),
    },
    finalPlaintext: referencePlaintext,
  };
};

export const validateDecryptInput = (cipherHex: string, key: string): string | null => {
  if (!cipherHex.trim() || !key.trim()) {
    return 'Completa el texto cifrado y la clave antes de desencriptar.';
  }

  const normalized = sanitizeHex(cipherHex);

  if (!/^[0-9a-f]+$/i.test(normalized)) {
    return 'El texto cifrado debe contener solo caracteres hexadecimales.';
  }

  if (normalized.length % 32 !== 0) {
    return 'La longitud hexadecimal debe ser múltiplo de 32 caracteres (16 bytes por bloque).';
  }

  return null;
};

export const validateEncryptInput = (message: string, key: string): string | null => {
  if (!message.trim() || !key.trim()) {
    return 'Completa el mensaje y la clave antes de encriptar.';
  }

  return null;
};

export const verifyBlockAgainstOriginal = (block: Uint8Array, subkeys: Uint8Array[], expectedHex: string): boolean =>
  bytesToHex(cifrar_bloque(block, subkeys)) === expectedHex;
