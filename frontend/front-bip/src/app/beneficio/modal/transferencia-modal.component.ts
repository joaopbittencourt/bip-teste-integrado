import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beneficio } from '../../models/beneficio.model';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-transferencia-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './transferencia-modal.component.html',
  styleUrls: ['./transferencia-modal.component.css'],
})
export class TransferenciaModalComponent {
  fromId?: number;
  toId?: number;
  amount = 0;
  beneficios: Beneficio[];
    form: any;
    availableToOptions: any;

  constructor(
    public dialogRef: MatDialogRef<TransferenciaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { beneficios: Beneficio[] }
  ) {
    this.beneficios = data.beneficios;
    this.fromId = undefined;
    this.toId = undefined;
    this.amount = 0;
  }

  canConfirm() {
    return this.fromId != null && this.toId != null && this.fromId !== this.toId && this.amount > 0;
  }

  confirm() {
    if (!this.canConfirm()) return;
    this.dialogRef.close({ fromId: this.fromId, toId: this.toId, amount: this.amount });
  }

  cancel() {
    this.dialogRef.close();
  }
}
