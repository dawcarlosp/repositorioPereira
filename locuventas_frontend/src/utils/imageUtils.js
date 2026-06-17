/**
 * Utilidades para manejo de imágenes de productos y países
 * Centraliza lógica de resolución de rutas de imagen
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Resuelve la ruta completa de una imagen de producto
 * @param {string|null} foto - Nombre o ruta de foto
 * @returns {string|null} URL completa de imagen o null
 */
export const resolveProductImage = (foto) => {
  if (!foto) return null;
  const path = foto.includes("/") ? foto : `productos/${foto}`;
  return `${API_URL}/imagenes/${path}`;
};

/**
 * Alias por compatibilidad (usada en ProductoCard)
 */
export const getProductImage = resolveProductImage;

/**
 * Resuelve la ruta de una bandera de país
 * @param {string|null} enlaceFoto - URL o ruta de bandera
 * @returns {string|null} URL completa o null
 */
export const resolveCountryImage = (enlaceFoto) => {
  if (!enlaceFoto) return null;
  // Si ya es una URL completa, devolverla tal cual
  if (enlaceFoto.startsWith("http")) return enlaceFoto;
  // Si no, construir URL del API
  return `${API_URL}/imagenes/paises/${enlaceFoto}`;
};

/**
 * Obtiene URL de imagen con fallback
 * @param {string|null} imagePath - Ruta de imagen
 * @param {string} fallbackSrc - Imagen por defecto si no existe
 * @returns {string} URL de imagen o fallback
 */
export const getImageWithFallback = (imagePath, fallbackSrc = "") => {
  return imagePath ? resolveProductImage(imagePath) : fallbackSrc;
};
