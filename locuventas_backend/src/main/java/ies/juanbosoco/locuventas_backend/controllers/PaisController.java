package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/paises")
public class PaisController {
    @Autowired
    private PaisRepository paisRepository;

    // === Listar todos los países ===
    @GetMapping
    public ResponseEntity<List<Pais>> getAllPaises() {
        List<Pais> paises = paisRepository.findAll();
        return ResponseEntity.ok(paises);
    }

    // === Obtener país por ID ===
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaisById(@PathVariable Long id) {
        Optional<Pais> paisOpt = paisRepository.findById(id);
        if (paisOpt.isPresent()) {
            return ResponseEntity.ok(paisOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "País no encontrado"));
        }
    }

    // === Crear país ===
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearPais(@RequestBody @Valid Pais pais, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        Pais nuevoPais = paisRepository.save(pais);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPais);
    }

    // === Editar país ===
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarPais(@PathVariable Long id, @RequestBody @Valid Pais pais, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        Optional<Pais> paisExistenteOpt = paisRepository.findById(id);
        if (!paisExistenteOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "País no encontrado"));
        }
        Pais paisExistente = paisExistenteOpt.get();
        paisExistente.setNombre(pais.getNombre());
        paisExistente.setCodigo(pais.getCodigo());
        paisExistente.setEnlaceFoto(pais.getEnlaceFoto());
        Pais actualizado = paisRepository.save(paisExistente);
        return ResponseEntity.ok(actualizado);
    }

    // === Eliminar país ===
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarPais(@PathVariable Long id) {
        Optional<Pais> paisOpt = paisRepository.findById(id);
        if (!paisOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "País no encontrado"));
        }
        paisRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "País eliminado exitosamente"));
    }
}
