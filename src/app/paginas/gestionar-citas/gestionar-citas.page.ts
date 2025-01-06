import { Component, OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent, IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { FormularioCitaComponent } from 'src/app/componentes/formulario-citas/formulario-cita.component';
import { ListaCitasComponent } from 'src/app/componentes/lista-citas/lista-citas.component';
import { Cita } from 'src/app/modelo/cita';
import { SqlServiceService } from 'src/app/servicios/sql-service.service';
import { mostrarToast } from 'src/app/Util/toast-service';


@Component({
  selector: 'app-gestionar-citas',
  templateUrl: './gestionar-citas.page.html',
  styleUrls: ['./gestionar-citas.page.scss'],
  standalone: true,
  imports: [FormularioCitaComponent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, ListaCitasComponent],
})
export class GestionarCitasPage implements OnInit {
  public citas: Cita[] = [];

  nuevaCita = { frase: '', autor: '' };

  constructor(
    private readonly sqlService: SqlServiceService
  ) {
    addIcons({
      trashOutline,
      addOutline,
    });
  }

  ngOnInit(): void {
    this.buscarCitas();
  }

  async buscarCitas() {

    try {
      this.citas = await this.sqlService.findAllCitas();
      console.log('Citas cargadas', this.citas);

    } catch (error) {
      console.log('Error al cargar las citas', error);
    }

  }

  async agregarCita(cita: Cita) {
    if (cita != null) {
      await this.sqlService.insertar(cita);
      await mostrarToast('Cita agregada exitosamente.', 'success');
      this.buscarCitas();
    }
  }

  async eliminarCita(cita: Cita) {
    if (cita != null) {
      await this.sqlService.eliminar(cita.id);
      await mostrarToast('Cita eliminada exitosamente.', 'success');
      this.buscarCitas();
    }
  }


}
