import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { setToastController } from './Util/toast-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private readonly toastController: ToastController
  ) {
    setToastController(this.toastController);
  }
}
