package ies.juanbosoco.locuventas_backend;

import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.entities.Venta;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import ies.juanbosoco.locuventas_backend.repositories.VentaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class AppTests {
	@Autowired
	private UserEntityRepository vendedorRepository;

	@Autowired
	private VentaRepository ventaRepository;
	/*
	@Test
	public void testCrearVendedorYVenta() {
		// Crear un vendedor
		Vendedor vendedor = new Vendedor();
		vendedor.setEmail("vendedor@example.com");
		vendedor.setPassword("password123");
		vendedor.setNombre("Juan Pérez");
		vendedor.setFoto("foto.jpg");

		// Guardar el vendedor en la base de datos
		//vendedorRepository.save(vendedor);

		// Crear una venta asociada al vendedor
		Venta venta = new Venta();
		venta.setTotal(100.0);
		venta.setVendedor(vendedor);

		// Guardar la venta en la base de datos
		ventaRepository.save(venta);

		// Verificar que el vendedor y la venta se hayan guardado correctamente
		List<Vendedor> vendedores = vendedorRepository.findAll();
		List<Venta> ventas = ventaRepository.findAll();

		System.out.println("Vendedores: " + vendedores);
		System.out.println("Ventas: " + ventas);}
	@Test
	void contextLoads() {
	} */

}
