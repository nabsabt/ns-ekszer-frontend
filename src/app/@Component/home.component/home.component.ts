import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NSService } from '../../@Service/nsSrvice';
import { HttpErrorResponse } from '@angular/common/http';
import { Appointment } from '../../@Interface/appointment.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private userDataListenerSub: Subscription;
  private getAppointmentsSub: Subscription;
  private postNewAppointmentSub: Subscription;

  public isLoggedIn: boolean;
  public role: string = localStorage.getItem('role') || '';

  public appointment: Date | null;
  public selectedDate: Date | null = null;
  public selectedTime: string | null = null;
  public currentDate: Date = new Date();
  name = '';
  email = '';
  public availableHours: string[] = [];
  public reservedAppointments: {
    date: string;
    client: { name: string; email: string };
  }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private nsService: NSService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('role') === 'admin' ? true : false;

    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) this.jumpToSection(fragment);
    });

    this.fetchReservedAppointments();
  }

  // Fetch all reserved appointments from the backend
  private fetchReservedAppointments(): void {
    this.getAppointmentsSub = this.nsService.getAppointments().subscribe({
      next: (res: Array<any>) => {
        this.reservedAppointments = res.map((appointment) => ({
          date: new Date(appointment.date).toISOString(), // Convert MongoDB date to ISO string
          client: {
            name: appointment.client.name,
            email: appointment.client.email,
          },
        }));
      },
    });
  }

  // Fetch reserved hours for the selected date
  fetchReservedHours(event: any): void {
    const selectedDate = event.value; // Extract the selected date
    if (!selectedDate) return;

    const selectedDateStr = this.formatDate(selectedDate); // Format date as YYYY-MM-DD
    const reservedForDate = this.reservedAppointments
      .filter((appointment) => {
        // Filter reserved appointments for the selected date
        const appointmentDate = new Date(appointment.date); // Convert ISO string to Date
        return this.formatDate(appointmentDate) === selectedDateStr;
      })
      .map((appointment) => {
        // Extract time in HH:mm format
        const appointmentDate = new Date(appointment.date);
        return this.formatTime(appointmentDate);
      });

    const allHours = ['12:00', '12:30', '13:00', '13:30'];
    this.availableHours = allHours.filter(
      (hour) => !reservedForDate.includes(hour) // Filter out reserved hours
    );
  }

  // Restrict date picker to Wednesdays only
  public filterDates = (date: Date | null): boolean => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time component for accurate comparison

    // Disable today and allow only Wednesdays
    return date.getDay() === 3 && date.getTime() !== today.getTime();
  };

  // Format a date to YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2-digit month
    const day = date.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
  }

  // Format a date to HH:mm (24-hour time)
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0'); // Ensure 2-digit hours
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure 2-digit minutes
    return `${hours}:${minutes}`;
  }

  jumpToSection(section: string | null) {
    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public onAppointmentSelected(form: NgForm) {
    if (form.invalid) {
      this.snackBar.open('Kérjük, töltse ki az összes mezőt!', '', {
        duration: 3000,
        verticalPosition: 'bottom',
        panelClass: ['danger-snackbar'],
      });
      return;
    }
    const fullAppointmentDate: Date = new Date(form.value.inputDate);
    fullAppointmentDate.setHours(
      parseInt(form.value.startHour.split(':')[0]),
      parseInt(form.value.startHour.split(':')[1])
    );

    const newAppointment: Appointment = {
      client: {
        name: form.value.name,
        email: form.value.email,
      },
      date: fullAppointmentDate,
    };
    this.postNewAppointmentSub = this.nsService
      .postNewAppointment(newAppointment)
      .subscribe({
        next: (res: { status: string }) => {
          this.snackBar.open(res.status, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
          this.fetchReservedAppointments();
          form.reset();
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          this.snackBar.open(error.error.message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['danger-snackbar'],
          });
          return error;
        },
      });
  }

  public openCatalog() {
    const pdfUrl =
      'https://drive.google.com/file/d/1ARS7B5CRK5sL867nfrsadrUhFYom_DxC/view?usp=drive_link';
    window.open(pdfUrl, '_blank');
  }

  public ngOnDestroy(): void {
    if (this.userDataListenerSub) {
      this.userDataListenerSub.unsubscribe();
    }
    this.getAppointmentsSub.unsubscribe();
    if (this.postNewAppointmentSub) {
      this.postNewAppointmentSub.unsubscribe();
    }
  }
}
