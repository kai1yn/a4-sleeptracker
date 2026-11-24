import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
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
    IonIcon
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

}