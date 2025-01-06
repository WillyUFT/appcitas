import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormularioCitaComponent } from './formulario-cita.component';

describe('FormularioCitasComponent', () => {
  let component: FormularioCitaComponent;
  let fixture: ComponentFixture<FormularioCitaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormularioCitaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
