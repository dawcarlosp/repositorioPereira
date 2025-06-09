// src/services/normalizaMultiValor.js

/**
 * Convierte un valor multivalor (array, string delimitado, null, undefined, etc)
 * en un array de strings limpios, únicos y no vacíos.
 * @param {any} valor
 * @param {RegExp|string} [delimitador=',|;'] - Delimitador para strings (por defecto: coma o punto y coma)
 * @returns {string[]}
 */
export function normalizaMultiValor(valor, delimitador = /,|;/) {
  if (Array.isArray(valor)) {
    return valor
      .map(x => typeof x === "string" ? x.trim() : String(x).trim())
      .filter(x => x.length > 0)
      .filter((item, idx, arr) => arr.indexOf(item) === idx); // Únicos
  }
  if (typeof valor === "string" && valor.length > 0) {
    return valor
      .split(delimitador)
      .map(x => x.trim())
      .filter(x => x.length > 0)
      .filter((item, idx, arr) => arr.indexOf(item) === idx); // Únicos
  }
  return [];
}
