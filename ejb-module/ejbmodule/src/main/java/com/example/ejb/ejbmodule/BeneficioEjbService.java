package com.example.ejb.ejbmodule;
import com.example.ejb.ejbmodule.entity.Beneficio;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.concurrent.locks.ReentrantLock;
import javax.persistence.PersistenceUnit;

@Stateless
public class BeneficioEjbService implements Transferencia{
    
    @PersistenceContext 
    @PersistenceUnit(unitName = "crudHibernatePU")
    private EntityManager em;
    private final ReentrantLock lock = new ReentrantLock();

    /**
     *
     * @param fromId
     * @param toId
     * @param amount
     * @throws Exception
     */
    @Override
    @Transactional 
    public void transfer(Long fromId, Long toId, BigDecimal amount) throws Exception{
        Beneficio from = em.find(Beneficio.class, BigInteger.valueOf(fromId));
        Beneficio to   = em.find(Beneficio.class, BigInteger.valueOf(toId));
        lock.lock();
        if(from.getValor().compareTo(amount) <= 0){
            throw new Exception("Valor transferido maior que o disponivel");
        }

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));
        try {
            em.merge(from);
            em.merge(to);
        } catch (Exception e){
            throw new Exception("Erro interno.", e);
        }finally {
            lock.unlock();
        }

    }
}
