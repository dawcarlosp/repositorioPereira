export function validateUser({ nombre, email, password, foto }, { validarFoto = false } = {}) {
  const errors = {};

  // Validación nombre
  if (!nombre?.trim()) {
    errors.nombre = "El nombre es obligatorio";
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(nombre)) {
    errors.nombre = "El nombre solo puede contener letras y espacios";
  } else if (nombre.length < 3 || nombre.length > 50) {
    errors.nombre = "Debe tener entre 3 y 50 caracteres";
  }

  // Validación email
  if (!email?.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Formato de email inválido";
  }

  // Validación contraseña (solo si se proporciona)
  if (password?.trim()) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (!pattern.test(password)) {
      errors.password =
        "Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo";
    }
  }

  // Validación de foto (opcional según el modo)
  if (validarFoto) {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ACCEPTED_TYPES = [
      "image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg"
    ];

    if (!foto) {
      errors.foto = "Debes seleccionar una foto.";
    } else if (!ACCEPTED_TYPES.includes(foto.type)) {
      errors.foto = "El tipo de archivo no es permitido: " + foto.type;
    } else if (foto.size > MAX_FILE_SIZE) {
      errors.foto = "El archivo es demasiado grande. Máximo 10 MB.";
    } else if (!foto.name || !/\.[a-zA-Z0-9]+$/.test(foto.name)) {
      errors.foto = "La foto no tiene una extensión válida.";
    }
  }

  return errors;
}
