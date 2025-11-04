import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferenciaModalComponent } from '../transferencia-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Beneficio } from '../../models/beneficio.model';

describe('TransferenciaModalComponent', () => {
  let component: TransferenciaModalComponent;
  let fixture: ComponentFixture<TransferenciaModalComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TransferenciaModalComponent>>;

  const mockBeneficios: Beneficio[] = [
    { id: 1, nome: 'Benefício 1', valor: 100, ativo: true },
    { id: 2, nome: 'Benefício 2', valor: 200, ativo: true }
  ];

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        TransferenciaModalComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { beneficios: mockBeneficios } }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<TransferenciaModalComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('fromId')?.value).toBeNull();
    expect(component.form.get('toId')?.value).toBeNull();
    expect(component.form.get('amount')?.value).toBeNull();
  });

  it('should validate required fields', () => {
    component.form.patchValue({
      fromId: null,
      toId: null,
      amount: null
    });

    expect(component.form.valid).toBeFalse();
    expect(component.form.get('fromId')?.errors?.['required']).toBeTruthy();
    expect(component.form.get('toId')?.errors?.['required']).toBeTruthy();
    expect(component.form.get('amount')?.errors?.['required']).toBeTruthy();
  });

  it('should validate minimum amount', () => {
    component.form.patchValue({
      fromId: 1,
      toId: 2,
      amount: 0
    });

    expect(component.form.valid).toBeFalse();
    expect(component.form.get('amount')?.errors?.['min']).toBeTruthy();
  });

  it('should validate different beneficios', () => {
    component.form.patchValue({
      fromId: 1,
      toId: 1,
      amount: 50
    });

    expect(component.form.valid).toBeFalse();
    expect(component.form.errors?.['sameBeneficio']).toBeTruthy();
  });

  it('should close dialog with null when cancelled', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should close dialog with form value when confirmed', () => {
    const formValue = {
      fromId: 1,
      toId: 2,
      amount: 50
    };

    component.form.patchValue(formValue);
    component.confirm();

    expect(dialogRef.close).toHaveBeenCalledWith(formValue);
  });

  it('should filter toId options excluding selected fromId', () => {
    component.form.patchValue({
      fromId: 1
    });

    const toOptions = component.availableToOptions;
    expect(toOptions.length).toBe(1);
    expect(toOptions[0].id).toBe(2);
  });

  it('should reset toId when fromId changes to same value', () => {
    component.form.patchValue({
      fromId: 1,
      toId: 2
    });

    component.form.patchValue({
      fromId: 2
    });

    expect(component.form.get('toId')?.value).toBeNull();
  });
});