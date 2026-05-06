import {
  F,
  agregarPadding,
  bytesAEntero,
  bytesAHex,
  cifrarBloque,
  generarSubclaves,
  hexABytes,
  prepararClave,
  seed_cifrar,
  seed_descifrar,
} from '../archivo';
import { numberToHex32, safeTextPreview, sanitizeHex, splitBlocks } from './seedFormatters';
import type {
  SeedBlockTrace,
  SeedDecryptionTrace,
  SeedEncryptionTrace,
  SeedRoundTrace,
  SeedSubkeyTrace,
} from './seedTraceTypes';

type SeedSubkeyPair = [number, number];

const joinWordPairHex = (left: number, right: number): string =>
  `${numberToHex32(left)}${numberToHex32(right)}`;

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

const subkeysToTrace = (subkeys: SeedSubkeyPair[]): SeedSubkeyTrace[] =>
  subkeys.map((subkey, index) => ({
    index,
    label: `K${index}`,
    k0Hex: numberToHex32(subkey[0]),
    k1Hex: numberToHex32(subkey[1]),
    hex: joinWordPairHex(subkey[0], subkey[1]),
  }));

const createRoundTrace = (
  round: number,
  l0: number,
  l1: number,
  r0: number,
  r1: number,
  subkey: SeedSubkeyPair,
): { roundTrace: SeedRoundTrace; nextL0: number; nextL1: number; nextR0: number; nextR1: number } => {
  const [f0, f1] = F(r0, r1, subkey[0], subkey[1]);
  const nextR0 = (f0 ^ l0) >>> 0;
  const nextR1 = (f1 ^ l1) >>> 0;
  const nextL0 = r0;
  const nextL1 = r1;

  return {
    roundTrace: {
      round,
      LBeforeWordsHex: [numberToHex32(l0), numberToHex32(l1)],
      RBeforeWordsHex: [numberToHex32(r0), numberToHex32(r1)],
      LBeforeHex: joinWordPairHex(l0, l1),
      RBeforeHex: joinWordPairHex(r0, r1),
      subkeyWordsHex: [numberToHex32(subkey[0]), numberToHex32(subkey[1])],
      subkeyHex: joinWordPairHex(subkey[0], subkey[1]),
      fResultWordsHex: [numberToHex32(f0), numberToHex32(f1)],
      fResultHex: joinWordPairHex(f0, f1),
      LAfterWordsHex: [numberToHex32(nextL0), numberToHex32(nextL1)],
      RAfterWordsHex: [numberToHex32(nextR0), numberToHex32(nextR1)],
      LAfterHex: joinWordPairHex(nextL0, nextL1),
      RAfterHex: joinWordPairHex(nextR0, nextR1),
    },
    nextL0,
    nextL1,
    nextR0,
    nextR1,
  };
};

const traceBlock = (
  block: Uint8Array,
  subkeysInOrder: SeedSubkeyPair[],
  index: number,
): SeedBlockTrace => {
  let l0 = bytesAEntero(block.slice(0, 4));
  let l1 = bytesAEntero(block.slice(4, 8));
  let r0 = bytesAEntero(block.slice(8, 12));
  let r1 = bytesAEntero(block.slice(12, 16));
  const rounds: SeedRoundTrace[] = [];

  for (let roundIndex = 0; roundIndex < subkeysInOrder.length; roundIndex += 1) {
    const { roundTrace, nextL0, nextL1, nextR0, nextR1 } = createRoundTrace(
      roundIndex + 1,
      l0,
      l1,
      r0,
      r1,
      subkeysInOrder[roundIndex],
    );

    rounds.push(roundTrace);
    l0 = nextL0;
    l1 = nextL1;
    r0 = nextR0;
    r1 = nextR1;
  }

  return {
    index,
    inputBlockHex: bytesAHex(block),
    outputBlockHex: joinWordPairHex(r0, r1) + joinWordPairHex(l0, l1),
    rounds,
  };
};

export const createEncryptionTrace = (message: string, key: string): SeedEncryptionTrace => {
  const preparedKey = prepararClave(key);
  const subkeys = generarSubclaves(preparedKey);
  const paddedMessage = agregarPadding(message);
  const messageBytes = new TextEncoder().encode(message);
  const blocks = splitBlocks(paddedMessage).map((block, index) => traceBlock(block, subkeys, index));

  const tracedResultHex = blocks.map((block) => block.outputBlockHex).join('');
  const referenceResultHex = seed_cifrar(message, key);

  if (tracedResultHex !== referenceResultHex) {
    throw new Error('La traza de cifrado no coincide con seed_cifrar.');
  }

  const encryptedBytes = hexABytes(referenceResultHex);

  return {
    input: {
      mode: 'encrypt',
      originalMessage: message,
      originalKey: key,
    },
    keyPreparation: {
      originalKey: key,
      preparedKeyBytes: preparedKey,
      preparedKeyHex: bytesAHex(preparedKey),
      preparedKeyTextPreview: safeTextPreview(preparedKey),
    },
    padding: {
      messageBytes,
      messageBytesHex: bytesAHex(messageBytes),
      paddedBytes: paddedMessage,
      paddedHex: bytesAHex(paddedMessage),
      paddingLength: paddedMessage.length - messageBytes.length,
    },
    subkeys: subkeysToTrace(subkeys),
    blocks,
    finalResultHex: referenceResultHex,
    finalResultBase64: bytesToBase64(encryptedBytes),
  };
};

export const createDecryptionTrace = (cipherHexInput: string, key: string): SeedDecryptionTrace => {
  const cipherHex = sanitizeHex(cipherHexInput);
  const cipherBytes = hexABytes(cipherHex);
  const preparedKey = prepararClave(key);
  const subkeys = generarSubclaves(preparedKey);
  const reversedSubkeys = [...subkeys].reverse();
  const blocks = splitBlocks(cipherBytes).map((block, index) => traceBlock(block, reversedSubkeys, index));
  const paddedPlaintextBytes = new Uint8Array(
    blocks.flatMap((block) => Array.from(hexABytes(block.outputBlockHex))),
  );
  const paddingLength = paddedPlaintextBytes[paddedPlaintextBytes.length - 1] ?? 0;
  const unpaddedPlaintextBytes = paddedPlaintextBytes.slice(0, paddedPlaintextBytes.length - paddingLength);
  const finalPlaintext = new TextDecoder().decode(unpaddedPlaintextBytes);
  const referencePlaintext = seed_descifrar(cipherHex, key);

  if (finalPlaintext !== referencePlaintext) {
    throw new Error('La traza de descifrado no coincide con seed_descifrar.');
  }

  return {
    input: {
      mode: 'decrypt',
      originalCipherHex: cipherHex.toUpperCase(),
      originalKey: key,
    },
    cipherInput: {
      cipherHex: cipherHex.toUpperCase(),
      cipherBytes,
      cipherBytesHex: bytesAHex(cipherBytes),
    },
    keyPreparation: {
      originalKey: key,
      preparedKeyBytes: preparedKey,
      preparedKeyHex: bytesAHex(preparedKey),
      preparedKeyTextPreview: safeTextPreview(preparedKey),
    },
    subkeys: subkeysToTrace(subkeys),
    reversedSubkeys: subkeysToTrace(reversedSubkeys),
    blocks,
    paddingRemoved: {
      paddingLength,
      paddedPlaintextBytes,
      paddedPlaintextHex: bytesAHex(paddedPlaintextBytes),
      unpaddedPlaintextBytes,
      unpaddedPlaintextHex: bytesAHex(unpaddedPlaintextBytes),
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

export const verifyBlockAgainstOriginal = (
  block: Uint8Array,
  subkeys: SeedSubkeyPair[],
  expectedHex: string,
): boolean => bytesAHex(cifrarBloque(block, subkeys)) === expectedHex;
