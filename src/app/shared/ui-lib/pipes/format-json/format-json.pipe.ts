import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatJson',
})
export class FormatJsonPipe implements PipeTransform {
  transform(value: unknown, indentation: number = 2): unknown {
    try {
      const jsonValue = typeof value === 'string' ? JSON.parse(value) : value;
      return JSON.stringify(jsonValue, null, indentation) ?? value;
    } catch {
      return value;
    }
  }
}
