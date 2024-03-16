import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {JsonPipe} from "@angular/common";
import { AppointmentService } from './appointment-service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  providers: [AppointmentService],
  imports: [CommonModule, JsonPipe], 
  templateUrl: './calendar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CalendarComponent implements OnInit 
{
  currentDate : Date | undefined;
  latestDates: any[] | undefined;
  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.appointmentService.getLatestDates().subscribe((x: any[]) => this.latestDates = x);
  }
}