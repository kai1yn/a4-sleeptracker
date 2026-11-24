import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {

  public static AllSleepData: SleepData[] = [];
  public static AllOvernightData: OvernightSleepData[] = [];
  public static AllSleepinessData: StanfordSleepinessData[] = [];

  private storageReady = false;

  constructor(private storage: Storage) {}

  // Initialize storage and load previously saved records.
  async initialize(): Promise<void> {
    if (this.storageReady) {
      return;
    }

    await this.storage.create();

    const savedOvernight = await this.storage.get('overnightData');
    const savedSleepiness = await this.storage.get('sleepinessData');

    if (savedOvernight !== null) {
      SleepService.AllOvernightData = savedOvernight.map((item: any) =>
        new OvernightSleepData(
          new Date(item.sleepStart),
          new Date(item.sleepEnd)
        )
      );
    }

    if (savedSleepiness !== null) {
      SleepService.AllSleepinessData = savedSleepiness.map((item: any) =>
        new StanfordSleepinessData(
          item.loggedValue,
          new Date(item.loggedAt)
        )
      );
    }

    SleepService.AllSleepData = [
      ...SleepService.AllOvernightData,
      ...SleepService.AllSleepinessData
    ];

    if (savedOvernight === null && savedSleepiness === null) {
      this.addDefaultData();
      await this.saveAllData();
    }

    this.storageReady = true;
  }

  private addDefaultData(): void {
    let goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1);
    goToBed.setHours(1, 3, 0, 0);

    let wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000);

    this.addOvernightToArrays(
      new OvernightSleepData(goToBed, wakeUp)
    );

    const sleepinessDate = new Date();
    sleepinessDate.setDate(sleepinessDate.getDate() - 1);
    sleepinessDate.setHours(14, 38, 0, 0);

    this.addSleepinessToArrays(
      new StanfordSleepinessData(4, sleepinessDate)
    );

    goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1);
    goToBed.setHours(23, 11, 0, 0);

    wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000);

    this.addOvernightToArrays(
      new OvernightSleepData(goToBed, wakeUp)
    );
  }

  private addOvernightToArrays(sleepData: OvernightSleepData): void {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllOvernightData.push(sleepData);
  }

  private addSleepinessToArrays(
    sleepData: StanfordSleepinessData
  ): void {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);
  }

  public async logOvernightData(
    sleepData: OvernightSleepData
  ): Promise<void> {
    this.addOvernightToArrays(sleepData);
    await this.saveAllData();
  }

  public async logSleepinessData(
    sleepData: StanfordSleepinessData
  ): Promise<void> {
    this.addSleepinessToArrays(sleepData);
    await this.saveAllData();
  }

  // Saves to storage
  private async saveAllData(): Promise<void> {
    const overnightToSave =
      SleepService.AllOvernightData.map(item => ({
        sleepStart: item.getSleepStart().toISOString(),
        sleepEnd: item.getSleepEnd().toISOString()
      }));

    const sleepinessToSave =
    SleepService.AllSleepinessData.map(item => {
        const rawData = JSON.parse(JSON.stringify(item));

        return {
            loggedValue: rawData.loggedValue,
            loggedAt: rawData.loggedAt
        };
    });

    await this.storage.set('overnightData', overnightToSave);
    await this.storage.set('sleepinessData', sleepinessToSave);
  }
}