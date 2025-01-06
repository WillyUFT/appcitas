import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita } from '../../modelo/cita';
import { IonList, IonItem, IonLabel, IonButton, IonIcon } from "@ionic/angular/standalone";
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-lista-citas',
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonLabel, IonItem, IonList, CommonModule],
})
export class ListaCitasComponent implements OnInit {

  // & Vemos si podemos eliminar cosas
  public puedeEliminar: boolean = false;

  // & Acá recibimos los citas
  @Input() citas: Cita[] = [];

  // & Acá mandamos a eliminar una de las citas
  @Output() onEliminarCita: EventEmitter<Cita> = new EventEmitter();

  // & Inicio
  async ngOnInit() {
    // Recuperar el valor de `permitirBorradoEnInicio`
    const { value } = await Preferences.get({ key: 'permitirBorradoEnInicio' });
    if (value) {
      this.puedeEliminar = JSON.parse(value); // Convertir el valor a boolean
    }
  }

  // & Función que emite el evento para eliminar la cita a la BDD
  eliminar(cita: Cita) {
    console.log('Eliminando cita', cita);
    this.onEliminarCita.emit(cita);
  }
}

