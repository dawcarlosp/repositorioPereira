package ies.juanbosoco.locuventas_backend.config;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {
    private static final String SECRET_KEY = "zskfldj394852l3kj4tho9a8yt9qa4)()(%&asfdasdrtg45545·%·%";
    private static final long EXPIRATION_TIME = 86400000; // 1 día


    /**
     * Genera un token JWT compacto y firmado para un usuario autenticado.
     * Incluye información básica (claims) para evitar consultas extra a la BD en el frontend.
     */
    public String generateToken(Authentication authentication) {
        // 1. Obtenemos el usuario del principal de la autenticación
        Vendedor user = (Vendedor) authentication.getPrincipal();

        // 2. Preparamos la llave de firma (HS256 por defecto con llaves de este tipo)
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        // 3. Extraemos los nombres de los roles para incluirlos en el token
        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        // 4. Construcción del JWT
        return Jwts.builder()
                .header().type("JWT").and() // Definimos el tipo de cabecera
                .subject(user.getEmail())   // EL EMAIL ES EL SUJETO (Estándar recomendado)
                .claim("id", user.getId())  // ID como claim adicional
                .claim("nombre", user.getNombre())
                .claim("foto", user.getFoto() != null ? user.getFoto() : "default.jpg")
                .claim("roles", roles)      // Incluir roles facilita la lógica en el Frontend
                .issuedAt(new Date())       // Fecha de creación
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Fecha de caducidad
                .signWith(key)              // Firma digital para integridad
                .compact();                 // Serialización a String
    }

    //Validar firma del token
    public boolean isValidToken(String token) {
        if(StringUtils.isBlank(token)){
            return false;
        }

        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        try {
            JwtParser validator = Jwts.parser()
                    .verifyWith(key)
                    .build();
            validator.parse(token);
            return true;
        }catch (Exception e){
            //Aquí entraría si el token no fuera correcto o estuviera caducado.
            // Podríamos hacer un log de los fallos
            System.err.println("Error al validar el token: " + e.getMessage());
            return false;
        }

    }


    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseSignedClaims(token) // parseClaimsJws está obsoleto en versiones nuevas de JJWT
                .getPayload();

        return claims.getSubject(); // Esto devuelve lo que pusimos en .subject()
    }
}
