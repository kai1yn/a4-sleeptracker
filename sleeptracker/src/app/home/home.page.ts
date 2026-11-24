import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  chevronForwardOutline
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

  constructor(public sleepService: SleepService) {

    addIcons({
      'moon-outline': moonOutline,
      'eye-outline': eyeOutline,
      'chevron-forward-outline': chevronForwardOutline
    });

  }

  get latestSleep() {
    const sleepData = SleepService.AllOvernightData;
    return sleepData[sleepData.length - 1];
  }
  get lastSevenDays() {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
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

	get recentSleepData() {
	return [...SleepService.AllOvernightData]
		.sort((a, b) =>
		b.getSleepStart().getTime() -
		a.getSleepStart().getTime()
		);
	}
}