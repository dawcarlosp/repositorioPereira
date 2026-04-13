package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.entities.Categoria;
import ies.juanbosoco.locuventas_backend.repositories.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<Categoria> findAll() {
        // Ordenamos por nombre para que el combo en el front sea legible
        return categoriaRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }
}