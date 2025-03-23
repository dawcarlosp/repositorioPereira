package ies.juanbosoco.locuventas_backend.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.constraints.Email;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Builder
@Table(name = "vendedores")
public class Vendedor implements UserDetails{
    @Id
    @UuidGenerator // Genera un UUID automáticamente
    private String id;

    @Email(message = "El email no tiene el formato válido")
    @Column(unique = true)
    private String email;
    private String password;
    private String foto;
    //@Length(min = 3, message = "{cliente.nombre.longitud}")
    private String nombre;
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    //Relaciones
    //@JsonIgnore
    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL)
    private List<Venta> ventas = new ArrayList<>();

    @Builder.Default    //Para que Lombok con el patrón builder cree el ArrayList
    @ElementCollection(fetch = FetchType.EAGER) // Indica que está lista se almacena en una tabla separada, pero sin una relación
    @CollectionTable(name = "user_authorities", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> authorities = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities.stream()
                .map(authority -> new SimpleGrantedAuthority(authority))
                .toList();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
