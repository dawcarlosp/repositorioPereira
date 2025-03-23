package ies.juanbosoco.locuventas_backend.config;
import ch.qos.logback.core.util.StringUtil;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
@Component
public class JwtTokenProvider {
    private static final String SECRET_KEY = "zskfldj394852l3kj4tho9a8yt9qa4)()(%&asfdasdrtg45545·%·%";
    private static final long EXPIRATION_TIME = 86400000; // 1 día


    public String  generateToken(Authentication authentication) {
        Vendedor user = (Vendedor) authentication.getPrincipal();
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        return Jwts.builder()
                .subject(user.getId())
                .claim("email", user.getEmail())
                .claim("username", user.getUsername())
                .claim("foto","default.jpg")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key) // Firma con el algoritmo por defecto
                .compact();
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

    public String getUsernameFromToken(String token) {
        JwtParser parser = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build();
        Claims claims = parser.parseClaimsJws(token).getBody();
        return claims.get("username").toString();
    }
    public Long getIdFromToken(String token) {
        try {
            // Verificación de la firma con la clave secreta.
            JwtParser parser = Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes())  // Usar la clave directamente
                    .build();

            // Extraer los claims del token
            Claims claims = parser.parseClaimsJws(token).getBody();

            // Obtener el campo 'sub' (ID del usuario)
            Object sub = claims.get("sub");

            // Convertir el campo 'sub' a Long de manera segura
            if (sub instanceof String) {
                return Long.parseLong((String) sub);
            } else if (sub instanceof Number) {
                return ((Number) sub).longValue();
            } else {
                throw new IllegalArgumentException("El campo 'sub' no es válido");
            }
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("El token ha expirado: " + e.getMessage(), e);
        } catch (SignatureException e) {
            throw new RuntimeException("Firma del token no válida: " + e.getMessage(), e);
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Token inválido: " + e.getMessage(), e);
        }
    }
}
