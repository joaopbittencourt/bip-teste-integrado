import { Routes } from '@angular/router';
import { BeneficioListComponent } from './beneficio/list/beneficio-list.component';

export const routes: Routes = [
	{ path: 'beneficios', component: BeneficioListComponent },
	{ path: '', redirectTo: 'beneficios', pathMatch: 'full' },
];
