import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value < 0) {
      return '';
    }

    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    if (minutes === 0) {
      return `${seconds} seconds`;
    } else {
      return `${minutes} minute${
        minutes !== 1 ? 's' : ''
      } and ${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  }
}
