import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap } from 'rxjs';

@Injectable()

export class AppointmentService {

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) { }

  getLatestDates(): Observable<any[]> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          let collection = this.firestore.collection(`users/${user.uid}/appointments`, ref => ref.orderBy("appointment_date","asc"));
          return collection.valueChanges();
        } else {
          return []; 
        }
      })
    );
  }
}
