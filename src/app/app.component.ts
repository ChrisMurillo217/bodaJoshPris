import { Component } from '@angular/core';
import { FormularioAsistenciaComponent } from './components/formulario-asistencia/formulario-asistencia.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormularioAsistenciaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'asistencia-app';
}
