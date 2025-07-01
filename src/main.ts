import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {provideServiceWorker} from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js'),
  ]
}).catch((err) => console.error(err));
