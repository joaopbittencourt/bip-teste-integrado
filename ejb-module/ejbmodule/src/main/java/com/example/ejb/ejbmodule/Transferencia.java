package com.example.ejb.ejbmodule;



import jakarta.ejb.Remote;
import java.math.BigDecimal;

@Remote
public interface Transferencia  {
    void transfer(Long fromId, Long toId, BigDecimal amount) throws Exception;
}
