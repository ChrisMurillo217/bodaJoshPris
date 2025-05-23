import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as QRCode from 'qrcode';

@Injectable({providedIn: 'root'})
export class QrService {
  constructor(private http: HttpClient) {}

  saveToAirtable(record: any) {
    return this.http.post('/.netlify/functions/saveToAirtable', record);
  }

  async generateQrCode(name: string, isMarried: boolean, partnerName?: string): Promise<string> {
    let qrData: string;
    if (isMarried && partnerName)
      qrData = `${name} y ${partnerName} - Pase para 2 personas`;
    else
      qrData = `${name} - Pase para 1`;
    // Genera el QR como DataURL
    return await QRCode.toDataURL(qrData);
  }
}
