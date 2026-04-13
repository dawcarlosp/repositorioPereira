package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.controllers.docs.PaisApi;
import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.services.PaisService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/paises")
@RequiredArgsConstructor
public class PaisController implements PaisApi {
    @Autowired
    private PaisService paisService;
    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<ApiResponseDTO<List<Pais>>> getAllPaises() {
        List<Pais> data = paisService.findAll();
        return ApiResponseDTO.success("Listado de países recuperado", data, HttpStatus.OK);
    }
}
