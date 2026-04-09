package ies.juanbosoco.locuventas_backend.errors;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends BusinessException {
    public UserAlreadyExistsException(String email) {
        // Pasamos el mensaje y el código 409 (Conflict) a la superclase
        super("El email " + email + " ya está registrado.", HttpStatus.CONFLICT);
    }
}
