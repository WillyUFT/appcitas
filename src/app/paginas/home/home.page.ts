import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon, IonToolbar, IonFabButton, IonFab, IonHeader, IonTitle, IonButtons, IonContent } from '@ionic/angular/standalone';
import { CitaService } from '../../servicios/cita.service';
import { addIcons } from 'ionicons';
import { Platform } from '@ionic/angular';
import { settingsOutline, addOutline } from 'ionicons/icons';
import { SqlServiceService } from 'src/app/servicios/sql-service.service';
import { Device } from '@capacitor/device';
import { Cita } from 'src/app/modelo/cita';
import { CommonModule } from '@angular/common';
import { Preferences } from '@capacitor/preferences';

addIcons({
  settingsOutline,
  addOutline,
});

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonButtons, IonTitle,
    IonHeader, RouterModule, IonButton,
    IonIcon, IonToolbar, IonFabButton,
    IonFab, CommonModule]
})
export class HomePage implements OnInit {

  public isWeb: boolean = false;
  public load: boolean = false;

  // & Cita que mostraremos en el html
  public cita!: Cita | null;
  public hayCitas: boolean = false;

  constructor(
    private readonly sqlService: SqlServiceService,
    private readonly platform: Platform) {
    addIcons({ settingsOutline, addOutline });
  }

  async ngOnInit() {



    await this.iniciarBaseDatos();


  }

  async verSiPuedeEliminar() {
    const { value } = await Preferences.get({ key: 'permitirBorradoEnInicio' });
    if (value == null) {
      // Guardar en Preferences
      await Preferences.set({
        key: 'permitirBorradoEnInicio',
        value: JSON.stringify(false), // Guardar como string
      });
    }
  }

  async iniciarBaseDatos() {
    this.platform.ready().then(async () => {
      const info = await Device.getInfo();
      this.isWeb = info.platform == 'web';

      this.sqlService.inicializarBaseDatos();
      this.sqlService.dbReady.subscribe(async (load) => {
        if (load) {
          await this.buscarCitaRandom();
        }
        this.load = load;
      })
    })
  }

  async buscarCitaRandom() {
    try {
      const citasLista = await this.sqlService.findAllCitas();
      console.log(citasLista)

      if (citasLista.length === 0) {
        console.log('No hay citas disponibles.');
        return null; // Retorna null si no hay citas
      }

      const randomIndex = Math.floor(Math.random() * citasLista.length); // Obtén un índice aleatorio
      this.cita = citasLista[randomIndex]; // Selecciona la cita en el índice aleatorio

      return this.cita;
    } catch (error) {
      console.error('Error al buscar cita aleatoria:', error);
      return Promise.reject(error);
    }
  }



}



