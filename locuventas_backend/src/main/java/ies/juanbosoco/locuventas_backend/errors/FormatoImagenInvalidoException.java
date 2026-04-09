package ies.juanbosoco.locuventas_backend.errors;

import org.springframework.http.HttpStatus;

public class FormatoImagenInvalidoException extends BusinessException{
    public FormatoImagenInvalidoException(String formato) {
        super("El formato '" + formato + "' no es compatible con nuestro sistema de optimización.",
                HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
