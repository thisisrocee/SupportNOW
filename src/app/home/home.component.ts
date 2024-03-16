import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {JsonPipe} from "@angular/common";
import { AppointmentService } from '../calendar/appointment-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe], 
  providers: [AppointmentService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent {
  latestDates: any[] | undefined;
  length: number | undefined;
  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.appointmentService.getLatestDates().subscribe((x: any[]) => this.length = x.length);
  }
}
