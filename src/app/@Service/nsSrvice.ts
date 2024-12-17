import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment } from '../@Interface/appointment.interface';

@Injectable()
export class NSService {
  constructor(private http: HttpClient) {}

  public getAppointments(): Observable<Array<Appointment>> {
    return this.http.get<Array<Appointment>>(
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

  public deleteAppointment(_id: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${environment.apiURL}/nsekszer/deleteAppointment/${_id}`
    );
  }
}
