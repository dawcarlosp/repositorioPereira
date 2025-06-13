package ies.juanbosoco.locuventas_backend.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "vendedores")
public class Vendedor implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotBlank(message = "El email es obligatorio")
    @jakarta.validation.constraints.Email(message = "El email no tiene el formato válido")
    private String email;
    private String password;
    private String foto;
    private String nombre;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relación con ventas
    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL)
    private List<Venta> ventas = new ArrayList<>();

    // Autoridades
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_authorities", joinColumns = @JoinColumn(name = "user_id"))
    @Builder.Default
    private List<String> authorities = new ArrayList<>();

    //  Relación con países preferidos
    @ManyToMany
    @JoinTable(
            name = "vendedor_paises",
            joinColumns = @JoinColumn(name = "vendedor_id"),
            inverseJoinColumns = @JoinColumn(name = "pais_id")
    )
    private List<Pais> paisesPreferidos = new ArrayList<>();

    // 🔐 Métodos de UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
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
    }// Acceso directo a la lista original (sin mapear a GrantedAuthority)
    @JsonIgnore
    public List<String> getAuthoritiesRaw() {
        return this.authorities;
    }

}