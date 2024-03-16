import {Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnInit} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {JsonPipe} from "@angular/common";
import { AppointmentService } from './appointment-service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-calendar',
  standalone: true,
  providers: [AppointmentService],
  imports: [CommonModule, JsonPipe, NgForOf, NgIf],
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

  timeSlots = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  days = [ "2024-03-18", "2024-03-19", "2024-03-20", "2024-03-21", "2024-03-22"];

}
