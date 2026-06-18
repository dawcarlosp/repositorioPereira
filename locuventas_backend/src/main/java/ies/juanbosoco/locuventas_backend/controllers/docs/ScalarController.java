package ies.juanbosoco.locuventas_backend.controllers.docs;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ScalarController {

    @GetMapping("/scalar-ui")
    public ResponseEntity<String> scalarUI() {
        String html = """
            <!doctype html>
            <html>
            <head>
                <title>LocuVentas API - Scalar</title>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </head>
            <body>
                <script
                    id="api-reference"
                    data-url="/v3/api-docs"
                    data-configuration='{"theme":"purple","layout":"modern"}'
                ></script>
                <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
            </body>
            </html>
            """;
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
