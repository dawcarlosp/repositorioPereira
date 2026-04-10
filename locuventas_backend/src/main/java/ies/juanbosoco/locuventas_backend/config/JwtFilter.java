package ies.juanbosoco.locuventas_backend.config;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
/**
/**
 * Extrae el token JWT de la cabecera Authoritation de la petición HTTP
 */
@Component

public class JwtFilter extends OncePerRequestFilter{
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Extraer el token de la cabecera 'Authorization'
        String token = this.extractToken(request);

        try {
            // 2. Validar que el token exista y sea íntegro (firma, expiración)
            if (token != null && tokenProvider.isValidToken(token)) {

                // 3. Obtener la identidad del usuario desde el token
                String username = this.tokenProvider.getEmailFromToken(token);

                // 4. Cargar detalles del usuario desde la BD
                // loadUserByUsername lanzará UsernameNotFoundException si no existe
                UserDetails user = this.userDetailsService.loadUserByUsername(username);

                // 5. Crear el objeto de autenticación
                // Es vital pasar 'user' como principal y sus roles (authorities)
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );

                // 6. Enlazar detalles de la petición (IP, sesión, etc.) a la autenticación
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. Establecer al usuario en el contexto de seguridad de esta petición
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
            // 8. Si algo falla (usuario borrado, token corrupto), limpiamos el contexto.
            // Esto garantiza que la petición sea tratada como "Anónima" y
            // Spring Security lance el 401 a través del EntryPoint.
            SecurityContextHolder.clearContext();
            logger.error("No se pudo establecer la autenticación del usuario: " + e.getMessage());
        }

        // 9. Continuar siempre con la cadena de filtros (importante para que llegue al EntryPoint)
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); //Quitamos el Bearer y nos quedamos con el token
        }
        return null;
    }
}
