package br.com.bipteste.services;

import br.com.bipteste.entity.Beneficio;
import br.com.bipteste.repository.BeneficioRepository;
import com.example.ejb.ejbmodule.Transferencia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.util.List;

@Service
public class BeneficioService {

    private final BeneficioRepository baneficioRepository;
    @Autowired
    private Transferencia bs;

    public BeneficioService(BeneficioRepository baneficioRepository) {
        this.baneficioRepository = baneficioRepository;
    }
    public Beneficio save(Beneficio beneficio) {
        return this.baneficioRepository.save(beneficio);
    }

    public List<Beneficio> getAll() {
        return this.baneficioRepository.findAll();
    }

    public boolean transferir(Long fromId, Long toId, BigDecimal amount) {
        try{
            this.bs.transfer(fromId, toId, amount);
            return Boolean.TRUE;
        } catch (Exception e){
            return Boolean.FALSE;
        }
    }
}
