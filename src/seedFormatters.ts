export const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0').toUpperCase()).join('');

export const bytesToGroupedHex = (bytes: Uint8Array, groupSize = 4): string => {
  const pairs = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0').toUpperCase());
  const groups: string[] = [];

  for (let index = 0; index < pairs.length; index += groupSize) {
    groups.push(pairs.slice(index, index + groupSize).join(' '));
  }

  return groups.join('  ');
};

export const bigintToHex64 = (value: bigint): string =>
  value.toString(16).padStart(16, '0').toUpperCase();

export const numberToHex32 = (value: number): string =>
  (value >>> 0).toString(16).padStart(8, '0').toUpperCase();

export const sanitizeHex = (value: string): string =>
  value.replace(/\s+/g, '').toLowerCase();

export const safeTextPreview = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => {
    if (byte === 0) {
      return '.';
    }

    if (byte >= 32 && byte <= 126) {
      return String.fromCharCode(byte);
    }

    return '.';
  }).join('');

export const splitBlocks = (bytes: Uint8Array, blockSize = 16): Uint8Array[] => {
  const blocks: Uint8Array[] = [];

  for (let index = 0; index < bytes.length; index += blockSize) {
    blocks.push(bytes.slice(index, index + blockSize));
  }

  return blocks;
};
