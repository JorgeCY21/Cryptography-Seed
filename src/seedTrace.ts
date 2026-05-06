import {
  F,
  agregarPadding,
  bytesAEntero,
  bytesAHex,
  cifrarBloque,
  descifrarBloque,
  generarSubclaves,
  hexABytes,
  prepararClave,
  seed_cifrar,
  seed_descifrar,
} from 'virtual:seed-core';
import { numberToHex32, safeTextPreview, sanitizeHex, splitBlocks } from './seedFormatters';
import type {
  SeedBlockTrace,
  SeedDecryptionTrace,
  SeedEncryptionTrace,
  SeedRoundTrace,
  SeedSubkeyTrace,
} from './seedTraceTypes';

type SeedSubkeyPair = [number, number];

export const MAX_KEY_BYTES = 16;

const joinWordPairHex = (left: number, right: number): string =>
  `${numberToHex32(left)}${numberToHex32(right)}`;

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

const concatBlocks = (blocks: Uint8Array[]): Uint8Array =>
  new Uint8Array(blocks.flatMap((block) => Array.from(block)));

const xorBlocks = (left: Uint8Array, right: Uint8Array): Uint8Array => {
  const output = new Uint8Array(left.length);

  for (let index = 0; index < left.length; index += 1) {
    output[index] = left[index] ^ right[index];
  }

  return output;
};

const stripPkcs7Padding = (
  bytes: Uint8Array,
): { paddingLength: number; unpaddedPlaintextBytes: Uint8Array } => {
  const paddingLength = bytes[bytes.length - 1] ?? 0;

  if (paddingLength < 1 || paddingLength > 16) {
    throw new Error('Padding invalido.');
  }

  for (let index = bytes.length - paddingLength; index < bytes.length; index += 1) {
    if (bytes[index] !== paddingLength) {
      throw new Error('Padding invalido.');
    }
  }

  return {
    paddingLength,
    unpaddedPlaintextBytes: bytes.slice(0, bytes.length - paddingLength),
  };
};

const decodeUtf8Strict = (bytes: Uint8Array): string =>
  new TextDecoder('utf-8', { fatal: true }).decode(bytes);

export const getUtf8ByteLength = (value: string): number =>
  new TextEncoder().encode(value).length;

export const getNormalizedHexLength = (value: string): number =>
  sanitizeHex(value).length;

export const validateSecretKey = (key: string): string | null => {
  if (!key.trim()) {
    return 'Ingresa una clave secreta antes de continuar.';
  }

  const keyBytesLength = getUtf8ByteLength(key);

  if (keyBytesLength > MAX_KEY_BYTES) {
    return `La clave supera el limite de ${MAX_KEY_BYTES} bytes UTF-8. Usa una clave mas corta para evitar recortes.`;
  }

  return null;
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
  };
};

export const createDecryptionTrace = (cipherHexInput: string, key: string): SeedDecryptionTrace => {
  const cipherHex = sanitizeHex(cipherHexInput);
  const cipherBytes = hexABytes(cipherHex);
  const preparedKey = prepararClave(key);
  const subkeys = generarSubclaves(preparedKey);
  const reversedSubkeys = [...subkeys].reverse();
  const tracedBlocks = splitBlocks(cipherBytes).map((block, index) => traceBlock(block, reversedSubkeys, index));

  let blocks = tracedBlocks;
  let paddedPlaintextBytes: Uint8Array;
  let paddingLength: number;
  let unpaddedPlaintextBytes: Uint8Array;
  let finalPlaintext: string;
  let decryptionVariant: 'direct' | 'cbc-zero-iv' = 'direct';
  let decryptionVariantLabel = 'Modo directo del archivo base';

  try {
    const referencePlaintext = seed_descifrar(cipherHex, key);
    paddedPlaintextBytes = concatBlocks(blocks.map((block) => hexABytes(block.outputBlockHex)));
    ({ paddingLength, unpaddedPlaintextBytes } = stripPkcs7Padding(paddedPlaintextBytes));
    finalPlaintext = decodeUtf8Strict(unpaddedPlaintextBytes);

    if (finalPlaintext !== referencePlaintext) {
      throw new Error('La traza de descifrado no coincide con seed_descifrar.');
    }
  } catch (directError) {
    const cipherBlocks = splitBlocks(cipherBytes);
    const zeroIv = new Uint8Array(16);
    const compatiblePlaintextBlocks = cipherBlocks.map((cipherBlock, index) => {
      const rawDecryptedBlock = descifrarBloque(cipherBlock, subkeys);
      const previousCipherBlock = index === 0 ? zeroIv : cipherBlocks[index - 1];
      return xorBlocks(rawDecryptedBlock, previousCipherBlock);
    });

    try {
      paddedPlaintextBytes = concatBlocks(compatiblePlaintextBlocks);
      ({ paddingLength, unpaddedPlaintextBytes } = stripPkcs7Padding(paddedPlaintextBytes));
      finalPlaintext = decodeUtf8Strict(unpaddedPlaintextBytes);
      decryptionVariant = 'cbc-zero-iv';
      decryptionVariantLabel = 'Modo compatible CBC con IV cero';
      blocks = tracedBlocks.map((block, index) => ({
        ...block,
        outputBlockHex: bytesAHex(compatiblePlaintextBlocks[index]),
      }));
    } catch {
      throw directError;
    }
  }

  return {
    input: {
      mode: 'decrypt',
      originalCipherHex: cipherHex.toUpperCase(),
      originalKey: key,
    },
    decryptionVariant,
    decryptionVariantLabel,
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
    finalPlaintext,
  };
};

export const validateDecryptInput = (cipherHex: string, key: string): string | null => {
  if (!cipherHex.trim()) {
    return 'Completa el texto cifrado antes de desencriptar.';
  }

  const keyValidation = validateSecretKey(key);

  if (keyValidation) {
    return keyValidation;
  }

  const normalized = sanitizeHex(cipherHex);

  if (!normalized) {
    return 'El texto cifrado no puede quedar vacio despues de quitar espacios.';
  }

  if (!/^[0-9a-f]+$/i.test(normalized)) {
    return 'El texto cifrado debe contener solo caracteres hexadecimales.';
  }

  if (normalized.length % 2 !== 0) {
    return 'El texto cifrado debe tener una cantidad par de caracteres hexadecimales.';
  }

  if (normalized.length % 32 !== 0) {
    return 'La longitud hexadecimal debe ser multiplo de 32 caracteres (16 bytes por bloque).';
  }

  return null;
};

export const validateEncryptInput = (message: string, key: string): string | null => {
  if (!message.trim()) {
    return 'Completa el mensaje antes de encriptar.';
  }

  const keyValidation = validateSecretKey(key);

  if (keyValidation) {
    return keyValidation;
  }

  return null;
};

export const verifyBlockAgainstOriginal = (
  block: Uint8Array,
  subkeys: SeedSubkeyPair[],
  expectedHex: string,
): boolean => bytesAHex(cifrarBloque(block, subkeys)) === expectedHex;
