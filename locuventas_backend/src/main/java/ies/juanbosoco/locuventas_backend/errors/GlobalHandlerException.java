package ies.juanbosoco.locuventas_backend.errors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
@ControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

//        errors representa un JSON "clave" "valor". Vamos añadiendo posiciones que luego se transformará en JSON. Un ejemplo sería el siguiente:
//        errors.put("error", "El objeto no tiene los campos requeridos");
//        errors.put("date", LocalDate.now().toString());

        //Añadimos al mapa errors todos los errores que podemos coger de la excepción
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        //return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Manejo de excepciones generales (genéricas)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex, WebRequest request) {
        Map<String, Object> response = new HashMap<>();
//        response.put("error", "Error interno del servidor, contacto con el servicio técnico");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "Error interno del servidor");
        response.put("details", ex.getMessage());
        response.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    //Para manejar excepciones que tengan que ver con archivos
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, String>> handleMissingPart(MissingServletRequestPartException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Por políticas de la empresa, la foto es obligatoria"));
    }
    //Para manejar excepciones que se produzcan en sql, en nuestro caso es para manejar el error del unique del nombre de categoria
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "El nombre de la categoría ya existe. Debe ser único.");
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(VentaNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handleVentaNoEncontrada(VentaNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * Captura cualquier AccessDeniedException (403 Forbidden) y devuelve un JSON con mensaje personalizado.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        // Aquí devolvemos 403 y un body con nuestra propia clave "error"
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "No tienes permiso para realizar esta acción"));
    }
    //Para poder mandar el mensaje adecuado al front
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        // Aquí puedes personalizar el mensaje y la clave ("foto" para mapear igual que tus otros errores)
        return ResponseEntity.badRequest().body(
                Map.of("foto", "La foto es demasiado pesada. El tamaño máximo permitido es 10MB.")
        );
    }
}
