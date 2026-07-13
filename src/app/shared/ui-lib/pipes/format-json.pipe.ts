import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatJson',
})
export class FormatJsonPipe implements PipeTransform {
  transform(value: unknown): unknown {
    try {
      const jsonValue = typeof value === 'string' ? JSON.parse(value) : value;
      return JSON.stringify(jsonValue, null, 2) ?? value;
    } catch {
      return value;
    }
  }
}
