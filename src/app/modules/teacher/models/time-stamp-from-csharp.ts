export class TimeStampFromCSharp {
  ticks: bigint;
  days: number;
  hours: number;
  milliseconds: bigint;
  minutes: number;
  seconds: bigint;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: bigint;
  totalMinutes: bigint;
  totalSeconds: bigint;

  constructor(obj?: any) {
    if (obj) {
      this.ticks = obj.ticks;
      this.days = obj.days;
      this.hours = obj.hours;
      this.milliseconds = obj.milliseconds;
      this.minutes = obj.minutes;
      this.seconds = obj.seconds;
      this.totalDays = obj.totalDays;
      this.totalHours = obj.totalHours;
      this.totalMilliseconds = obj.totalMilliseconds;
      this.totalMinutes = obj.totalMinutes;
      this.totalSeconds = obj.totalSeconds;
    }
  }
}
