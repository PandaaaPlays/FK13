import {Component, OnInit} from '@angular/core';
import {EventsService, FK13Event} from './services/events.service';
import {CalendarComponent} from './calendar/calendar.component';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CalendarComponent, FormsModule, NgForOf],
  standalone: true
})
export class AppComponent implements OnInit {
  artistNames: string[] = [];
  selectedArtist = '';
  constructor(private eventService: EventsService) {}

  ngOnInit() {
    this.eventService.getArtistNames().subscribe(names => this.artistNames = names);
  }
}
