package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.controllers.docs.CategoriaApi;
import ies.juanbosoco.locuventas_backend.entities.Categoria;
import ies.juanbosoco.locuventas_backend.services.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController implements CategoriaApi {

    private final CategoriaService categoriaService;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<ApiResponseDTO<List<Categoria>>> getAllCategorias() {
        List<Categoria> data = categoriaService.findAll();
        return ApiResponseDTO.success("Categorías recuperadas correctamente", data, HttpStatus.OK);
    }
}