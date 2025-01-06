import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonItem, IonLabel, IonToggle, IonToolbar, IonButtons, IonBackButton, IonTitle, IonList } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonTitle, IonBackButton,
    IonButtons, FormsModule, IonContent,
    IonHeader, IonToolbar, IonItem,
    IonLabel, IonToggle],

})
export class ConfiguracionPage implements OnInit {
  permitirBorradoEnInicio: boolean = false;

  constructor() { }

  async ngOnInit() {
    await this.cargarConfiguracion();
  }

  async onSwitchChange(event: any) {
    console.log('Switch toggled:', event.detail.checked);
    this.permitirBorradoEnInicio = event.detail.checked;

    // Guardar en Preferences
    await Preferences.set({
      key: 'permitirBorradoEnInicio',
      value: JSON.stringify(this.permitirBorradoEnInicio), // Guardar como string
    });
  }

  private async cargarConfiguracion() {
    const { value } = await Preferences.get({ key: 'permitirBorradoEnInicio' });
    if (value) {
      this.permitirBorradoEnInicio = JSON.parse(value);
    }
  }
}













