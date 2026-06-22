// src/utils/imageUtils.ts

const API_URL = import.meta.env.VITE_API_URL as string;

/**
 * Resuelve la URL completa de la imagen de un producto.
 * Si `foto` ya contiene "/", se usa tal cual como ruta relativa.
 */
export const resolveProductImage = (foto: string | null | undefined): string | null => {
  if (!foto) return null;
  const path = foto.includes("/") ? foto : `productos/${foto}`;
  return `${API_URL}/imagenes/${path}`;
};

/**
 * Resuelve la URL de la bandera de un país.
 * Si ya es una URL absoluta, se devuelve sin modificar.
 */
export const resolveCountryImage = (enlaceFoto: string | null | undefined): string | null => {
  if (!enlaceFoto) return null;
  if (enlaceFoto.startsWith("http")) return enlaceFoto;
  return `${API_URL}/imagenes/paises/${enlaceFoto}`;
};

/**
 * Devuelve la URL de imagen del producto o un fallback si no existe.
 */
export const resolveProductImageWithFallback = (
  foto: string | null | undefined,
  fallback: string
): string => resolveProductImage(foto) ?? fallback;