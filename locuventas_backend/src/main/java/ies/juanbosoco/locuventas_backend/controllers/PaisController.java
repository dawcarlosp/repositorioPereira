package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(
            summary = "Obtener listado de países",
            description = "Devuelve todos los países disponibles en el sistema. Solo accesible para usuarios con rol ADMIN o VENDEDOR."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de países obtenida correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado (rol no permitido)"),
            @ApiResponse(responseCode = "401", description = "No autenticado o token inválido")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @GetMapping
    public ResponseEntity<List<Pais>> getAllPaises() {
        List<Pais> paises = paisRepository.findAll();
        return ResponseEntity.ok(paises);
    }
}
