import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  pure: true
})
export class TimePipe implements PipeTransform {
  transform(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0 ? `${hours} hour${hours > 1 ? 's' : ''}, ${remainingMinutes} min` : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
}
