package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaisService {

    private final PaisRepository paisRepository;

    @Transactional(readOnly = true)
    public List<Pais> findAll() {
        // Devolvemos la lista ordenada alfabéticamente por defecto
        return paisRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }
}