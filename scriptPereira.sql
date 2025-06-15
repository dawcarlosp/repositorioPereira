-- LocuVentas Database Schema and Data Initialization
-- Compatible with JPA entities in dawcarlosp/repositorioPereira

-- Desactiva restricciones para poder borrar sin errores
SET FOREIGN_KEY_CHECKS = 0;

-- Elimina tablas en orden correcto
DROP TABLE IF EXISTS user_authorities;
DROP TABLE IF EXISTS vendedor_paises;
DROP TABLE IF EXISTS producto_categoria;
DROP TABLE IF EXISTS venta_productos;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS vendedores;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS paises;

-- Activa restricciones nuevamente
SET FOREIGN_KEY_CHECKS = 1;

-- Tabla de países
CREATE TABLE paises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    codigo VARCHAR(10),
    enlace_foto VARCHAR(500)
);

-- Tabla de categorías
CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de vendedores (usuarios)
CREATE TABLE vendedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    nombre VARCHAR(255),
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de roles del usuario
CREATE TABLE user_authorities (
    user_id BIGINT NOT NULL,
    authorities VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES vendedores(id) ON DELETE CASCADE
);

-- Relación vendedor-paises (Muchos a Muchos)
CREATE TABLE vendedor_paises (
    vendedor_id BIGINT NOT NULL,
    pais_id BIGINT NOT NULL,
    PRIMARY KEY (vendedor_id, pais_id),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id) ON DELETE CASCADE,
    FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE CASCADE
);

-- Tabla de productos
CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    foto VARCHAR(255),
    iva DOUBLE NOT NULL,
    pais_id BIGINT NOT NULL,
    FOREIGN KEY (pais_id) REFERENCES paises(id)
);

-- Relación producto-categoría
CREATE TABLE producto_categoria (
    producto_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    PRIMARY KEY (producto_id, categoria_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabla de ventas
CREATE TABLE ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(19,2),
    cancelada BOOLEAN DEFAULT FALSE,
    estado_pago ENUM('PENDIENTE', 'PARCIAL', 'PAGADO') NOT NULL DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vendedor_id BIGINT NOT NULL,
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id)
);

-- Tabla productos vendidos
CREATE TABLE venta_productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT,
    subtotal DOUBLE,
    iva DOUBLE,
    subtotal_con_iva DOUBLE,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de pagos
CREATE TABLE pagos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    monto DECIMAL(19,2),
    fecha_pago DATE,
    venta_id BIGINT,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE
);

-- Datos iniciales

INSERT INTO categorias (nombre) VALUES
('Llamadas Internacionales'),
('Recargas Telefónicas'),
('Envío de Dinero'),
('Fotocopias e Impresiones'),
('Internet y Ciber'),
('Venta de Accesorios'),
('Papelería'),
('Pago de Servicios'),
('Trámites y Gestiones'),
('Envío de Paquetería'),
('Alimentos y Bebidas'),
('Venta de Tarjetas SIM'),
('Traducciones'),
('Juegos de Azar/Lotería'),
('Fotografía para Documentos'),
('Otros Servicios');

INSERT INTO paises (nombre, codigo, enlace_foto) VALUES
('Spain', 'ES', 'https://flagcdn.com/w320/es.png'),
('United States', 'US', 'https://flagcdn.com/w320/us.png'),
('France', 'FR', 'https://flagcdn.com/w320/fr.png'),
('Germany', 'DE', 'https://flagcdn.com/w320/de.png'),
('Italy', 'IT', 'https://flagcdn.com/w320/it.png'),
('United Kingdom', 'GB', 'https://flagcdn.com/w320/gb.png'),
('Mexico', 'MX', 'https://flagcdn.com/w320/mx.png'),
('Colombia', 'CO', 'https://flagcdn.com/w320/co.png'),
('Argentina', 'AR', 'https://flagcdn.com/w320/ar.png'),
('Brazil', 'BR', 'https://flagcdn.com/w320/br.png');

-- Admin inicial (password debe estar codificada por la app)
INSERT INTO vendedores (email, password, nombre, foto) VALUES
('admin@locuventas.com', '$2a$10$example.encoded.password.here', 'Administrador', NULL);

INSERT INTO user_authorities (user_id, authorities) VALUES
(1, 'ROLE_ADMIN'),
(1, 'ROLE_USER'),
(1, 'ROLE_VENDEDOR');

-- Productos de ejemplo
INSERT INTO productos (nombre, precio, foto, iva, pais_id) VALUES
('Recarga Telefónica 10€', 10.00, 'productosprecargados/recarga10.jpg', 21.0, 1),
('Llamada Internacional 30min', 15.50, 'productosprecargados/llamada30.jpg', 21.0, 1),
('Envío de Dinero', 5.00, 'productosprecargados/envio.jpg', 21.0, 1),
('Fotocopia A4', 0.10, 'productosprecargados/fotocopia.jpg', 21.0, 1),
('Impresión Color A4', 0.50, 'productosprecargados/impresion.jpg', 21.0, 1);

-- Relación producto-categoría
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES
(1, 2),
(2, 1),
(3, 3),
(4, 4),
(5, 4);
