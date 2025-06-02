package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.DTO.PreferenciasPaisRequest;
import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vendedores")
public class PreferenciasController {

    private final UserEntityRepository vendedorRepository;
    private final PaisRepository paisRepository;

    public PreferenciasController(UserEntityRepository vendedorRepository, PaisRepository paisRepository) {
        this.vendedorRepository = vendedorRepository;
        this.paisRepository = paisRepository;
    }

    // ✅ Obtener países preferidos de un vendedor
    @GetMapping("/{id}/preferencias-paises")
    @PreAuthorize("hasRole('VENDEDOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Pais>> obtenerPaisesPreferidos(@PathVariable String id) {
        Vendedor vendedor = vendedorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendedor no encontrado"));

        return ResponseEntity.ok(vendedor.getPaisesPreferidos());
    }

    // ✅ Actualizar países preferidos de un vendedor
    @PatchMapping("/{id}/preferencias-paises")
    @PreAuthorize("hasRole('VENDEDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> actualizarPaisesPreferidos(
            @PathVariable String id,
            @RequestBody @Valid PreferenciasPaisRequest request) {

        Vendedor vendedor = vendedorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendedor no encontrado"));

        List<Pais> paises = paisRepository.findAllById(request.getPaisIds());

        if (paises.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ningún país válido encontrado."));
        }

        vendedor.setPaisesPreferidos(paises);
        vendedorRepository.save(vendedor);

        return ResponseEntity.ok(Map.of("mensaje", "Preferencias actualizadas"));
    }
}
