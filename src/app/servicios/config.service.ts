import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: { [key: string]: boolean } = {
    permitirBorradoEnInicio: false,
  };

  obtenerConfiguracion() {
    return this.config;
  }

  actualizarConfiguracion(clave: string, valor: boolean) {
    this.config[clave] = valor;
  }
}


