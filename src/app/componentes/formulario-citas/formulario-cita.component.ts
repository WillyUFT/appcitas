import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonInput, IonItem, IonButton, IonNote, IonLabel } from '@ionic/angular/standalone';
import { mostrarToast } from 'src/app/Util/toast-service';
import { Cita } from 'src/app/modelo/cita';

@Component({
  selector: 'app-formulario-cita',
  templateUrl: './formulario-cita.component.html',
  styleUrls: ['./formulario-cita.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonItem,
    IonButton,
    IonNote,
    IonLabel,
  ],
})
export class FormularioCitaComponent {

  // & Mandamos a agregar la cita
  @Output() onAgregarCita = new EventEmitter<Cita>();

  // & Definimos el formulario
  citaForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder) {
    // ! Configuración del formulario con validaciones
    this.citaForm = this.fb.group({
      frase: ['', [Validators.required, Validators.minLength(5)]], // Campo obligatorio y mínimo 5 caracteres
      autor: ['', [Validators.required, Validators.minLength(2)]] // Campo obligatorio y mínimo 2 caracteres
    });
  }

  // & Función que emite el evento para agregar la cita a la BDD
  async agregar() {
    if (this.citaForm.valid) {
      const cita: Cita = { id: 0, frase: this.citaForm.get('frase')?.value, autor: this.citaForm.get('autor')?.value }
      this.onAgregarCita.emit(cita);
      this.citaForm.reset();
    } else {
      this.citaForm.markAllAsTouched();
      await mostrarToast('Por favor, complete todos los campos correctamente.', 'danger');
    }
  }

  get fraseControl() {
    return this.citaForm.get('frase');
  }

  get autorControl() {
    return this.citaForm.get('autor');
  }
}

