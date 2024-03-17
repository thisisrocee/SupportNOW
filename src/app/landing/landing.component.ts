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
    this.loadJsFile("assets/js/main.js");  
  }

  public loadJsFile(url: string) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);  
  }  
}