package ies.juanbosoco.locuventas_backend.controllers.docs;

import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoUpdateDTO;
import ies.juanbosoco.locuventas_backend.DTO.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Productos", description = "Endpoints para la gestión y consulta de productos")
public interface ProductoApi {

    @Operation(
            summary = "Listar productos de forma paginada",
            description = "Devuelve una página de productos con información detallada como precio, IVA, país de origen y categorías. Acceso permitido para ADMIN y VENDEDOR.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista paginada recuperada con éxito"),
                    @ApiResponse(responseCode = "401", description = "No autorizado - Token faltante o inválido"),
                    @ApiResponse(responseCode = "403", description = "Prohibido - No tienes los roles necesarios")
            }
    )
    @GetMapping
    ResponseEntity<ApiResponseDTO<PageDTO<ProductoResponseDTO>>> getAllProductos(
            @Parameter(description = "Número de página (empieza en 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Cantidad de elementos por página", example = "12")
            @RequestParam(defaultValue = "12") int size
    );
    @Operation(
            summary = "Crear un nuevo producto (Solo ADMIN)",
            description = "Crea un producto asociándolo a un país y varias categorías. Requiere una imagen.",
            security = @SecurityRequirement(name = "bearerAuth"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            encoding = @Encoding(name = "producto", contentType = MediaType.APPLICATION_JSON_VALUE)
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Producto creado exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Error en los datos o en la imagen")
            }
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> crearProducto(
            @RequestPart("producto") @Valid ProductoCreateDTO dto,
            @RequestPart("foto") MultipartFile foto
    );

    @Operation(
            summary = "Editar un producto existente",
            description = "Actualiza los datos de un producto y su imagen. Si no se envía foto, se mantiene la actual. Requiere rol ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Producto actualizado correctamente"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Datos de entrada inválidos, error en el formato del JSON o archivo no permitido"
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "No autenticado o token inválido"
                    ),
                    @ApiResponse(
                            responseCode = "403",
                            description = "No tienes permisos suficientes (Se requiere ADMIN)"
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "El producto con el ID proporcionado o el país no existen"
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Error interno al procesar la imagen o guardar en base de datos"
                    )
            }
    )
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> editarProducto(
            @PathVariable Long id,
            @RequestPart("producto") @Valid ProductoUpdateDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto
    );

    @Operation(
            summary = "Eliminar un producto (Solo ADMIN)",
            description = "Elimina un producto y su imagen asociada. No se puede eliminar si el producto ya forma parte de una venta registrada.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Producto eliminado exitosamente"),
                    @ApiResponse(responseCode = "401", description = "No autenticado"),
                    @ApiResponse(responseCode = "403", description = "No tienes permisos de ADMIN"),
                    @ApiResponse(responseCode = "404", description = "El producto no existe"),
                    @ApiResponse(responseCode = "409", description = "Conflicto: El producto tiene ventas asociadas y no puede eliminarse")
            }
    )
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponseDTO<Void>> eliminarProducto(
            @Parameter(description = "ID del producto a eliminar", example = "1") @PathVariable Long id
    );
}