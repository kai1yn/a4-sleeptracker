import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  IonSelect,
  IonSelectOption,
  IonText,
  IonToast
} from '@ionic/angular/standalone';

import { SleepService } from '../../services/sleep.service';
import { StanfordSleepinessData } from '../../data/stanford-sleepiness-data';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: './log-sleepiness.page.html',
  styleUrls: ['./log-sleepiness.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonText,
    IonToast
  ]
})
export class LogSleepinessPage {

  sleepinessLevel: number | null = null;

  errorMessage: string = '';
  toastOpen: boolean = false;
  toastMessage: string = '';

  constructor(private sleepService: SleepService) {}

  get selectedDescription(): string {
    if (this.sleepinessLevel === null) {
      return 'Select a rating to see its description.';
    }

    return StanfordSleepinessData.ScaleValues[this.sleepinessLevel] || '';
  }

  saveSleepiness() {
    this.errorMessage = '';

    if (
      this.sleepinessLevel === null ||
      this.sleepinessLevel < 1 ||
      this.sleepinessLevel > 7
    ) {
      this.errorMessage = 'Please select a sleepiness rating.';
      return;
    }

    const sleepinessEntry = new StanfordSleepinessData(
      this.sleepinessLevel
    );

    this.sleepService.logSleepinessData(sleepinessEntry);

    this.toastMessage = '✓ Sleepiness logged successfully!';
    this.toastOpen = true;

    this.sleepinessLevel = null;
  }
}