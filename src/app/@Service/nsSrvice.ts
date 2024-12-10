import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment } from '../@Interface/appointment.interface';

@Injectable()
export class NSService {
  constructor(private http: HttpClient) {}

  public getAppointments(): Observable<Array<string>> {
    return this.http.get<Array<string>>(
      `${environment.apiURL}/nsekszer/getAppointments`
    );
  }

  public postNewAppointment(
    appointment: Appointment
  ): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${environment.apiURL}/nsekszer/postNewAppointment`,
      {
        appointment,
      }
    );
  }
}
