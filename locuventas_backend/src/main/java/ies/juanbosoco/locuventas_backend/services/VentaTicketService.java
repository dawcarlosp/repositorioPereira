package ies.juanbosoco.locuventas_backend.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.VentaProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaTicketService {

    private final VentaProductoRepository ventaProductoRepository;

    public byte[] generarTicketPDF(Venta venta) throws Exception {
        Document document = new Document(PageSize.A6);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        // Encabezado
        Paragraph header = new Paragraph("Locu Ventas", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);

        Paragraph direccion = new Paragraph("Vinland 13600", FontFactory.getFont(FontFactory.HELVETICA, 10));
        direccion.setAlignment(Element.ALIGN_CENTER);
        document.add(direccion);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Factura Simplificada"));
        document.add(new Paragraph("Estado: " + venta.getEstadoPago().name()));
        document.add(new Paragraph("Nº productos: " + ventaProductoRepository.countByVenta_Id(venta.getId())));
        document.add(new Paragraph("Fecha: " + venta.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));
        document.add(new Paragraph("Atendido por: " + venta.getVendedor().getNombre()));
        document.add(new Paragraph("----------------------------------------"));

        // Detalle productos
        List<VentaProducto> lineas = ventaProductoRepository.findByVenta_Id(venta.getId());
        Map<Double, Double> ivaAcumulado = new HashMap<>();

        for (VentaProducto l : lineas) {
            double subtotal = l.getSubtotal();
            double subtotalConIva = l.getSubtotalConIva();
            double ivaTotal = subtotalConIva - subtotal;
            ivaAcumulado.merge(l.getIva(), ivaTotal, Double::sum);

            document.add(new Paragraph(l.getProducto().getNombre(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
            document.add(new Paragraph("  x" + l.getCantidad()));
            document.add(new Paragraph(String.format("  Subtotal sin IVA: %.2f €", subtotal)));
            document.add(new Paragraph(String.format("  IVA (%.0f%%): %.2f €", l.getIva(), ivaTotal)));
            document.add(new Paragraph(String.format("  Total línea: %.2f €", subtotalConIva)));
            document.add(new Paragraph(" "));
        }

        document.add(new Paragraph("----------------------------------------"));
        document.add(new Paragraph("Resumen IVA:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
        for (Map.Entry<Double, Double> entry : ivaAcumulado.entrySet()) {
            double porcentaje = entry.getKey();
            double totalIva = BigDecimal.valueOf(entry.getValue()).setScale(2, RoundingMode.HALF_UP).doubleValue();
            document.add(new Paragraph(String.format("IVA (%.0f%%): %.2f €", porcentaje, totalIva)));
        }

        // Totales
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Total: " + String.format("%.2f €", venta.getTotal())));
        document.add(new Paragraph("Pagado: " + String.format("%.2f €", venta.getMontoPagado())));
        document.add(new Paragraph("Saldo: " + String.format("%.2f €", venta.getSaldoPendiente())));
        document.add(new Paragraph("----------------------------------------"));

        document.add(new Paragraph("Gracias por su compra", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10)));
        document.add(new Paragraph(" "));
        document.close();
        return baos.toByteArray();
    }

    public String generarNombreArchivo(Venta venta) {
        String fecha = venta.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MM-yyyy_HH-mm"));
        return "ticket_locuventas_" + fecha + ".pdf";
    }
}
