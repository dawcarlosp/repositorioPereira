package ies.juanbosoco.locuventas_backend.config;
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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = this.extractToken(request);

        if(this.tokenProvider.isValidToken(token)){
            String username = this.tokenProvider.getUsernameFromToken(token);

            //UserDetails representa al usuario
            UserDetails user = this.userDetailsService.loadUserByUsername(username); //Carga el usuario de la base de datos

            //Información sobre el usuario que se acaba de autenticar
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    user.getPassword(),
                    user.getAuthorities());

            //SecurityContext permite ver o establecer un usuario logeado
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        //Reenviamos la petición a los siguientes filtros
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
