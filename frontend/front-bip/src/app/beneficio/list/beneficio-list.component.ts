import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beneficio } from '../../models/beneficio.model';
import { BeneficioService } from '../../services/beneficio.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BeneficioModalComponent } from '../modal/beneficio-modal.component';
import { TransferenciaModalComponent } from '../modal/transferencia-modal.component';

@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.css'],
})
export class BeneficioListComponent implements OnInit {
  beneficios: Beneficio[] = [];
  selected?: Beneficio;
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'valor', 'ativo', 'acoes'];

  constructor(private service: BeneficioService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.list().subscribe({ next: (r) => (this.beneficios = r), error: (e) => console.error(e) });
  }

  openAdd() {
    const dialogRef = this.dialog.open(BeneficioModalComponent, {
      width: '400px',
      data: { beneficio: undefined },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveBeneficio(result);
      }
    });
  }

  edit(b: Beneficio) {
    const dialogRef = this.dialog.open(BeneficioModalComponent, {
      width: '400px',
      data: { beneficio: b },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveBeneficio(result);
      }
    });
  }

  closeModal() {
    this.selected = undefined;
  }

  saveBeneficio(event: { id?: number; payload: Partial<Beneficio> }) {
    const { id, payload } = event;
    if (id) {
      this.service.update(id, payload).subscribe({ 
        next: () => { this.closeModal(); this.load(); },
        error: (err) => { alert('Erro ao atualizar benefício: ' + err.message); }
      });
    } else { 
      this.service.create(payload).subscribe({ 
        next: () => { this.closeModal(); this.load(); },
        error: (err) => { alert('Erro ao salvar benefício: ' + err.message); }
      
      });
    }
  }

  openTransfer() {
    const dialogRef = this.dialog.open(TransferenciaModalComponent, {
      width: '400px',
      data: { beneficios: this.beneficios },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.doTransfer(result);
      }
    });
  }

  doTransfer(event: { fromId: number; toId: number; amount: number }) {
    this.service.transfer(event.fromId, event.toId, event.amount).subscribe({ 
      next: (confirm) => { 
        this.load(); 
        if (confirm){
          this.load();
        }else{
          alert('Erro ao transferir benefício: ' + 'Transferência não confirmada');
        }
      },
      error: (err) => { alert('Erro ao transferir benefício: ' + err.message); }});
  }
}
