import { Component } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SleepService } from '../services/sleep.service';

import {
  IonButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  moonOutline,
  eyeOutline,
  chevronForwardOutline,
  chevronBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    DatePipe,
    RouterLink,
    IonButton,
    IonIcon,
    CommonModule
  ],
})

export class HomePage {

  // 0 = current seven-day period
  // 1 = previous seven days
  // 2 = two periods ago, etc.
  weekOffset: number = 0;

  constructor(public sleepService: SleepService) {

    addIcons({
      'moon-outline': moonOutline,
      'eye-outline': eyeOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'chevron-back-outline': chevronBackOutline
    });

  }

  // Navigate to the previous seven days.
  previousWeek() {
    this.weekOffset++;
  }

  // Navigate forward toward the current week.
  nextWeek() {
    if (this.weekOffset > 0) {
      this.weekOffset--;
    }
  }

  // Calculate the seven days being displayed.
  get lastSevenDays() {

    const days = [];

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    endDate.setDate(
      endDate.getDate() - (this.weekOffset * 7)
    );

    for (let i = 6; i >= 0; i--) {

      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      const sleep = SleepService.AllOvernightData.find(record => {
        const sleepDate = record.getSleepStart();

        return sleepDate.toDateString() === date.toDateString();
      });

      let duration = 0;

      if (sleep) {
        duration =
          sleep.getSleepEnd().getTime() -
          sleep.getSleepStart().getTime();
      }

      days.push({
        date: date,
        day: date.toLocaleDateString('en-US', {
          weekday: 'short'
        }),
        duration: duration,
        hours: Math.floor(duration / 3600000),
        minutes: Math.floor((duration % 3600000) / 60000),
        logged: !!sleep
      });
    }

    return days;
  }

  // Display the date range for the selected week.
  get weekLabel() {

    const days = this.lastSevenDays;

    if (days.length === 0) {
      return '';
    }

    const start = days[0].date;
    const end = days[6].date;

    const startLabel = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const endLabel = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `${startLabel} – ${endLabel}`;
  }

  get averageSleep() {

    const loggedDays = this.lastSevenDays.filter(day => day.logged);

    if (loggedDays.length === 0) {
      return '0h 0m';
    }

    const total = loggedDays.reduce(
      (sum, day) => sum + day.duration, 0
    );

    const average = total / loggedDays.length;

    const hours = Math.floor(average / 3600000);
    const minutes = Math.floor((average % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  }

  get nightsLogged() {
    return this.lastSevenDays.filter(day => day.logged).length;
  }

  getBarHeight(duration: number): number {

    const maxSleep = 12 * 60 * 60 * 1000;

    if (duration === 0) {
      return 0;
    }

    return Math.min((duration / maxSleep) * 100, 100);
  }

  get latestSleep() {

    const sleepData = SleepService.AllOvernightData;

    if (sleepData.length === 0) {
      return undefined;
    }

    return [...sleepData].sort((a, b) =>
      b.getSleepStart().getTime() - a.getSleepStart().getTime()
    )[0];
  }

  get recentSleepData() {

    return [...SleepService.AllOvernightData]
      .sort((a, b) =>
        b.getSleepStart().getTime() -
        a.getSleepStart().getTime()
      );
  }

  get latestSleepiness() {

    const sleepinessData = SleepService.AllSleepinessData;

    return sleepinessData[sleepinessData.length - 1];
  }

  get averageSleepiness() {

  const days = this.lastSevenDays;

  const startDate = new Date(days[0].date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(days[6].date);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);

  const weeklyScores = SleepService.AllSleepinessData.filter(data => {

    const loggedAt = new Date(data['loggedAt']);

    return loggedAt >= startDate && loggedAt < endDate;

  });

  if (weeklyScores.length === 0) {
    return '--';
  }

   const total = weeklyScores.reduce(
	(sum, data) => sum + Number((data as any)['loggedValue']),
	0
  );

  return (total / weeklyScores.length).toFixed(1) + ' / 7';
}

}