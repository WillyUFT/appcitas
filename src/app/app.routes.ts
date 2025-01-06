import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./paginas/home/home.page').then(m => m.HomePage) },
  { path: 'configuracion', loadComponent: () => import('./paginas/configuracion/configuracion.page').then(m => m.ConfiguracionPage) },
  { path: 'gestionar-citas', loadComponent: () => import('./paginas/gestionar-citas/gestionar-citas.page').then(m => m.GestionarCitasPage) },

];

