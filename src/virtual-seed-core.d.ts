declare module 'virtual:seed-core' {
  export const prepararClave: (clave: string) => Uint8Array;
  export const agregarPadding: (mensaje: string) => Uint8Array;
  export const bytesAEntero: (bytes: Uint8Array) => number;
  export const enteroABytes: (x: number) => number[];
  export const bytes64ABigint: (bytes: Uint8Array) => bigint;
  export const bigintABytes64: (n: bigint) => number[];
  export const suma32: (a: number, b: number) => number;
  export const resta32: (a: number, b: number) => number;
  export const rotDerecha64: (valor: bigint, bits: bigint) => bigint;
  export const rotIzquierda64: (valor: bigint, bits: bigint) => bigint;
  export const G: (x: number) => number;
  export const F: (r0: number, r1: number, k0: number, k1: number) => [number, number];
  export const generarSubclaves: (clave: Uint8Array) => [number, number][];
  export const cifrarBloque: (bloque: Uint8Array, subclaves: [number, number][]) => Uint8Array;
  export const descifrarBloque: (bloque: Uint8Array, subclaves: [number, number][]) => Uint8Array;
  export const bytesAHex: (bytes: Uint8Array) => string;
  export const hexABytes: (hex: string) => Uint8Array;
  export const seed_cifrar: (mensaje: string, clave: string) => string;
  export const seed_descifrar: (cipherHex: string, clave: string) => string;
}
