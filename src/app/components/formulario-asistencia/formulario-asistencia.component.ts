import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import html2canvas from 'html2canvas';

import { QrService } from '../../services/qr.service';

@Component({
  selector: 'app-formulario-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    HttpClientModule
  ],
  templateUrl: './formulario-asistencia.component.html',
  styleUrl: './formulario-asistencia.component.css'
})
export class FormularioAsistenciaComponent implements OnInit {
  asistira: boolean | null = null;
  nombre: string = '';
  casado: boolean | null = null;
  nombrePareja: string = '';
  qrCode: string = '';
  imageBase64: string = '';

  constructor(
    private qrService: QrService,
    private __http: HttpClient) {}

  ngOnInit(): void {}

  capitalizeWords(text: string): string {
    return text
      .split(' ')
      .filter(word => word.trim().length > 0)
      .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  async generarQr() {
    if (this.asistira) {
      this.nombre = this.capitalizeWords(this.nombre);
      if (this.casado && this.nombrePareja) {
        this.nombrePareja = this.capitalizeWords(this.nombrePareja);
        this.qrCode = await this.qrService.generateQrCode(this.nombre, true, this.nombrePareja);
      } else {
        this.qrCode = await this.qrService.generateQrCode(this.nombre, false);
      }
    }
  }

  descargarQR(qrBlock: HTMLElement) {
    const options = {
      backgroundColor: "#fff",
      scale: 0.8 // Reducir tamaño para móviles
    };
    html2canvas(qrBlock, options).then(canvas => {
      const link = document.createElement('a');
      this.imageBase64 = canvas.toDataURL('image/png');

      link.href = canvas.toDataURL('image/png');
      link.download = `${this.nombre}-invitacion.png`;
      link.click();

      const AIRTABLE_TOKEN = 'pat8HEH1BY0d9ZOV4.13769a518e3a720c30344437cf2aed9e76f52e197f39e7015d78c93804ee0a9e'; // Tu token personal
      const BASE_ID = 'appECycBzowt85U19'; // Tu base ID
      const TABLE_NAME = 'Asistencia'; // Cambia por el nombre real de tu tabla
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'WeddingApp/1.0'
      });

      const registro = {
        fields: {
          asistencia: this.asistira ? 'Sí' : 'No',
          nombre: this.nombre || '',
          casado: this.casado ? 'Sí' : 'No',
          nombrePareja: this.nombrePareja,
          fecha: new Date().toISOString(),
          invitacion: this.imageBase64
        }
      };

      this.__http.post(url, registro, { headers }).subscribe({
        next: () => {
          console.log('Registro guardado en Airtable');
          alert('¡Registro guardado en Airtable!');
        },
        error: err => {
          let errorMsg = 'Error al guardar en Airtable';
          if (err.error) {
            errorMsg += `: ${err.error.error?.message || JSON.stringify(err.error)}`;
          } else {
            errorMsg += `: ${err.message || JSON.stringify(err)}`;
          }
          console.error(errorMsg, err);
        }
      });
    }).catch(error => {
      console.error('Error al generar QR:', error);
      alert('Error al generar el código QR. Por favor intenta nuevamente.');
    });
  }
}
