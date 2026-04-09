package ies.juanbosoco.locuventas_backend.errors;

import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Mejor que @ControllerAdvice para APIs REST
public class GlobalHandlerException {


    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponseDTO<Void>> handleBusinessExceptions(BusinessException ex) {
        return ApiResponseDTO.error(ex.getMessage(), ex.getStatus());
    }
    // 1. Errores de Validación (El más importante)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDTO<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        // Usamos el builder porque mandamos detalles en 'data'
        return ResponseEntity.badRequest().body(
                ApiResponseDTO.<Map<String, String>>builder()
                        .message("Errores de validación en el formulario")
                        .data(errors)
                        .status(HttpStatus.BAD_REQUEST.value())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // 2. Errores de Negocio (IllegalArgument, VentaNoEncontrada, etc.)
    @ExceptionHandler({IllegalArgumentException.class, VentaNoEncontradaException.class})
    public ResponseEntity<ApiResponseDTO<Void>> handleBusinessExceptions(RuntimeException ex) {
        HttpStatus status = (ex instanceof VentaNoEncontradaException) ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
        return ApiResponseDTO.error(ex.getMessage(), status);
    }

    // 3. Errores de Archivos y Base de Datos
    @ExceptionHandler({
            MissingServletRequestPartException.class,
            MaxUploadSizeExceededException.class,
            DataIntegrityViolationException.class
    })
    public ResponseEntity<ApiResponseDTO<Void>> handleFileAndDatabaseErrors(Exception ex) {
        String message = "Error al procesar la solicitud";
        if (ex instanceof MaxUploadSizeExceededException) message = "La foto es demasiado pesada (máx 10MB)";
        if (ex instanceof DataIntegrityViolationException) message = "Error de duplicidad: el dato ya existe";
        if (ex instanceof MissingServletRequestPartException) message = "La foto es obligatoria";

        return ApiResponseDTO.error(message, HttpStatus.BAD_REQUEST);
    }

    // 4. Seguridad (403 Forbidden)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponseDTO<Void>> handleAccessDenied(AccessDeniedException ex) {
        return ApiResponseDTO.error("No tienes permiso para realizar esta acción", HttpStatus.FORBIDDEN);
    }

    // 5. Error Genérico (El último recurso)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDTO<String>> handleGlobalException(Exception ex, WebRequest request) {
        // En producción, podrías no querer enviar ex.getMessage() por seguridad
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponseDTO.<String>builder()
                        .message("Error interno del servidor")
                        .data(request.getDescription(false))
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}
