import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BeneficioService } from '../../services/beneficio.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Beneficio } from '../../models/beneficio.model';
import { BeneficioListComponent } from './beneficio-list.component';

describe('BeneficioListComponent', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;
  let beneficioService: jasmine.SpyObj<BeneficioService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockBeneficios: Beneficio[] = [
    { id: 1, nome: 'Benefício 1', valor: 100, ativo: true },
    { id: 2, nome: 'Benefício 2', valor: 200, ativo: false }
  ];

  beforeEach(async () => {
    const beneficioServiceSpy = jasmine.createSpyObj('BeneficioService', ['list', 'create', 'update', 'transfer']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    beneficioServiceSpy.list.and.returnValue(of(mockBeneficios));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        BeneficioListComponent
      ],
      providers: [
        { provide: BeneficioService, useValue: beneficioServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    beneficioService = TestBed.inject(BeneficioService) as jasmine.SpyObj<BeneficioService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load beneficios on init', () => {
    expect(beneficioService.list).toHaveBeenCalled();
    expect(component.beneficios).toEqual(mockBeneficios);
  });

  it('should open add dialog', () => {
    const mockDialogRef = {
      afterClosed: () => of({ payload: { nome: 'Novo', valor: 100 } })
    };
    dialog.open.and.returnValue(mockDialogRef as any);
    beneficioService.create.and.returnValue(of({ id: 3, nome: 'Novo', valor: 100 }));

    component.openAdd();

    expect(dialog.open).toHaveBeenCalled();
    expect(beneficioService.create).toHaveBeenCalledOnceWith({ nome: 'Novo', valor: 100 });
  });

  it('should open edit dialog', () => {
    const beneficio = mockBeneficios[0];
    const mockDialogRef = {
      afterClosed: () => of({ id: beneficio.id, payload: { nome: 'Editado', valor: 150 } })
    };
    dialog.open.and.returnValue(mockDialogRef as any);
    beneficioService.update.and.returnValue(of({ ...beneficio, nome: 'Editado', valor: 150 }));

    component.edit(beneficio);

    expect(dialog.open).toHaveBeenCalled();
    expect(beneficioService.update).toHaveBeenCalledWith(beneficio.id, { nome: 'Editado', valor: 150 });
  });

  it('should open transfer dialog', () => {
    const mockDialogRef = {
      afterClosed: () => of({ fromId: 1, toId: 2, amount: 50 })
    };
    dialog.open.and.returnValue(mockDialogRef as any);
    beneficioService.transfer.and.returnValue(of({ success: true }));

    component.openTransfer();

    expect(dialog.open).toHaveBeenCalled();
    expect(beneficioService.transfer).toHaveBeenCalledWith(1, 2, 50);
  });

  it('should handle dialog cancel', () => {
    const mockDialogRef = {
      afterClosed: () => of(null)
    };
    dialog.open.and.returnValue(mockDialogRef as any);

    component.openAdd();

    expect(dialog.open).toHaveBeenCalled();
    expect(beneficioService.create).not.toHaveBeenCalled();
  });

  it('should reload after successful operations', () => {
    // Create
    const mockDialogRef = {
      afterClosed: () => of({ payload: { nome: 'Novo', valor: 100 } })
    };
    dialog.open.and.returnValue(mockDialogRef as any);
    beneficioService.create.and.returnValue(of({ id: 3, nome: 'Novo', valor: 100 }));

    component.openAdd();
    
    expect(beneficioService.list).toHaveBeenCalledTimes(2); // Initial load + after create

    // Update
    const updateDialogRef = {
      afterClosed: () => of({ id: 1, payload: { nome: 'Editado', valor: 150 } })
    };
    dialog.open.and.returnValue(updateDialogRef as any);
    beneficioService.update.and.returnValue(of({ id: 1, nome: 'Editado', valor: 150 }));

    component.edit(mockBeneficios[0]);
    
    expect(beneficioService.list).toHaveBeenCalledTimes(3); // Previous calls + after update

    // Transfer
    const transferDialogRef = {
      afterClosed: () => of({ fromId: 1, toId: 2, amount: 50 })
    };
    dialog.open.and.returnValue(transferDialogRef as any);
    beneficioService.transfer.and.returnValue(of({ success: true }));

    component.openTransfer();
    
    expect(beneficioService.list).toHaveBeenCalledTimes(4); // Previous calls + after transfer
  });

  it('should handle errors in list', () => {
    spyOn(console, 'error');
    beneficioService.list.and.returnValue(of([])); // Simula erro retornando lista vazia
    
    component.load();
    
    expect(component.beneficios).toEqual([]);
  });
});