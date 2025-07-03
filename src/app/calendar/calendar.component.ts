import {Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgForOf} from '@angular/common';
import {EventsService, FK13Event} from '../services/events.service';

@Component({
  selector: 'calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() artist?: string;
  @Output() dateSelected = new EventEmitter<Date>();

  constructor(private eventsService: EventsService) {}

  // Current day informations
  //today: Date = new Date();
  today: Date = new Date(2025, 6, 25);
  currentYear: number = this.today.getFullYear();
  currentMonth: number = this.today.getMonth();

  // Days and utils to display the calendar
  days: {
    date: number,
    isToday: boolean,
    fullDate: Date,
    isPast: boolean,
    isEnabled: boolean
  }[] = [];
  dayNames: string[] = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  firstDayOffset: number = 0;
  selectedDate?: Date;

  // Changing months...
  currentDisplayedMonth: Date = new Date(this.currentYear, this.currentMonth, 1);

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artist'] && !changes['artist'].firstChange) {
      this.selectedDate = undefined;
      this.dateSelected.emit(this.selectedDate);
      this.generateCalendar();
    }
  }

  events: FK13Event[] = [];
  generateCalendar(): void {
    this.eventsService.getEventsByArtist(this.artist || '').subscribe(data => {
      this.events = data;

      const eventDates = this.events.map(e => new Date(e.date));

      this.days = [];
      const daysAmount = new Date(this.currentDisplayedMonth.getFullYear(), this.currentDisplayedMonth.getMonth() + 1, 0).getDate();
      this.firstDayOffset = new Date(this.currentDisplayedMonth.getFullYear(), this.currentDisplayedMonth.getMonth(), 1).getDay();

      for (let i = 1; i <= daysAmount; i++) {
        const date = new Date(this.currentDisplayedMonth.getFullYear(), this.currentDisplayedMonth.getMonth(), i);

        const isEventDay = eventDates.some(d =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate() - 1
        );

        this.days.push({
          date: i,
          isToday: date.toDateString() === this.today.toDateString(),
          fullDate: date,
          isPast: date < this.today,
          isEnabled: isEventDay
        });
      }
    });
  }

  selectDate(day: { date: number, fullDate: Date }) {
    this.selectedDate = day.fullDate;
    this.dateSelected.emit(day.fullDate);
  }

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  nextMonth() {
    if (this.currentDisplayedMonth.getMonth() === 11) {
      this.currentDisplayedMonth.setFullYear(this.currentDisplayedMonth.getFullYear() + 1, 0, 1);
    } else {
      this.currentDisplayedMonth.setFullYear(this.currentDisplayedMonth.getFullYear(), this.currentDisplayedMonth.getMonth() + 1, 1);
    }
    this.generateCalendar();
  }

  prevMonth() {
    if (!this.isPrevDisabled()) {
      if (this.currentDisplayedMonth.getMonth() === 0) {
        this.currentDisplayedMonth.setFullYear(this.currentDisplayedMonth.getFullYear() - 1, 11, 1);
      } else {
        this.currentDisplayedMonth.setFullYear(this.currentDisplayedMonth.getFullYear(), this.currentDisplayedMonth.getMonth() - 1, 1);
      }
      this.generateCalendar();
    }
  }

  isPrevDisabled(): boolean {
    return (
      this.currentDisplayedMonth.getFullYear() < this.today.getFullYear() ||
      (this.currentDisplayedMonth.getFullYear() == this.today.getFullYear() && this.currentDisplayedMonth.getMonth() <= this.today.getMonth())
    );
  }

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
