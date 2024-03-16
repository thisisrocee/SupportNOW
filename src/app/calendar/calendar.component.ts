import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import {JsonPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, JsonPipe], 
  templateUrl: './calendar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CalendarComponent implements OnInit 
{
  currentDate : Date | undefined;
  latestDates: any[] | undefined;
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.getLatestDates().subscribe(x => this.latestDates = x);
  }

  getLatestDates(): Observable<any[]> {
    console.log("init");
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          let collection = this.firestore.collection(`users/${user.uid}/appointments`);
          return collection.valueChanges();
        } else {
          return []; // or throw an error/return an observable error
        }
      })
    );
  }
}