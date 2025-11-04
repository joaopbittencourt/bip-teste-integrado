import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Beneficio } from '../../models/beneficio.model';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-beneficio-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './beneficio-modal.component.html',
  styleUrls: ['./beneficio-modal.component.css'],
})
export class BeneficioModalComponent {
  save() {
      throw new Error('Method not implemented.');
  }
  form: any;
  isEdit = false;
  private _id?: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BeneficioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { beneficio?: Beneficio }
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: [''],
      valor: [0, [Validators.required]],
      ativo: [true],
    });

    if (data.beneficio) {
      this.isEdit = !!data.beneficio.id;
      this.form.patchValue(data.beneficio);
      this._id = data.beneficio.id;
    }
  }

  saveClick() {
    if (this.form.invalid) return;
    const payload = this.form.value as Partial<Beneficio>;
    this.dialogRef.close({ id: this._id, payload });
  }

  cancel() {
    this.dialogRef.close();
  }
}
