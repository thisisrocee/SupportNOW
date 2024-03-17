import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { AppointmentService } from '../calendar/appointment-service';

@Component({
  selector: 'app-landing',
  standalone: true,
  providers: [AppointmentService],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingComponent implements OnInit {

  ngOnInit(): void {

  }
}