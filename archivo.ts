const S0 = [
  0xA9, 0x85, 0xD6, 0xD3, 0x54, 0x1D, 0xAC, 0x25,
  0x5D, 0x43, 0x18, 0x1E, 0x51, 0xFC, 0xCA, 0x63,
  0x28, 0x44, 0x20, 0x9D, 0xE0, 0xE2, 0xC8, 0x17,
  0xA5, 0x8F, 0x03, 0x7B, 0xBB, 0x13, 0xD2, 0xEE,
  0x70, 0x8C, 0x3F, 0xA8, 0x32, 0xDD, 0xF6, 0x74,
  0xEC, 0x95, 0x0B, 0x57, 0x5C, 0x5B, 0xBD, 0x01,
  0x24, 0x1C, 0x73, 0x98, 0x10, 0xCC, 0xF2, 0xD9,
  0x2C, 0xE7, 0x72, 0x83, 0x9B, 0xD1, 0x86, 0xC9,
  0x60, 0x50, 0xA3, 0xEB, 0x0D, 0xB6, 0x9E, 0x4F,
  0xB7, 0x5A, 0xC6, 0x78, 0xA6, 0x12, 0xAF, 0xD5,
  0x61, 0xC3, 0xB4, 0x41, 0x52, 0x7D, 0x8D, 0x08,
  0x1F, 0x99, 0x00, 0x19, 0x04, 0x53, 0xF7, 0xE1,
  0xFD, 0x76, 0x2F, 0x27, 0xB0, 0x8B, 0x0E, 0xAB,
  0xA2, 0x6E, 0x93, 0x4D, 0x69, 0x7C, 0x09, 0x0A,
  0xBF, 0xEF, 0xF3, 0xC5, 0x87, 0x14, 0xFE, 0x64,
  0xDE, 0x2E, 0x4B, 0x1A, 0x06, 0x21, 0x6B, 0x66,
  0x02, 0xF5, 0x92, 0x8A, 0x0C, 0xB3, 0x7E, 0xD0,
  0x7A, 0x47, 0x96, 0xE5, 0x26, 0x80, 0xAD, 0xDF,
  0xA1, 0x30, 0x37, 0xAE, 0x36, 0x15, 0x22, 0x38,
  0xF4, 0xA7, 0x45, 0x4C, 0x81, 0xE9, 0x84, 0x97,
  0x35, 0xCB, 0xCE, 0x3C, 0x71, 0x11, 0xC7, 0x89,
  0x75, 0xFB, 0xDA, 0xF8, 0x94, 0x59, 0x82, 0xC4,
  0xFF, 0x49, 0x39, 0x67, 0xC0, 0xCF, 0xD7, 0xB8,
  0x0F, 0x8E, 0x42, 0x23, 0x91, 0x6C, 0xDB, 0xA4,
  0x34, 0xF1, 0x48, 0xC2, 0x6F, 0x3D, 0x2D, 0x40,
  0xBE, 0x3E, 0xBC, 0xC1, 0xAA, 0xBA, 0x4E, 0x55,
  0x3B, 0xDC, 0x68, 0x7F, 0x9C, 0xD8, 0x4A, 0x56,
  0x77, 0xA0, 0xED, 0x46, 0xB5, 0x2B, 0x65, 0xFA,
  0xE3, 0xB9, 0xB1, 0x9F, 0x5E, 0xF9, 0xE6, 0xB2,
  0x31, 0xEA, 0x6D, 0x5F, 0xE4, 0xF0, 0xCD, 0x88,
  0x16, 0x3A, 0x58, 0xD4, 0x62, 0x29, 0x07, 0x33,
  0xE8, 0x1B, 0x05, 0x79, 0x90, 0x6A, 0x2A, 0x9A
]

// S-Box S1: segunda tabla de sustitución
const S1 = [
  0x38, 0xE8, 0x2D, 0xA6, 0xCF, 0xDE, 0xB3, 0xB8,
  0xAF, 0x60, 0x55, 0xC7, 0x44, 0x6F, 0x6B, 0x5B,
  0xC3, 0x62, 0x33, 0xB5, 0x29, 0xA0, 0xE2, 0xA7,
  0xD3, 0x91, 0x11, 0x06, 0x1C, 0xBC, 0x36, 0x4B,
  0xEF, 0x88, 0x6C, 0xA8, 0x17, 0xC4, 0x16, 0xF4,
  0xC2, 0x45, 0xE1, 0xD6, 0x3F, 0x3D, 0x8E, 0x98,
  0x28, 0x4E, 0xF6, 0x3E, 0xA5, 0xF9, 0x0D, 0xDF,
  0xD8, 0x2B, 0x66, 0x7A, 0x27, 0x2F, 0xF1, 0x72,
  0x42, 0xD4, 0x41, 0xC0, 0x73, 0x67, 0xAC, 0x8B,
  0xF7, 0xAD, 0x80, 0x1F, 0xCA, 0x2C, 0xAA, 0x34,
  0xD2, 0x0B, 0xEE, 0xE9, 0x5D, 0x94, 0x18, 0xF8,
  0x57, 0xAE, 0x08, 0xC5, 0x13, 0xCD, 0x86, 0xB9,
  0xFF, 0x7D, 0xC1, 0x31, 0xF5, 0x8A, 0x6A, 0xB1,
  0xD1, 0x20, 0xD7, 0x02, 0x22, 0x04, 0x68, 0x71,
  0x07, 0xDB, 0x9D, 0x99, 0x61, 0xBE, 0xE6, 0x59,
  0xDD, 0x51, 0x90, 0xDC, 0x9A, 0xA3, 0xAB, 0xD0,
  0x81, 0x0F, 0x47, 0x1A, 0xE3, 0xEC, 0x8D, 0xBF,
  0x96, 0x7B, 0x5C, 0xA2, 0xA1, 0x63, 0x23, 0x4D,
  0xC8, 0x9E, 0x9C, 0x3A, 0x0C, 0x2E, 0xBA, 0x6E,
  0x9F, 0x5A, 0xF2, 0x92, 0xF3, 0x49, 0x78, 0xCC,
  0x15, 0xFB, 0x70, 0x75, 0x7F, 0x35, 0x10, 0x03,
  0x64, 0x6D, 0xC6, 0x74, 0xD5, 0xB4, 0xEA, 0x09,
  0x76, 0x19, 0xFE, 0x40, 0x12, 0xE0, 0xBD, 0x05,
  0xFA, 0x01, 0xF0, 0x2A, 0x5E, 0xA9, 0x56, 0x43,
  0x85, 0x14, 0x89, 0x9B, 0xB0, 0xE5, 0x48, 0x79,
  0x97, 0xFC, 0x1E, 0x82, 0x21, 0x8C, 0x1B, 0x5F,
  0x77, 0x54, 0xB2, 0x1D, 0x25, 0x4F, 0x00, 0x46,
  0xED, 0x58, 0x52, 0xEB, 0x7E, 0xDA, 0xC9, 0xFD,
  0x30, 0x95, 0x65, 0x3C, 0xB6, 0xE4, 0xBB, 0x7C,
  0x0E, 0x50, 0x39, 0x26, 0x32, 0x84, 0x69, 0x93,
  0x37, 0xE7, 0x24, 0xA4, 0xCB, 0x53, 0x0A, 0x87,
  0xD9, 0x4C, 0x83, 0x8F, 0xCE, 0x3B, 0x4A, 0xB7
]

// Constantes KCi usadas en el Key Schedule
// Derivadas del número áureo para evitar patrones predecibles
const KC = [
  0x9E3779B9, 0x3C6EF373, 0x78DDE6E6, 0xF1BBCDCC,
  0xE3779B99, 0xC6EF3733, 0x8DDE6E67, 0x1BBCDCCF,
  0x3779B99E, 0x6EF3733C, 0xDDE6E678, 0xBBCDCCF1,
  0x779B99E3, 0xEF3733C6, 0xDE6E678D, 0xBCDCCF1B
]

// Máscaras para la función G
const M0 = 0xFC  // 11111100
const M1 = 0xF3  // 11110011
const M2 = 0xCF  // 11001111
const M3 = 0x3F  // 00111111

// Módulo para operaciones de 32 bits
const MOD32 = 0x100000000  // 2^32

export const prepararClave = (clave: string): Uint8Array => {
  const claveBytes = new TextEncoder().encode(clave);

  if (claveBytes.length > 16) {
    return claveBytes.slice(0, 16);
  } else if (claveBytes.length < 16) {
    const paddedClave = new Uint8Array(16);
    paddedClave.set(claveBytes);
    return paddedClave;
  }

  return claveBytes;
}

export const bytesToPythonStyle = (bytes: Uint8Array): string => {
  let result = "b'";

  for (const byte of bytes) {
    // caracteres ASCII imprimibles (espacio hasta ~)
    if (byte >= 32 && byte <= 126 && byte !== 92 && byte !== 39) {
      result += String.fromCharCode(byte);
    } else {
      result += '\\x' + byte.toString(16).padStart(2, '0');
    }
  }

  result += "'";
  return result;
};

export const agregar_padding = (mensaje: string): Uint8Array => {
  const mensajeBytes = new TextEncoder().encode(mensaje);
  const paddingLength = (16 - (mensajeBytes.length % 16)) % 16;
  const paddedMensaje = new Uint8Array(mensajeBytes.length + paddingLength);
  paddedMensaje.set(mensajeBytes);
  // El padding se llena con el número de bytes de padding, siguiendo el estándar PKCS#7
  paddedMensaje.fill(paddingLength, mensajeBytes.length);
  return paddedMensaje;
}

export const bytes_a_entero = (bytes: Uint8Array): number => {
  let result = 0;
  for (let i = 0; i < bytes.length; i++) {
    // << 8 es equivalente a multiplicar por 256, lo que desplaza los bits a la izquierda
    // | es el operador OR a nivel de bits, que combina los bits del resultado actual con el nuevo byte
    result = ((result << 8) | bytes[i]) >>> 0; // >>> 0 asegura que el resultado sea tratado como un entero sin signo de 32 bits
  }

  return result;
}

export const bytes64_a_bigint = (bytes: Uint8Array): bigint => {
  let result = 0n;
  for (const b of bytes) {
    result = (result << 8n) | BigInt(b);
  }
  return result;
};

export const bigint_a_bytes64 = (n: bigint): number[] => {
  const bytes = new Array(8).fill(0);
  for (let i = 7; i >= 0; i--) {
    bytes[i] = Number(n & 0xFFn);
    n >>= 8n;
  }
  return bytes;
};

export const suma32 = (a: number, b: number): number => {
  // """Suma modular de 32 bits: si el resultado supera 32 bits, se descarta el resto"""
  return (a + b) >>> 0; // >>> 0 asegura que el resultado sea tratado como un entero sin signo de 32 bits
}

export const resta32 = (a: number, b: number): number => {
  //  """Resta modular de 32 bits"""
  return (a - b + MOD32) % MOD32  // Agregar MOD32 para evitar resultados negativos
}

export const rotDerecha64 = (valor: bigint, bits: bigint): bigint => {
  const mask = (1n << 64n) - 1n;
  return ((valor >> bits) | (valor << (64n - bits))) & mask;
};

export const rotIzquierda64 = (valor: bigint, bits: bigint): bigint => {
  const mask = (1n << 64n) - 1n;
  return ((valor << bits) | (valor >> (64n - bits))) & mask;
};

export const G = (x: number): number => {
  //console.log(`Función G: input = ${x}`);

  // >> es el operador de desplazamiento a la derecha, es como dividir por 256, lo que mueve los bits a la derecha
  // & es el operador AND a nivel de bits, que extrae solo los bits relevantes para cada byte
  const byte0 = x & 0xFF; // Extrae el byte menos significativo (bits 0-7)
  const byte1 = (x >> 8) & 0xFF; // Desplaza 8 bits a la derecha y extrae el siguiente byte (bits 8-15)
  const byte2 = (x >> 16) & 0xFF; // Desplaza 16 bits a la derecha y extrae el siguiente byte (bits 16-23)
  const byte3 = (x >> 24) & 0xFF; // Desplaza 24 bits a la derecha y extrae el byte más significativo (bits 24-31)

  //console.log(`Bytes extraídos: byte0 = ${byte0}, byte1 = ${byte1}, byte2 = ${byte2}, byte3 = ${byte3}`);

  const s0_x0 = S0[byte0]
  const s1_x1 = S1[byte1]
  const s0_x2 = S0[byte2]
  const s1_x3 = S1[byte3]

  //console.log(`S-Box outputs: S0[${byte0}] = ${s0_x0}, S1[${byte1}] = ${s1_x1}, S0[${byte2}] = ${s0_x2}, S1[${byte3}] = ${s1_x3}`);

  // La función G combina los resultados de las S-Boxes usando operaciones AND y XOR con las máscaras M0, M1, M2, M3
  // ^ es el operador XOR a nivel de bits
  const Z0 = (s0_x0 & M0) ^ (s1_x1 & M1) ^ (s0_x2 & M2) ^ (s1_x3 & M3)
  const Z1 = (s0_x0 & M1) ^ (s1_x1 & M2) ^ (s0_x2 & M3) ^ (s1_x3 & M0)
  const Z2 = (s0_x0 & M2) ^ (s1_x1 & M3) ^ (s0_x2 & M0) ^ (s1_x3 & M1)
  const Z3 = (s0_x0 & M3) ^ (s1_x1 & M0) ^ (s0_x2 & M1) ^ (s1_x3 & M2)

  //console.log(`Resultados intermedios: Z0 = ${Z0}, Z1 = ${Z1}, Z2 = ${Z2}, Z3 = ${Z3}`);

  // Combina los resultados Z0, Z1, Z2, Z3 en un solo número de 32 bits
  const result = ((Z3 << 24) | (Z2 << 16) | (Z1 << 8) | Z0) >>> 0;
  return result;

}

export const F = (R: bigint, Ki: Uint8Array): bigint => {
  // dividir R (64 bits)
  const R0 = Number((R >> 32n) & 0xFFFFFFFFn);
  const R1 = Number(R & 0xFFFFFFFFn);

  // dividir subclave
  const Ki0 =
    (Ki[0] << 24) | (Ki[1] << 16) | (Ki[2] << 8) | Ki[3];

  const Ki1 =
    (Ki[4] << 24) | (Ki[5] << 16) | (Ki[6] << 8) | Ki[7];

  // XOR
  const A = R0 ^ Ki0;
  const B = R1 ^ Ki1;

  // capas G
  const T0 = G(A ^ B);
  const T1 = G(suma32(T0, A));
  const T2 = G(suma32(T1, T0));

  const R0_nuevo = suma32(T2, T1);
  const R1_nuevo = T2;

  // reconstruir 64 bits
  return (BigInt(R0_nuevo) << 32n) | BigInt(R1_nuevo);
};

export const generarSubclaves = (clave: Uint8Array): Uint8Array[] => {
  let key_0 = bytes_a_entero(clave.slice(0, 4));
  let key_1 = bytes_a_entero(clave.slice(4, 8));
  let key_2 = bytes_a_entero(clave.slice(8, 12));
  let key_3 = bytes_a_entero(clave.slice(12, 16));

  const subclaves: Uint8Array[] = [];

  for (let i = 0; i < 16; i++) {
    const KCi = KC[i];
    //console.log(`Generando subclave ${i}: KC[${i}] = ${KCi}`);

    const Ki0 = G(suma32(key_0, resta32(key_2, KCi)))

    // Ki0_1 es la subclave que se obtiene al restar KCi a key_2 y luego restar el resultado a key_0, todo esto dentro de la función G
    const Ki1 = G(suma32(resta32(key_1, key_3), KCi))

    const buffer = new Uint8Array(8);

    buffer[0] = (Ki0 >>> 24) & 0xFF;
    buffer[1] = (Ki0 >>> 16) & 0xFF;
    buffer[2] = (Ki0 >>> 8) & 0xFF;
    buffer[3] = Ki0 & 0xFF;

    buffer[4] = (Ki1 >>> 24) & 0xFF;
    buffer[5] = (Ki1 >>> 16) & 0xFF;
    buffer[6] = (Ki1 >>> 8) & 0xFF;
    buffer[7] = Ki1 & 0xFF;

    subclaves.push(buffer);

    if ((i + 1) % 2 == 1) {
      let combined = (BigInt(key_0) << 32n) | BigInt(key_1);

      combined = rotDerecha64(combined, 8n);

      key_0 = Number((combined >> 32n) & 0xFFFFFFFFn);
      key_1 = Number(combined & 0xFFFFFFFFn);
    } else {
      let combined = (BigInt(key_2) << 32n) | BigInt(key_3);

      combined = rotIzquierda64(combined, 8n);

      key_2 = Number((combined >> 32n) & 0xFFFFFFFFn);
      key_3 = Number(combined & 0xFFFFFFFFn);
    }

  }

  return subclaves;
}

export const cifrar_bloque = (bloque: Uint8Array, subclaves: Uint8Array[]): Uint8Array => {
  let L = bytes64_a_bigint(bloque.slice(0, 8));
  let R = bytes64_a_bigint(bloque.slice(8, 16));

  for (let i = 0; i < 15; i++) {
    const T = R
    R = L ^ F(R, subclaves[i]);
    L = T;
  }

  L = L ^ F(R, subclaves[15])

  return new Uint8Array([
    ...bigint_a_bytes64(L),
    ...bigint_a_bytes64(R)
  ]);
}

export const descifrar_bloque = (
  bloque: Uint8Array,
  subclaves: Uint8Array[]
): Uint8Array => {
  // invertir subclaves
  const subclavesInvertidas = [...subclaves].reverse();

  // reutilizar la misma función
  return cifrar_bloque(bloque, subclavesInvertidas);
};

export const seed_cifrar = (mensaje: string, clave: string): string => {

  const clavePreparada = prepararClave(clave);
  const subclaves = generarSubclaves(clavePreparada);

  /* console.log('Subclaves generadas:');
  subclaves.forEach((subclave, index) => {
    const subclaveHex = Array.from(subclave).map(byte => byte.toString(16).padStart(2, '0')).join('');
    console.log(`Subclave ${index}: ${BigInt("0x" + subclaveHex).toString()}`);
  }); */

  // Agrega padding para completar bloques de 16 bytes
  const mensaje_con_padding = agregar_padding(mensaje);

  console.log("Mensaje con padding:", bytesToPythonStyle(mensaje_con_padding));

  let resultadoBytes: number[] = [];

  for (let i = 0; i < mensaje_con_padding.length; i += 16) {
    const bloque = mensaje_con_padding.slice(i, i + 16);
    const bloqueCifrado = cifrar_bloque(bloque, subclaves);
    console.log(`Bloque ${i / 16}:`, bytesToPythonStyle(bloqueCifrado));
    resultadoBytes.push(...bloqueCifrado);
  }

  return resultadoBytes
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}


export const seed_descifrar = (cipherHex: string, clave: string): string => {
  const clavePreparada = prepararClave(clave);
  const subclaves = generarSubclaves(clavePreparada);
  const subclavesInvertidas = [...subclaves].reverse();

  // convertir hex → bytes
  const bytes = new Uint8Array(
    cipherHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );

  let resultadoBytes: number[] = [];

  for (let i = 0; i < bytes.length; i += 16) {
    const bloque = bytes.slice(i, i + 16);
    const bloqueDescifrado = cifrar_bloque(bloque, subclavesInvertidas);
    resultadoBytes.push(...bloqueDescifrado);
  }

  // quitar padding (PKCS#7)
  const padding = resultadoBytes[resultadoBytes.length - 1];
  const mensajeSinPadding = resultadoBytes.slice(0, -padding);

  return new TextDecoder().decode(new Uint8Array(mensajeSinPadding));
};

const main = () => {
  const clave = "MiClaveSecreta16";
  const mensaje = "Hola, esto es una prueba del algoritmo SEED!";

  const mensaje_cifrado = seed_cifrar(mensaje, clave);

  console.log("Mensaje cifrado:", mensaje_cifrado);

  const mensaje_descifrado = seed_descifrar(mensaje_cifrado, clave);

  console.log("Mensaje descifrado (hex):", mensaje_descifrado);
}

main()
