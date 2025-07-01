import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Artist {
  name: string;
  description: string;
  schedule: string[];
}

export interface FK13Event {
  eventName: string;
  clientName: string;
  date: string;
  location: string;
  address: string;
  contacts_on_site: string[];
  artists: Artist[];
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private jsonUrl = 'assets/data/events.json'; // adjust path if needed

  constructor(private http: HttpClient) {}

  getEvents(): Observable<FK13Event[]> {
    return this.http.get<FK13Event[]>(this.jsonUrl);
  }

  getArtistNames(): Observable<string[]> {
    return this.getEvents().pipe(
      map(events => {
        const names = events.flatMap(event => event.artists.map(artist => artist.name));
        return Array.from(new Set(names));
      })
    );
  }

  getSchedulesByArtist(artistName: string): Observable<{ event: FK13Event, schedule: string[] }[]> {
    return this.getEvents().pipe(
      map(events =>
        events.flatMap(event => {
          // If no artistName is provided, include all artists
          const matchingArtists = artistName
            ? event.artists.filter(a => a.name === artistName)
            : event.artists;

          return matchingArtists.map(artist => ({
            event,
            schedule: artist.schedule
          }));
        })
      )
    );
  }

}
