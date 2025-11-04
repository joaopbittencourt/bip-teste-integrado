import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BeneficioService } from './beneficio.service';
import { Beneficio } from '../models/beneficio.model';
import { environment } from '../../environments/environment';

describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/beneficios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BeneficioService]
    });
    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list beneficios', () => {
    const mockBeneficios: Beneficio[] = [
      { id: 1, nome: 'Benefício 1', valor: 100, ativo: true },
      { id: 2, nome: 'Benefício 2', valor: 200, ativo: false }
    ];

    service.list().subscribe(beneficios => {
      expect(beneficios).toEqual(mockBeneficios);
      expect(beneficios.length).toBe(2);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockBeneficios);
  });

  it('should create beneficio', () => {
    const mockBeneficio: Partial<Beneficio> = {
      nome: 'Novo Benefício',
      valor: 150,
      ativo: true
    };

    const mockResponse: Beneficio = {
      id: 1,
      nome: 'Novo Benefício',
      valor: 150,
      ativo: true
    };

    service.create(mockBeneficio).subscribe(beneficio => {
      expect(beneficio).toEqual(mockResponse);
      expect(beneficio.id).toBe(1);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBeneficio);
    req.flush(mockResponse);
  });

  it('should update beneficio', () => {
    const id = 1;
    const mockUpdate: Partial<Beneficio> = {
      nome: 'Benefício Atualizado',
      valor: 300
    };

    const mockResponse: Beneficio = {
      id: 1,
      nome: 'Benefício Atualizado',
      valor: 300,
      ativo: true
    };

    service.update(id, mockUpdate).subscribe(beneficio => {
      expect(beneficio).toEqual(mockResponse);
      expect(beneficio.nome).toBe('Benefício Atualizado');
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUpdate);
    req.flush(mockResponse);
  });

  it('should transfer between beneficios', () => {
    const fromId = 1;
    const toId = 2;
    const amount = 50;

    service.transfer(fromId, toId, amount).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/transfer`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ fromId, toId, amount });
    req.flush({ success: true });
  });

  // Testes de erro
  it('should handle error on list', () => {
    service.list().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error on create', () => {
    const mockBeneficio: Partial<Beneficio> = {
      nome: 'Erro',
      valor: -1
    };

    service.create(mockBeneficio).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
  });
});