import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonToast,
  IonButtons,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { homeOutline } from 'ionicons/icons';

import { SleepService } from '../../services/sleep.service';
import { OvernightSleepData } from '../../data/overnight-sleep-data';

@Component({
  selector: 'app-log-sleep',
  templateUrl: './log-sleep.page.html',
  styleUrls: ['./log-sleep.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonText,
    IonToast,
    IonButtons,
    IonIcon
  ]
})
export class LogSleepPage {

  toastOpen: boolean = false;
  toastMessage: string = '';
  sleepDate: string = this.getTodayDate();
  bedtime: string = '';
  wakeUpTime: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private sleepService: SleepService) {
    addIcons({
      homeOutline
    });
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  get sleepDuration(): string {
    if (!this.sleepDate || !this.bedtime || !this.wakeUpTime) {
      return 'Not calculated yet';
    }

    const start = new Date(`${this.sleepDate}T${this.bedtime}`);
    const end = new Date(`${this.sleepDate}T${this.wakeUpTime}`);

    // If wake-up time is earlier than bedtime,
    // assume the person woke up the following day.
    if (end.getTime() <= start.getTime()) {
      end.setDate(end.getDate() + 1);
    }

    const difference = end.getTime() - start.getTime();

    if (difference <= 0 || difference > 24 * 60 * 60 * 1000) {
      return 'Invalid sleep times';
    }

    const totalMinutes = Math.floor(difference / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} hours, ${minutes} minutes`;
  }

  async saveSleep() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.sleepDate || !this.bedtime || !this.wakeUpTime) {
      this.errorMessage = 'Please select a date, bedtime, and wake-up time.';
      return;
    }

    const start = new Date(`${this.sleepDate}T${this.bedtime}`);
    const end = new Date(`${this.sleepDate}T${this.wakeUpTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.errorMessage = 'Please enter valid sleep information.';
      return;
    }

    if (end.getTime() <= start.getTime()) {
      end.setDate(end.getDate() + 1);
    }

    if (end.getTime() - start.getTime() > 24 * 60 * 60 * 1000) {
      this.errorMessage = 'Sleep duration cannot exceed 24 hours.';
      return;
    }

    const sleepEntry = new OvernightSleepData(start, end);

    await this.sleepService.logOvernightData(sleepEntry);

    this.toastMessage = 'Your sleep has been logged!';
    this.toastOpen = true;

    this.sleepDate = this.getTodayDate();
    this.bedtime = '';
    this.wakeUpTime = '';
  }
}