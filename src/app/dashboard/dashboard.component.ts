import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {JsonPipe} from "@angular/common";
import { AppointmentService } from '../calendar/appointment-service';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe, CalendarComponent], 
  providers: [AppointmentService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent {
  latestDates: any[] | undefined;
  length: number | undefined;
  constructor(private appointmentService: AppointmentService, private calendarComponent: CalendarComponent) { }

  ngOnInit(): void {
    this.appointmentService.getLatestDates().subscribe((x: any[]) => {
      this.length = x.length
      this.latestDates = x
    });
  }
}
