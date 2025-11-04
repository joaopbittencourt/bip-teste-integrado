package br.com.bipteste.controller;

import br.com.bipteste.dto.TransfererenciaDTO;
import br.com.bipteste.entiity.Beneficio;
import br.com.bipteste.services.BeneficioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficioControllerTest {

    @Mock
    private BeneficioService beneficioService;

    @InjectMocks
    private BeneficioController beneficioController;

    private Beneficio beneficioMock;
    private TransfererenciaDTO transferenciaDTOMock;

    @BeforeEach
    void setUp() {
        beneficioMock = new Beneficio();
        beneficioMock.setId(BigInteger.ONE);
        beneficioMock.setNome("Benefício Teste");
        beneficioMock.setDescricao("Descrição teste");
        beneficioMock.setValor(new BigDecimal("100.00"));
        beneficioMock.setAtivo(true);
        beneficioMock.setVersion(BigInteger.ZERO);

        transferenciaDTOMock = new TransfererenciaDTO();
        transferenciaDTOMock.to = 1L;
        transferenciaDTOMock.from = 2L;
        transferenciaDTOMock.amount = new BigDecimal("50.00");
    }

    @Test
    void list_WhenHasData_ThenReturnList() {
        // Arrange
        List<Beneficio> expectedList = new ArrayList<>();
        expectedList.add(beneficioMock);
        
        Beneficio outro = new Beneficio();
        outro.setId(BigInteger.TWO);
        outro.setNome("Outro Benefício");
        expectedList.add(outro);

        when(beneficioService.getAll()).thenReturn(expectedList);

        // Act
        List<Beneficio> result = beneficioController.list();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(beneficioMock.getNome(), result.get(0).getNome());
        assertEquals(outro.getNome(), result.get(1).getNome());
        verify(beneficioService, times(1)).getAll();
    }

    @Test
    void list_WhenEmpty_ThenReturnEmptyList() {
        // Arrange
        when(beneficioService.getAll()).thenReturn(new ArrayList<>());

        // Act
        List<Beneficio> result = beneficioController.list();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(beneficioService, times(1)).getAll();
    }

    @Test
    void list_WhenServiceThrowsException_ThenPropagateException() {
        // Arrange
        when(beneficioService.getAll()).thenThrow(new RuntimeException("Service Error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            beneficioController.list();
        });
        verify(beneficioService, times(1)).getAll();
    }

    @Test
    void save_WhenValidBeneficio_ThenSaveAndReturn() throws Exception {
        // Arrange
        when(beneficioService.save(any(Beneficio.class))).thenReturn(beneficioMock);

        // Act
        Method saveMethod = BeneficioController.class.getDeclaredMethod("save", Beneficio.class);
        saveMethod.setAccessible(true);
        Beneficio result = (Beneficio) saveMethod.invoke(beneficioController, beneficioMock);

        // Assert
        assertNotNull(result);
        assertEquals(beneficioMock.getId(), result.getId());
        assertEquals(beneficioMock.getNome(), result.getNome());
        assertEquals(beneficioMock.getValor(), result.getValor());
        verify(beneficioService, times(1)).save(beneficioMock);
    }

    @Test
    void save_WhenServiceThrowsException_ThenPropagateException() throws Exception {
        // Arrange
        when(beneficioService.save(any(Beneficio.class)))
            .thenThrow(new RuntimeException("Service Error"));

        Method saveMethod = BeneficioController.class.getDeclaredMethod("save", Beneficio.class);
        saveMethod.setAccessible(true);

        // Act & Assert
        assertThrows(Exception.class, () -> {
            saveMethod.invoke(beneficioController, beneficioMock);
        });
        verify(beneficioService, times(1)).save(beneficioMock);
    }

    @Test
    void transfer_WhenValidDTO_ThenInvokeServiceAndReturnTrue() throws Exception {
        // Arrange
        when(beneficioService.transferir(anyLong(), anyLong(), any(BigDecimal.class)))
            .thenReturn(true);

        Method transferMethod = BeneficioController.class.getDeclaredMethod("transfer", TransfererenciaDTO.class);
        transferMethod.setAccessible(true);

        // Act
        boolean result = (boolean) transferMethod.invoke(beneficioController, transferenciaDTOMock);

        // Assert
        assertTrue(result);
        verify(beneficioService, times(1))
            .transferir(transferenciaDTOMock.to, transferenciaDTOMock.from, transferenciaDTOMock.amount);
    }

    @Test
    void transfer_WhenServiceReturnsFalse_ThenReturnFalse() throws Exception {
        // Arrange
        when(beneficioService.transferir(anyLong(), anyLong(), any(BigDecimal.class)))
            .thenReturn(false);

        Method transferMethod = BeneficioController.class.getDeclaredMethod("transfer", TransfererenciaDTO.class);
        transferMethod.setAccessible(true);

        // Act
        boolean result = (boolean) transferMethod.invoke(beneficioController, transferenciaDTOMock);

        // Assert
        assertFalse(result);
        verify(beneficioService, times(1))
            .transferir(transferenciaDTOMock.to, transferenciaDTOMock.from, transferenciaDTOMock.amount);
    }

    @Test
    void transfer_WhenServiceThrowsException_ThenPropagateException() throws Exception {
        // Arrange
        when(beneficioService.transferir(anyLong(), anyLong(), any(BigDecimal.class)))
            .thenThrow(new RuntimeException("Transfer Error"));

        Method transferMethod = BeneficioController.class.getDeclaredMethod("transfer", TransfererenciaDTO.class);
        transferMethod.setAccessible(true);

        // Act & Assert
        assertThrows(Exception.class, () -> {
            transferMethod.invoke(beneficioController, transferenciaDTOMock);
        });
        verify(beneficioService, times(1))
            .transferir(transferenciaDTOMock.to, transferenciaDTOMock.from, transferenciaDTOMock.amount);
    }
}
