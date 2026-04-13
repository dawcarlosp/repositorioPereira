package ies.juanbosoco.locuventas_backend.errors.exceptions;

public class VentaNoEncontradaException extends RuntimeException{
    public VentaNoEncontradaException(Long id) {
        super("La venta con ID " + id + " no fue encontrada.");
    }
}
