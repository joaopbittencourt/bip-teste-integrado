package br.com.bipteste.repository;

import br.com.bipteste.entity.Beneficio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BeneficioRepository  extends JpaRepository<Beneficio, UUID> {
}
