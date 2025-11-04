package br.com.bipteste.services;

import br.com.bipteste.entiity.Beneficio;
import br.com.bipteste.repository.BeneficioRepository;
import com.example.ejb.ejbmodule.Transferencia;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficioServiceTest {

    @Mock
    private BeneficioRepository beneficioRepository;

    @Mock
    private Transferencia transferenciaEjb;

    @InjectMocks
    private BeneficioService beneficioService;

    private Beneficio beneficioMock;

    @BeforeEach
    void setUp() {
        beneficioMock = new Beneficio();
        beneficioMock.setId(BigInteger.ONE);
        beneficioMock.setNome("Benefício Teste");
        beneficioMock.setDescricao("Descrição teste");
        beneficioMock.setValor(new BigDecimal("100.00"));
        beneficioMock.setAtivo(true);
        beneficioMock.setVersion(BigInteger.ZERO);
    }

    @Test
    void save_WhenValidBeneficio_ThenSaveAndReturn() {
        // Arrange
        when(beneficioRepository.save(any(Beneficio.class))).thenReturn(beneficioMock);

        // Act
        Beneficio saved = beneficioService.save(beneficioMock);

        // Assert
        assertNotNull(saved);
        assertEquals(beneficioMock.getId(), saved.getId());
        assertEquals(beneficioMock.getNome(), saved.getNome());
        assertEquals(beneficioMock.getValor(), saved.getValor());
        assertTrue(saved.isAtivo());
        verify(beneficioRepository, times(1)).save(beneficioMock);
    }

    @Test
    void save_WhenRepositoryThrowsException_ThenPropagateException() {
        // Arrange
        when(beneficioRepository.save(any(Beneficio.class)))
            .thenThrow(new RuntimeException("DB Error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            beneficioService.save(beneficioMock);
        });
        verify(beneficioRepository, times(1)).save(beneficioMock);
    }

    @Test
    void getAll_WhenBeneficiosExist_ThenReturnList() {
        // Arrange
        List<Beneficio> expectedList = new ArrayList<>();
        expectedList.add(beneficioMock);
        
        Beneficio outro = new Beneficio();
        outro.setId(BigInteger.TWO);
        outro.setNome("Outro Benefício");
        outro.setValor(new BigDecimal("200.00"));
        expectedList.add(outro);

        when(beneficioRepository.findAll()).thenReturn(expectedList);

        // Act
        List<Beneficio> result = beneficioService.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(beneficioMock.getNome(), result.get(0).getNome());
        assertEquals(outro.getNome(), result.get(1).getNome());
        verify(beneficioRepository, times(1)).findAll();
    }

    @Test
    void getAll_WhenNoResults_ThenReturnEmptyList() {
        // Arrange
        when(beneficioRepository.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<Beneficio> result = beneficioService.getAll();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(beneficioRepository, times(1)).findAll();
    }

    @Test
    void transferir_WhenSuccessful_ThenReturnTrue() throws Exception {
        // Arrange
        Long fromId = 1L;
        Long toId = 2L;
        BigDecimal amount = new BigDecimal("50.00");

        doNothing().when(transferenciaEjb).transfer(fromId, toId, amount);

        // Act
        boolean result = beneficioService.transferir(fromId, toId, amount);

        // Assert
        assertTrue(result);
        verify(transferenciaEjb, times(1)).transfer(fromId, toId, amount);
    }

    @Test
    void transferir_WhenEJBThrowsException_ThenReturnFalse() throws Exception {
        // Arrange
        Long fromId = 1L;
        Long toId = 2L;
        BigDecimal amount = new BigDecimal("50.00");

        doThrow(new Exception("EJB Error"))
            .when(transferenciaEjb)
            .transfer(fromId, toId, amount);

        // Act
        boolean result = beneficioService.transferir(fromId, toId, amount);

        // Assert
        assertFalse(result);
        verify(transferenciaEjb, times(1)).transfer(fromId, toId, amount);
    }

    @Test
    void transferir_WhenNegativeAmount_ThenReturnFalse() {
        // Arrange
        Long fromId = 1L;
        Long toId = 2L;
        BigDecimal amount = new BigDecimal("-50.00");

        // Act
        boolean result = beneficioService.transferir(fromId, toId, amount);

        // Assert
        assertFalse(result);
        verify(transferenciaEjb, never()).transfer(any(), any(), any());
    }
}
