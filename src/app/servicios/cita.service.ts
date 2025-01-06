import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private readonly citas = [
    { frase: 'La vida es bella', autor: 'Anónimo' },
    { frase: 'Pienso, luego existo', autor: 'René Descartes' },
  ];

  obtenerTodasCitas() {
    return [...this.citas];
  }

  agregarCita(cita: { frase: string; autor: string }) {
    this.citas.push(cita);
  }

  eliminarCita(indice: number) {
    this.citas.splice(indice, 1);
  }
}

