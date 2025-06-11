package ies.juanbosoco.locuventas_backend.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
@Service
@RequiredArgsConstructor
public class VentaServiceTicket { private final VentaProductoRepository ventaProductoRepository;

    public byte[] generarTicketPDF(Venta venta) throws Exception {
        Document document = new Document(PageSize.A6); // Tamaño de ticket
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);

        document.open();

        // Título
        Paragraph titulo = new Paragraph("Ticket de venta #" + venta.getId(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);

        document.add(new Paragraph("Fecha: " + venta.getCreatedAt()));
        document.add(new Paragraph("Vendedor: " + venta.getVendedor().getNombre()));
        document.add(new Paragraph(" "));

        // Productos
        List<VentaProducto> lineas = ventaProductoRepository.findByVenta_Id(venta.getId());
        PdfPTable tabla = new PdfPTable(3);
        tabla.setWidths(new int[]{4, 1, 2});
        tabla.addCell("Producto");
        tabla.addCell("Cant");
        tabla.addCell("Subtotal");

        for (VentaProducto l : lineas) {
            tabla.addCell(l.getProducto().getNombre());
            tabla.addCell(String.valueOf(l.getCantidad()));
            tabla.addCell(String.format("%.2f €", l.getSubtotal()));
        }
        document.add(tabla);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Total: " + String.format("%.2f €", venta.getTotal())));
        document.add(new Paragraph("Pagado: " + String.format("%.2f €", venta.getMontoPagado())));
        document.add(new Paragraph("Saldo: " + String.format("%.2f €", venta.getSaldoPendiente())));
        document.add(new Paragraph("Estado: " + venta.getEstadoPago().name()));

        document.close();

        return baos.toByteArray();
    }

}
