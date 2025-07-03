import {Component, inject, OnInit} from '@angular/core';
import {EventsService, FK13Event} from './services/events.service';
import {CalendarComponent} from './calendar/calendar.component';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf} from '@angular/common';
import {FirestoreService} from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CalendarComponent, FormsModule, NgForOf, DatePipe],
  standalone: true
})
export class AppComponent implements OnInit {
  // Events
  eventsOnSelectedDate: FK13Event[] = [];

  // Artist
  artistNames: string[] = [];
  selectedArtist = '';

  // Calendar
  selectedDate?: Date;

  // New items
  private firestoreService = inject(FirestoreService);
  items: any[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.eventsService.getArtistNames().subscribe(names => this.artistNames = names);
    this.firestoreService.getEvents().subscribe(data => {
      this.items = data;
      console.log('Fetched events from Firestore:', this.items);
    });
    console.log(this.items)
    //this.firestoreService.addItem({ name: 'Sample Item' });
  }

  onDateSelected(date?: Date) {
    this.selectedDate = date;

    if (!date) {
      this.eventsOnSelectedDate = [];
      return;
    }

    this.eventsService.getEventsByArtist(this.selectedArtist).subscribe(data => {
      this.eventsOnSelectedDate = data.filter(event => {
        const parts = event.date.split('-');
        const eventDate = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        return (eventDate.toDateString() === date.toDateString());
      });
    });
  }
}
