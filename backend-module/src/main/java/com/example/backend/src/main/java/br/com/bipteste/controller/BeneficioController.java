package br.com.bipteste.controller;

import br.com.bipteste.dto.TransfererenciaDTO;
import br.com.bipteste.entity.Beneficio;
import br.com.bipteste.services.BeneficioService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/v1/beneficios")
public class BeneficioController {
    private final BeneficioService beneficioService;

    public BeneficioController(BeneficioService beneficioService) {
        this.beneficioService = beneficioService;
    }

    @GetMapping
    public List<Beneficio> list() {
        return this.beneficioService.getAll();
    }

    @PostMapping("/save")
    private Beneficio save(@RequestBody Beneficio beneficio){
        return this.beneficioService.save(beneficio);
    }

    @PostMapping("/transferencia")
    private boolean transfer(@RequestBody TransfererenciaDTO transfererenciaDTO){
        return this.beneficioService.transferir(transfererenciaDTO.to,  transfererenciaDTO.from, transfererenciaDTO.amount);
    }

}
