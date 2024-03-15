import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FirebaseOptions } from 'firebase/app';
import { AngularFireModule } from '@angular/fire/compat';
import { UserService } from './core/user.service';


export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBT6Hv6DPfyAXGbrJZTevdcv4tPB68r9UI",
  authDomain: "support-now-417017.firebaseapp.com",
  projectId: "support-now-417017",
  storageBucket: "support-now-417017.appspot.com",
  messagingSenderId: "760312345631",
  appId: "1:760312345631:web:43f89658f00c5cea41912a",
  measurementId: "G-ZM2GV04V5Y"
}



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    UserService
   ]
};
