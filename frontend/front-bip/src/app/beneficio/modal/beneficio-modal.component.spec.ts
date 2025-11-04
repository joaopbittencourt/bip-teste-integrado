import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioModalComponent } from '../beneficio-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('BeneficioModalComponent', () => {
  let component: BeneficioModalComponent;
  let fixture: ComponentFixture<BeneficioModalComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<BeneficioModalComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        BeneficioModalComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { beneficio: undefined } }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<BeneficioModalComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for new beneficio', () => {
    expect(component.form.get('nome')?.value).toBe('');
    expect(component.form.get('descricao')?.value).toBe('');
    expect(component.form.get('valor')?.value).toBe(null);
    expect(component.form.get('ativo')?.value).toBe(true);
  });

  it('should initialize form with beneficio values for edit', () => {
    const mockBeneficio = {
      id: 1,
      nome: 'Teste',
      descricao: 'Descrição teste',
      valor: 100,
      ativo: true
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        BeneficioModalComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { beneficio: mockBeneficio } }
      ]
    });

    fixture = TestBed.createComponent(BeneficioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.get('nome')?.value).toBe(mockBeneficio.nome);
    expect(component.form.get('descricao')?.value).toBe(mockBeneficio.descricao);
    expect(component.form.get('valor')?.value).toBe(mockBeneficio.valor);
    expect(component.form.get('ativo')?.value).toBe(mockBeneficio.ativo);
  });

  it('should validate required fields', () => {
    component.form.patchValue({
      nome: '',
      valor: null
    });

    expect(component.form.valid).toBeFalse();
    expect(component.form.get('nome')?.errors?.['required']).toBeTruthy();
    expect(component.form.get('valor')?.errors?.['required']).toBeTruthy();
  });

  it('should validate valor minimum value', () => {
    component.form.patchValue({
      nome: 'Teste',
      valor: -1
    });

    expect(component.form.valid).toBeFalse();
    expect(component.form.get('valor')?.errors?.['min']).toBeTruthy();
  });

  it('should close dialog with null when cancelled', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should close dialog with form value when saved', () => {
    const formValue = {
      nome: 'Novo Benefício',
      descricao: 'Teste',
      valor: 100,
      ativo: true
    };

    component.form.patchValue(formValue);
    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      id: undefined,
      payload: formValue
    });
  });

  it('should include id in result when editing', () => {
    const mockBeneficio = {
      id: 1,
      nome: 'Existente',
      valor: 200,
      ativo: true
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        BeneficioModalComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { beneficio: mockBeneficio } }
      ]
    });

    fixture = TestBed.createComponent(BeneficioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const formValue = {
      nome: 'Atualizado',
      valor: 250,
      ativo: true
    };

    component.form.patchValue(formValue);
    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      id: mockBeneficio.id,
      payload: formValue
    });
  });
});