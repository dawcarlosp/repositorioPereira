package ies.juanbosoco.locuventas_backend.errors.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando un usuario está autenticado pero no tiene los roles
 * necesarios para acceder a una funcionalidad específica.
 * Se mapea automáticamente a un 403 Forbidden.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class InsufficientPermissionsException extends RuntimeException {

    public InsufficientPermissionsException(String message) {
        super(message);
    }
}