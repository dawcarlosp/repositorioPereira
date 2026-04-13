package ies.juanbosoco.locuventas_backend.errors.exceptions;

import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import org.springframework.http.HttpStatus;

/**
 * Representa un error de negocio cuando un usuario no existe.
 * Hereda de BusinessException para ser capturada automáticamente con un 404.
 */
public class UserNotFoundException extends BusinessException {

    public UserNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}